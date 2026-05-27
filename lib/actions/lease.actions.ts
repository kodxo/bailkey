"use server";

import { createLease, updateLease } from "@/lib/dal/leases";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { LeaseStatus, PaymentFrequency } from "../generated/prisma/enums";
import type { LeaseDTO } from "@/lib/types/property";

const LeaseSchema = z.object({
  propertyId: z.string().min(1, "La propriété est requise"),
  tenantId: z.string().min(1, "Le locataire est requis"),
  rentAmount: z.coerce.number().positive("Le loyer doit être supérieur à 0"),
  depositAmount: z.coerce.number().min(0).optional().nullable(),
  startDate: z.coerce.date(),
  endDate: z.string().optional().transform(val => val ? new Date(val) : null),
  paymentFrequency: z.enum(["MONTHLY", "QUARTERLY", "SEMI_ANNUALLY", "ANNUALLY"]).optional(),
  paymentDay: z.coerce.number().min(1).max(31).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "TERMINATED", "EXPIRED"]).optional(),
});

export type LeaseActionState = {
  success?: boolean;
  error?: string;
  errors?: Record<string, string[]>;
  lease?: LeaseDTO | null;
};

export async function createLeaseAction(prevState: LeaseActionState | null, formData: FormData): Promise<LeaseActionState> {
  const validatedFields = LeaseSchema.safeParse({
    propertyId: formData.get("propertyId"),
    tenantId: formData.get("tenantId"),
    rentAmount: formData.get("rentAmount"),
    depositAmount: formData.get("depositAmount") || null,
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") || undefined,
    paymentFrequency: formData.get("paymentFrequency") || "MONTHLY",
    paymentDay: formData.get("paymentDay") || 5,
    status: formData.get("status") || "ACTIVE",
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Certains champs sont invalides.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const result = await createLease(validatedFields.data);
  if (result.success) {
    revalidatePath("/dashboard/gestion/baux");
  }
  return result;
}

export async function updateLeaseAction(id: string, prevState: LeaseActionState | null, formData: FormData): Promise<LeaseActionState> {
  const validatedFields = LeaseSchema.safeParse({
    propertyId: formData.get("propertyId"),
    tenantId: formData.get("tenantId"),
    rentAmount: formData.get("rentAmount"),
    depositAmount: formData.get("depositAmount") || null,
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") || undefined,
    paymentFrequency: formData.get("paymentFrequency") || "MONTHLY",
    paymentDay: formData.get("paymentDay") || 5,
    status: formData.get("status") || "ACTIVE",
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Certains champs sont invalides.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const result = await updateLease(id, validatedFields.data);
  if (result.success) {
    revalidatePath("/dashboard/gestion/baux");
  }
  return result;
}
