import { z } from "zod";
import { LegalEntityType } from "@/lib/generated/prisma/enums";

export const ownerSchema = z
  .object({
    id: z.string().optional(),
    type: z.enum([LegalEntityType.INDIVIDUAL, LegalEntityType.COMPANY]),
    firstName: z.string().optional().nullable(),
    lastName: z.string().optional().nullable(),
    companyName: z.string().optional().nullable(),
    email: z
      .string()
      .email("Email invalide")
      .optional()
      .or(z.literal(""))
      .nullable(),
    phone: z.string().min(1, "Téléphone requis"),
    address: z.string().optional().nullable(),
    identityDocument: z.string().optional().nullable(),
    registrationNumber: z.string().optional().nullable(),
    taxNumber: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      if (
        data.type === LegalEntityType.INDIVIDUAL &&
        (!data.firstName || !data.lastName)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Le prénom et nom de famille sont obligatoires pour un particulier.",
      path: ["firstName"],
    }
  )
  .refine(
    (data) => {
      if (data.type === LegalEntityType.COMPANY && !data.companyName) {
        return false;
      }
      return true;
    },
    {
      message: "Le nom de la société est obligatoire.",
      path: ["companyName"],
    }
  );

export type OwnerInput = z.infer<typeof ownerSchema>;
