import { z } from "zod";
import { LeaseStatus } from "../generated/prisma/enums";

export const VALID_STATUS_TRANSITIONS: Record<LeaseStatus, LeaseStatus[]> = {
  DRAFT: [LeaseStatus.ACTIVE, LeaseStatus.TERMINATED],
  ACTIVE: [LeaseStatus.TERMINATED, LeaseStatus.EXPIRED],
  TERMINATED: [],
  EXPIRED: [],
};

export function validateStatusTransition(from: LeaseStatus, to: LeaseStatus): boolean {
  if (from === to) return true;
  return VALID_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

export const LeaseSchema = z.object({
  propertyId: z.string().min(1, "La propriété est requise"),
  tenantId: z.string().min(1, "Le locataire est requis"),
  rentAmount: z.coerce.number().positive("Le loyer doit être supérieur à 0"),
  depositAmount: z.coerce.number().min(0).optional().nullable(),
  startDate: z.coerce.date(),
  endDate: z.string().optional().transform((val) => (val ? new Date(val) : null)),
  paymentFrequency: z.enum(["MONTHLY", "QUARTERLY", "SEMI_ANNUALLY", "ANNUALLY"]).optional(),
  paymentDay: z.coerce.number().min(1).max(31).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "TERMINATED", "EXPIRED"]).optional(),
  charges: z.string().optional().transform((val) => {
    if (!val) return [];
    try {
      return JSON.parse(val) as { chargeTypeId: string; amount: number }[];
    } catch {
      return [];
    }
  }),
});
