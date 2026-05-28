"use server";

import { createLease, updateLease } from "@/lib/dal/leases";
import { revalidatePath } from "next/cache";
import { LeaseSchema } from "@/lib/schemas/lease.schema";
import type { LeaseDTO } from "@/lib/types/property";
export type LeaseActionState = {
  success?: boolean;
  error?: string;
  errors?: Record<string, string[]>;
  lease?: LeaseDTO | null;
  schedulesGenerated?: number;
  schedulesDeleted?: number;
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
