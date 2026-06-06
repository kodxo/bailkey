/**
 * Serializer to transform Prisma schedule payloads into display DTOs.
 * Used by both the table server and sidebar server components (DRY).
 */

import type { ScheduleDTO } from "@/lib/types/property";

export interface SchedulePaymentDTO {
  id: string;
  amount: number;
  date: string;
  method: string;
  reference?: string;
}

export interface ScheduleDisplayDTO {
  id: string;
  leaseId: string;
  tenantId?: string;
  propertyId?: string;
  tenantName: string;
  propertyInfo: string;
  date: string;
  amount: number; // This is totalAmount
  rentAmount?: number;
  chargesAmount?: number;
  remaining: number;
  status: "OVERDUE" | "PENDING" | "PARTIAL" | "PAID";
  isLocked: boolean;
  payments: SchedulePaymentDTO[];
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function serializeSchedule(s: ScheduleDTO): ScheduleDisplayDTO {
  const amount = Number(s.totalAmount);
  const amountPaid = Number(s.amountPaid);

  const tenant = s.lease?.tenant;
  const tenantName = tenant
    ? `${tenant.lastName || ""} ${tenant.firstName || ""}`.trim() ||
      tenant.companyName ||
      "Locataire Inconnu"
    : "Locataire Inconnu";

  return {
    id: s.id,
    leaseId: s.leaseId,
    tenantId: tenant?.id,
    propertyId: s.lease?.property?.id,
    tenantName,
    propertyInfo: s.lease?.property?.designation || "Bien Inconnu",
    date: dateFormatter.format(new Date(s.dueDate)),
    amount,
    rentAmount: Number(s.rentAmount),
    chargesAmount: Number(s.chargesAmount),
    remaining: amount - amountPaid,
    status: s.status,
    isLocked: s.isLocked,
    payments: (s.payments || []).map((p) => ({
      id: p.id,
      amount: Number(p.amount),
      date: dateFormatter.format(new Date(p.paymentDate)),
      method: p.paymentMethod,
      reference: p.reference ?? undefined,
    })),
  };
}
