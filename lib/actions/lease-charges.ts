"use server";

import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/clerk/auth-context";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const LeaseChargeSchema = z.object({
  leaseId: z.string().min(1, "Le bail est requis"),
  chargeTypeId: z.string().min(1, "Le type de charge est requis"),
  defaultAmount: z.number().min(0, "Le montant doit être positif"),
});

export type LeaseChargeActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    leaseId?: string[];
    chargeTypeId?: string[];
    defaultAmount?: string[];
  };
};

export async function createLeaseCharge(
  prevState: LeaseChargeActionState,
  formData: FormData
): Promise<LeaseChargeActionState> {
  try {
    const { orgId } = await getAuthContext();

    const validatedFields = LeaseChargeSchema.safeParse({
      leaseId: formData.get("leaseId"),
      chargeTypeId: formData.get("chargeTypeId"),
      defaultAmount: Number(formData.get("defaultAmount")),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        fieldErrors: validatedFields.error.flatten().fieldErrors,
        error: "Veuillez corriger les erreurs du formulaire.",
      };
    }

    const { leaseId, chargeTypeId, defaultAmount } = validatedFields.data;

    // Vérifier l'appartenance
    const lease = await prisma.lease.findUnique({ where: { id: leaseId } });
    const chargeType = await prisma.chargeType.findUnique({ where: { id: chargeTypeId } });

    if (!lease || lease.organizationId !== orgId) {
      return { success: false, error: "Bail introuvable ou accès non autorisé" };
    }
    if (!chargeType || chargeType.organizationId !== orgId) {
      return { success: false, error: "Type de charge introuvable ou accès non autorisé" };
    }

    // Vérifier si la charge existe déjà pour ce bail
    const existing = await prisma.leaseCharge.findFirst({
      where: {
        organizationId: orgId,
        leaseId,
        chargeTypeId,
      },
    });

    if (existing) {
      return { success: false, error: "Cette charge est déjà configurée pour ce bail." };
    }

    await prisma.leaseCharge.create({
      data: {
        organizationId: orgId,
        leaseId,
        chargeTypeId,
        defaultAmount,
      },
    });

    revalidatePath("/dashboard/gestion/charges");
    revalidatePath("/dashboard/gestion/baux");
    
    return { success: true };
  } catch (error) {
    console.error("createLeaseCharge error:", error);
    return { success: false, error: "Une erreur inattendue s'est produite." };
  }
}

export async function updateLeaseCharge(
  id: string,
  prevState: LeaseChargeActionState,
  formData: FormData
): Promise<LeaseChargeActionState> {
  try {
    const { orgId } = await getAuthContext();

    const defaultAmountValue = formData.get("defaultAmount");
    if (!defaultAmountValue) {
      return { success: false, error: "Le montant est requis" };
    }

    const defaultAmount = Number(defaultAmountValue);
    if (isNaN(defaultAmount) || defaultAmount < 0) {
      return { success: false, error: "Le montant doit être valide et positif" };
    }

    const lc = await prisma.leaseCharge.findUnique({ where: { id } });
    if (!lc || lc.organizationId !== orgId) {
      return { success: false, error: "Ligne de charge introuvable" };
    }

    await prisma.leaseCharge.update({
      where: { id },
      data: { defaultAmount },
    });

    revalidatePath("/dashboard/gestion/charges");
    revalidatePath("/dashboard/gestion/baux");
    
    return { success: true };
  } catch (error) {
    console.error("updateLeaseCharge error:", error);
    return { success: false, error: "Une erreur inattendue s'est produite." };
  }
}

export async function deleteLeaseCharge(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { orgId } = await getAuthContext();

    const lc = await prisma.leaseCharge.findUnique({ where: { id } });
    if (!lc || lc.organizationId !== orgId) {
      return { success: false, error: "Ligne de charge introuvable" };
    }

    await prisma.leaseCharge.delete({ where: { id } });

    revalidatePath("/dashboard/gestion/charges");
    revalidatePath("/dashboard/gestion/baux");
    
    return { success: true };
  } catch (error) {
    console.error("deleteLeaseCharge error:", error);
    return { success: false, error: "Une erreur inattendue s'est produite lors de la suppression." };
  }
}
