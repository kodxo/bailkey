"use server";

import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/clerk/auth-context";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { AccountingMode } from "../generated/prisma/enums";

const chargeTypeSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  accountingMode: z.enum([AccountingMode.CREDIT, AccountingMode.DEBIT]),
  isDefault: z.boolean().optional(),
  isUtility: z.boolean().optional(),
});

export async function createChargeTypeAction(
  prevState: any,
  formData: FormData,
) {
  try {
    const { orgId } = await getAuthContext();

    const isDefault = formData.get("isDefault") === "on";
    const isUtility = formData.get("isUtility") === "on";

    const validatedFields = chargeTypeSchema.safeParse({
      name: formData.get("name"),
      accountingMode: formData.get("accountingMode"),
      isDefault,
      isUtility,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Veuillez vérifier les champs du formulaire",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const data = validatedFields.data;

    await prisma.chargeType.create({
      data: {
        organizationId: orgId,
        name: data.name,
        accountingMode: data.accountingMode,
        isDefault: data.isDefault || false,
        isUtility: data.isUtility || false,
      },
    });

    revalidatePath("/dashboard/gestion/charges");
    revalidatePath("/dashboard/configuration/operations/types-charge");
    return { success: true };
  } catch (error) {
    console.error("Erreur createChargeTypeAction:", error);
    return {
      success: false,
      error: "Erreur serveur lors de la création de la charge",
    };
  }
}

export async function updateChargeTypeAction(
  id: string,
  prevState: any,
  formData: FormData,
) {
  try {
    const { orgId } = await getAuthContext();

    const isDefault = formData.get("isDefault") === "on";
    const isUtility = formData.get("isUtility") === "on";

    const validatedFields = chargeTypeSchema.safeParse({
      name: formData.get("name"),
      accountingMode: formData.get("accountingMode"),
      isDefault,
      isUtility,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Veuillez vérifier les champs du formulaire",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const data = validatedFields.data;

    await prisma.chargeType.update({
      where: { id, organizationId: orgId },
      data: {
        name: data.name,
        accountingMode: data.accountingMode,
        isDefault: data.isDefault || false,
        isUtility: data.isUtility || false,
      },
    });

    revalidatePath("/dashboard/gestion/charges");
    revalidatePath("/dashboard/configuration/operations/types-charge");
    return { success: true };
  } catch (error) {
    console.error("Erreur updateChargeTypeAction:", error);
    return {
      success: false,
      error: "Erreur serveur lors de la modification de la charge",
    };
  }
}
