/**
 * Serializer to transform Prisma schedule payloads into display DTOs.
 * Used by both the table server and sidebar server components (DRY).
 */

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
  tenantName: string;
  propertyInfo: string;
  date: string;
  amount: number;
  remaining: number;
  status: "OVERDUE" | "PENDING" | "PARTIAL" | "PAID";
  isLocked: boolean;
  payments: SchedulePaymentDTO[];
}

interface PrismaPayment {
  id: string;
  amount: number | { toNumber: () => number };
  paymentDate: string | Date;
  paymentMethod: string;
  reference?: string;
}

interface PrismaSchedule {
  id: string;
  leaseId: string;
  amount: number | { toNumber: () => number };
  amountPaid: number | { toNumber: () => number };
  dueDate: string | Date;
  status: "OVERDUE" | "PENDING" | "PARTIAL" | "PAID";
  isLocked: boolean;
  payments?: PrismaPayment[];
  lease?: {
    tenant?: {
      lastName?: string | null;
      firstName?: string | null;
      companyName?: string | null;
    } | null;
    property?: {
      name?: string | null;
    } | null;
  } | null;
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function toNumber(val: number | { toNumber: () => number }): number {
  return typeof val === "number" ? val : val.toNumber();
}

export function serializeSchedule(s: PrismaSchedule): ScheduleDisplayDTO {
  const amount = toNumber(s.amount);
  const amountPaid = toNumber(s.amountPaid);

  const tenant = s.lease?.tenant;
  const tenantName = tenant
    ? `${tenant.lastName || ""} ${tenant.firstName || ""}`.trim() ||
      tenant.companyName ||
      "Locataire Inconnu"
    : "Locataire Inconnu";

  return {
    id: s.id,
    leaseId: s.leaseId,
    tenantName,
    propertyInfo: s.lease?.property?.name || "Bien Inconnu",
    date: dateFormatter.format(new Date(s.dueDate)),
    amount,
    remaining: amount - amountPaid,
    status: s.status,
    isLocked: s.isLocked,
    payments: (s.payments || []).map((p) => ({
      id: p.id,
      amount: toNumber(p.amount),
      date: dateFormatter.format(new Date(p.paymentDate)),
      method: p.paymentMethod,
      reference: p.reference,
    })),
  };
}
