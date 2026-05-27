"use server";

import { createLease, updateLease, type SaveLeaseInputDTO } from "@/lib/dal/leases";

export async function createLeaseAction(data: SaveLeaseInputDTO) {
  return createLease(data);
}

export async function updateLeaseAction(id: string, data: Partial<SaveLeaseInputDTO>) {
  return updateLease(id, data);
}
