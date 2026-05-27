"use server";

import { createProperty, updateProperty, type SavePropertyInputDTO } from "@/lib/dal/properties";

export async function createPropertyAction(data: SavePropertyInputDTO) {
  return createProperty(data);
}

export async function updatePropertyAction(id: string, data: Partial<SavePropertyInputDTO>) {
  return updateProperty(id, data);
}
