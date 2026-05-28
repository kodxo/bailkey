"use server";

import { createOwner, updateOwner } from "@/lib/dal/owners";
import { ownerSchema } from "@/lib/schemas/owner.schema";
import { revalidatePath } from "next/cache";

export type ActionState = {
  success?: boolean;
  errors?: Record<string, string[]>;
  message?: string;
  data?: any;
};

export async function ownerFormAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());
  
  const validatedFields = ownerSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Veuillez corriger les erreurs du formulaire.",
    };
  }

  const data = validatedFields.data;

  // Cleanup optional empty strings
  const payload = {
    ...data,
    firstName: data.firstName || null,
    lastName: data.lastName || null,
    companyName: data.companyName || null,
    email: data.email || null,
    address: data.address || null,
    identityDocument: data.identityDocument || null,
    registrationNumber: data.registrationNumber || null,
    taxNumber: data.taxNumber || null,
  };

  try {
    if (payload.id) {
      // Update
      const res = await updateOwner(payload.id, payload);
      if (!res.success) {
        return { success: false, message: res.error || "Erreur lors de la mise à jour." };
      }
      revalidatePath("/admin/owners");
      return { success: true, message: "Propriétaire mis à jour avec succès.", data: res.owner };
    } else {
      // Create
      const res = await createOwner(payload);
      if (!res.success) {
        return { success: false, message: res.error || "Erreur lors de la création." };
      }
      revalidatePath("/admin/owners");
      return { success: true, message: "Propriétaire créé avec succès.", data: res.owner };
    }
  } catch (e) {
    return { success: false, message: "Erreur interne du serveur." };
  }
}

// Backward compatibility for app/(agence) components
import type { SaveOwnerInputDTO } from "@/lib/dal/owners";
export async function createOwnerAction(data: SaveOwnerInputDTO) { return createOwner(data); }
export async function updateOwnerAction(id: string, data: Partial<SaveOwnerInputDTO>) { return updateOwner(id, data); }
