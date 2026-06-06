"use server";

import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/clerk/auth-context";
import { ScheduleStatus, PaymentMethod } from "../generated/prisma/enums";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const PaymentSchema = z.object({
  scheduleId: z.string().min(1, "L'échéance est requise"),
  amount: z.coerce.number().positive("Le montant doit être supérieur à 0"),
  paymentDate: z.coerce.date(),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "MOBILE_MONEY", "CHEQUE"]),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export type PaymentState = {
  success?: boolean;
  error?: string;
  errors?: Record<string, string[]>;
};

export async function recordPaymentAction(
  prevState: PaymentState | null,
  formData: FormData,
): Promise<PaymentState> {
  try {
    const { orgId } = await getAuthContext();

    const validatedFields = PaymentSchema.safeParse({
      scheduleId: formData.get("scheduleId"),
      amount: formData.get("amount"),
      paymentDate: formData.get("paymentDate"),
      paymentMethod: formData.get("paymentMethod"),
      reference: (formData.get("reference") as string) || undefined,
      notes: (formData.get("notes") as string) || undefined,
    });
    console.log(validatedFields);

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Certains champs sont invalides.",
        errors: validatedFields.error.flatten((issue) => issue.message)
          .fieldErrors,
      };
    }

    const data = validatedFields.data;

    // 1. Find the schedule
    const schedule = await prisma.rentSchedule.findUnique({
      where: { id: data.scheduleId },
    });

    if (!schedule || schedule.organizationId !== orgId) {
      return { success: false, error: "Échéance introuvable." };
    }

    const expectedAmount =
      typeof schedule.totalAmount === "number"
        ? schedule.totalAmount
        : schedule.totalAmount.toNumber();
    const currentPaid =
      typeof schedule.amountPaid === "number"
        ? schedule.amountPaid
        : schedule.amountPaid.toNumber();

    const newPaidAmount = currentPaid + data.amount;

    // 2. Determine new status
    let newStatus: ScheduleStatus = ScheduleStatus.PENDING;
    if (newPaidAmount >= expectedAmount) {
      newStatus = ScheduleStatus.PAID;
    } else if (newPaidAmount > 0) {
      newStatus = ScheduleStatus.PARTIAL;
    }

    // 3. Perform transaction: create payment and update schedule
    await prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          organizationId: orgId,
          scheduleId: schedule.id,
          amount: data.amount,
          paymentDate: data.paymentDate,
          paymentMethod: data.paymentMethod,
          reference: data.reference,
          notes: data.notes,
        },
      });

      await tx.rentSchedule.update({
        where: { id: schedule.id },
        data: {
          amountPaid: newPaidAmount,
          status: newStatus,
          isLocked: true, // Toujours verrouillé s'il y a un paiement
        },
      });
    });

    revalidatePath("/dashboard/gestion/echeances");
    revalidatePath(`/dashboard/gestion/baux/${schedule.leaseId}`);

    return { success: true };
  } catch (error) {
    console.error("Erreur recordPaymentAction:", error);
    return { success: false, error: "Impossible d'enregistrer le paiement." };
  }
}
