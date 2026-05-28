"use server";

import { createTenant, updateTenant } from "@/lib/dal/tenants";
import { tenantSchema } from "@/lib/schemas/tenant.schema";
import { revalidatePath } from "next/cache";

export type ActionState = {
  success?: boolean;
  errors?: Record<string, string[]>;
  message?: string;
  data?: any;
};

export async function tenantFormAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());
  
  const validatedFields = tenantSchema.safeParse(rawData);

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
      const res = await updateTenant(payload.id, payload);
      if (!res.success) {
        return { success: false, message: res.error || "Erreur lors de la mise à jour." };
      }
      revalidatePath("/admin/tenants");
      return { success: true, message: "Locataire mis à jour avec succès.", data: res.tenant };
    } else {
      // Create
      const res = await createTenant(payload);
      if (!res.success) {
        return { success: false, message: res.error || "Erreur lors de la création." };
      }
      revalidatePath("/admin/tenants");
      return { success: true, message: "Locataire créé avec succès.", data: res.tenant };
    }
  } catch (e) {
    return { success: false, message: "Erreur interne du serveur." };
  }
}

// Backward compatibility for app/(agence) components
import type { SaveTenantInputDTO } from "@/lib/dal/tenants";
export async function createTenantAction(data: SaveTenantInputDTO) { return createTenant(data); }
export async function updateTenantAction(id: string, data: Partial<SaveTenantInputDTO>) { return updateTenant(id, data); }
