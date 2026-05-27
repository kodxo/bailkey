"use server";

import { createOwner, updateOwner, type SaveOwnerInputDTO } from "@/lib/dal/owners";

export async function createOwnerAction(data: SaveOwnerInputDTO) {
  return createOwner(data);
}

export async function updateOwnerAction(id: string, data: Partial<SaveOwnerInputDTO>) {
  return updateOwner(id, data);
}
