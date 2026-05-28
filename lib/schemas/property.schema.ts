import { z } from "zod";
import { PropertyType, PropertyStatus } from "@/lib/generated/prisma/enums";

export const propertySchema = z.object({
  id: z.string().optional(),
  reference: z.string().min(1, "La référence est obligatoire."),
  designation: z.string().min(1, "La désignation est obligatoire."),
  description: z.string().optional().nullable(),
  propertyType: z.nativeEnum(PropertyType),
  address: z.string().min(1, "L'adresse est obligatoire."),
  city: z.string().min(1, "La ville est obligatoire."),
  area: z.coerce.number().optional().nullable(),
  roomsCount: z.coerce.number().optional().nullable(),
  baseRent: z.coerce.number().min(0, "Le loyer doit être positif."),
  status: z.nativeEnum(PropertyStatus),
  ownerId: z.string().optional().nullable(),
});

export type PropertyInput = z.infer<typeof propertySchema>;
