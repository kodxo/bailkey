import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/clerk/auth-context";
import { LeaseStatus, LegalEntityType, PaymentFrequency } from "../generated/prisma/enums";
import type { LeaseDTO } from "@/lib/types/property";
import { generateRentSchedulesForLease } from "./schedules";


export function serializeLease(raw: {
  id: string;
  organizationId: string;
  propertyId: string;
  tenantId: string;
  startDate: Date;
  endDate: Date | null;
  rentAmount: { toNumber: () => number } | number;
  depositAmount: { toNumber: () => number } | number | null;
  status: LeaseStatus;
  property: {
    designation: string;
    reference: string;
  };
  tenant: {
    type: LegalEntityType;
    firstName: string | null;
    lastName: string | null;
    companyName: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}): LeaseDTO {
  const rentNum =
    typeof raw.rentAmount === "number"
      ? raw.rentAmount
      : raw.rentAmount.toNumber();
  const depositNum =
    raw.depositAmount === null || raw.depositAmount === undefined
      ? null
      : typeof raw.depositAmount === "number"
      ? raw.depositAmount
      : raw.depositAmount.toNumber();

  const t = raw.tenant;
  const tenantFullName =
    t.type === LegalEntityType.COMPANY
      ? t.companyName || "Société inconnue"
      : `${t.firstName || ""} ${t.lastName || ""}`.trim() || "Anonyme";

  return {
    id: raw.id,
    organizationId: raw.organizationId,
    propertyId: raw.propertyId,
    propertyDesignation: raw.property.designation,
    propertyReference: raw.property.reference,
    tenantId: raw.tenantId,
    tenantFullName,
    startDate: raw.startDate.toISOString().split("T")[0],
    endDate: raw.endDate ? raw.endDate.toISOString().split("T")[0] : null,
    rentAmount: rentNum,
    depositAmount: depositNum,
    status: raw.status,
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
  };
}

export async function getLeases(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}): Promise<{
  success: boolean;
  leases: LeaseDTO[];
  totalCount: number;
  activeCount: number;
  draftCount: number;
  error?: string;
}> {
  try {
    const { orgId } = await getAuthContext();
    
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const search = params?.search?.trim() || "";
    const statusFilter = params?.status && params.status !== "all" ? params.status : undefined;

    // Constuire le filtre `where` de base
    const whereClause: any = { organizationId: orgId };
    
    if (statusFilter) {
      whereClause.status = statusFilter;
    }
    
    if (search) {
      whereClause.OR = [
        { property: { designation: { contains: search, mode: 'insensitive' } } },
        { property: { reference: { contains: search, mode: 'insensitive' } } },
        { tenant: { firstName: { contains: search, mode: 'insensitive' } } },
        { tenant: { lastName: { contains: search, mode: 'insensitive' } } },
        { tenant: { companyName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const skip = (page - 1) * pageSize;

    const [leases, totalCount, activeCount, draftCount] = await prisma.$transaction([
      prisma.lease.findMany({
        where: whereClause,
        include: { property: true, tenant: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.lease.count({ where: whereClause }),
      prisma.lease.count({ where: { organizationId: orgId, status: LeaseStatus.ACTIVE } }),
      prisma.lease.count({ where: { organizationId: orgId, status: LeaseStatus.DRAFT } }),
    ]);

    return {
      success: true,
      leases: leases.map(serializeLease),
      totalCount,
      activeCount,
      draftCount,
    };
  } catch (error: unknown) {
    console.error("Erreur getLeases:", error);
    return {
      success: false,
      leases: [],
      totalCount: 0,
      activeCount: 0,
      draftCount: 0,
      error: "Erreur lors de la récupération des baux",
    };
  }
}

export async function getLeaseById(id: string): Promise<{
  success: boolean;
  lease: LeaseDTO | null;
  error?: string;
}> {
  try {
    const { orgId } = await getAuthContext();
    const lease = await prisma.lease.findUnique({
      where: { id },
      include: { property: true, tenant: true },
    });

    if (!lease || lease.organizationId !== orgId) {
      return { success: false, lease: null, error: "Contrat de bail non trouvé" };
    }

    return { success: true, lease: serializeLease(lease) };
  } catch (error: unknown) {
    console.error("Erreur getLeaseById:", error);
    return {
      success: false,
      lease: null,
      error: "Erreur de récupération du contrat de bail",
    };
  }
}

export interface SaveLeaseInputDTO {
  propertyId: string;
  tenantId: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  rentAmount: number;
  depositAmount?: number | null;
  paymentFrequency?: PaymentFrequency;
  paymentDay?: number;
  status?: LeaseStatus;
}

export async function createLease(
  input: SaveLeaseInputDTO
): Promise<{ success: boolean; lease: LeaseDTO | null; error?: string }> {
  try {
    const { orgId } = await getAuthContext();

    const parsedStartDate = new Date(input.startDate);
    const parsedEndDate = input.endDate ? new Date(input.endDate) : undefined;

    const newLease = await prisma.lease.create({
      data: {
        organizationId: orgId,
        propertyId: input.propertyId,
        tenantId: input.tenantId,
        startDate: parsedStartDate,
        ...(parsedEndDate && { endDate: parsedEndDate }),
        rentAmount: input.rentAmount,
        depositAmount: input.depositAmount,
        paymentFrequency: input.paymentFrequency || PaymentFrequency.MONTHLY,
        paymentDay: input.paymentDay || 5,
        status: input.status || LeaseStatus.ACTIVE,
      },
      include: { property: true, tenant: true },
    });

    // Also update property status to RENTED and currentLeaseId if ACTIVE
    if (newLease.status === LeaseStatus.ACTIVE) {
      await prisma.property.update({
        where: { id: input.propertyId },
        data: {
          status: "RENTED",
          currentLeaseId: newLease.id,
        },
      });

      // Generate rent schedules (échéances) automatically
      await generateRentSchedulesForLease(newLease.id);
    }

    return { success: true, lease: serializeLease(newLease) };
  } catch (error: unknown) {
    console.error("Erreur createLease:", error);
    return {
      success: false,
      lease: null,
      error: "Erreur lors de la création du contrat de bail",
    };
  }
}

export async function updateLease(
  id: string,
  input: Partial<SaveLeaseInputDTO>
): Promise<{ success: boolean; lease: LeaseDTO | null; error?: string }> {
  try {
    const { orgId } = await getAuthContext();
    const existing = await prisma.lease.findUnique({ where: { id } });
    if (!existing || existing.organizationId !== orgId) {
      return { success: false, lease: null, error: "Contrat de bail non trouvé" };
    }

    const { startDate, endDate, ...restInput } = input;
    const parsedStartDate = startDate ? new Date(startDate) : undefined;
    const parsedEndDate =
      endDate === null
        ? null
        : endDate
        ? new Date(endDate)
        : undefined;

    const updated = await prisma.lease.update({
      where: { id },
      data: {
        ...restInput,
        ...(parsedStartDate !== undefined && { startDate: parsedStartDate }),
        ...(parsedEndDate !== undefined && { endDate: parsedEndDate }),
      },
      include: { property: true, tenant: true },
    });

    if (updated.status === LeaseStatus.ACTIVE) {
      await prisma.property.update({
        where: { id: updated.propertyId },
        data: {
          status: "RENTED",
          currentLeaseId: updated.id,
        },
      });
    } else if (existing.status === LeaseStatus.ACTIVE) {
      await prisma.property.update({
        where: { id: updated.propertyId },
        data: {
          status: "AVAILABLE",
          currentLeaseId: null,
        },
      });
    }

    return { success: true, lease: serializeLease(updated) };
  } catch (error: unknown) {
    console.error("Erreur updateLease:", error);
    return {
      success: false,
      lease: null,
      error: "Erreur lors de la mise à jour du contrat de bail",
    };
  }
}
