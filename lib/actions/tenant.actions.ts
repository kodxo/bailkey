"use server";

import { createTenant, updateTenant, type SaveTenantInputDTO } from "@/lib/dal/tenants";

export async function createTenantAction(data: SaveTenantInputDTO) {
  return createTenant(data);
}

export async function updateTenantAction(id: string, data: Partial<SaveTenantInputDTO>) {
  return updateTenant(id, data);
}
