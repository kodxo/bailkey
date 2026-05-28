"use server";

import { createProperty, updateProperty } from "@/lib/dal/properties";
import { propertySchema } from "@/lib/schemas/property.schema";
import { revalidatePath } from "next/cache";

export type ActionState = {
  success?: boolean;
  errors?: Record<string, string[]>;
  message?: string;
  data?: any;
};

export async function propertyFormAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());
  
  const validatedFields = propertySchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Veuillez corriger les erreurs du formulaire.",
    };
  }

  const data = validatedFields.data;

  const payload = {
    ...data,
    description: data.description || null,
    area: data.area || undefined,
    roomsCount: data.roomsCount || undefined,
    ownerId: data.ownerId || undefined,
  };

  try {
    if (payload.id) {
      // Update
      const res = await updateProperty(payload.id, payload);
      if (!res.success) {
        return { success: false, message: res.error || "Erreur lors de la mise à jour." };
      }
      revalidatePath("/admin/properties");
      return { success: true, message: "Propriété mise à jour avec succès.", data: res.property };
    } else {
      // Create
      const res = await createProperty(payload);
      if (!res.success) {
        return { success: false, message: res.error || "Erreur lors de la création." };
      }
      revalidatePath("/admin/properties");
      return { success: true, message: "Propriété créée avec succès.", data: res.property };
    }
  } catch (e) {
    return { success: false, message: "Erreur interne du serveur." };
  }
}

// Backward compatibility for app/(agence) components
import type { SavePropertyInputDTO } from "@/lib/dal/properties";
export async function createPropertyAction(data: SavePropertyInputDTO) { return createProperty(data); }
export async function updatePropertyAction(id: string, data: Partial<SavePropertyInputDTO>) { return updateProperty(id, data); }
