import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/clerk/auth-context";
import { AccountingMode, LegalEntityType } from "../generated/prisma/enums";

export interface LeaseChargeDTO {
  id: string;
  leaseId: string;
  leasePropertyDesignation: string;
  leasePropertyReference: string;
  leaseTenantFullName: string;
  chargeTypeId: string;
  chargeTypeName: string;
  chargeTypeAccountingMode: AccountingMode;
  defaultAmount: number;
  createdAt: string;
  updatedAt: string;
}

export async function getLeaseChargesPaginated(params: {
  page: number;
  pageSize: number;
  search?: string;
  propertyId?: string;
  tenantId?: string;
  chargeTypeId?: string;
}): Promise<{
  success: boolean;
  data?: LeaseChargeDTO[];
  total?: number;
  error?: string;
}> {
  try {
    const { orgId } = await getAuthContext();
    const { page, pageSize, search, propertyId, tenantId, chargeTypeId } = params;
    const skip = (page - 1) * pageSize;

    const where: any = {
      organizationId: orgId,
    };

    if (search) {
      where.OR = [
        { lease: { property: { designation: { contains: search, mode: "insensitive" } } } },
        { lease: { property: { reference: { contains: search, mode: "insensitive" } } } },
        { lease: { tenant: { firstName: { contains: search, mode: "insensitive" } } } },
        { lease: { tenant: { lastName: { contains: search, mode: "insensitive" } } } },
        { lease: { tenant: { companyName: { contains: search, mode: "insensitive" } } } },
      ];
    }
    if (propertyId && propertyId !== "all") {
      where.lease = { ...where.lease, propertyId };
    }
    if (tenantId && tenantId !== "all") {
      where.lease = { ...where.lease, tenantId };
    }
    if (chargeTypeId && chargeTypeId !== "all") {
      where.chargeTypeId = chargeTypeId;
    }

    const [total, items] = await prisma.$transaction([
      prisma.leaseCharge.count({ where }),
      prisma.leaseCharge.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          lease: {
            include: {
              property: true,
              tenant: true,
            },
          },
          chargeType: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      success: true,
      total,
      data: items.map((lc) => {
        const t = lc.lease.tenant;
        const tenantFullName =
          t.type === LegalEntityType.COMPANY
            ? t.companyName || "Société inconnue"
            : `${t.firstName || ""} ${t.lastName || ""}`.trim() || "Anonyme";

        return {
          id: lc.id,
          leaseId: lc.leaseId,
          leasePropertyDesignation: lc.lease.property.designation,
          leasePropertyReference: lc.lease.property.reference,
          leaseTenantFullName: tenantFullName,
          chargeTypeId: lc.chargeTypeId,
          chargeTypeName: lc.chargeType.name,
          chargeTypeAccountingMode: lc.chargeType.accountingMode,
          defaultAmount: lc.defaultAmount.toNumber(),
          createdAt: lc.createdAt.toISOString(),
          updatedAt: lc.updatedAt.toISOString(),
        };
      }),
    };
  } catch (error) {
    console.error("Erreur getLeaseChargesPaginated:", error);
    return { success: false, error: "Erreur lors de la récupération des lignes de charges" };
  }
}

export async function getLeaseChargeById(id: string): Promise<{
  success: boolean;
  data?: LeaseChargeDTO;
  error?: string;
}> {
  try {
    const { orgId } = await getAuthContext();
    const lc = await prisma.leaseCharge.findUnique({
      where: { id },
      include: {
        lease: {
          include: {
            property: true,
            tenant: true,
          },
        },
        chargeType: true,
      },
    });

    if (!lc || lc.organizationId !== orgId) {
      return { success: false, error: "Ligne de charge introuvable" };
    }

    const t = lc.lease.tenant;
    const tenantFullName =
      t.type === LegalEntityType.COMPANY
        ? t.companyName || "Société inconnue"
        : `${t.firstName || ""} ${t.lastName || ""}`.trim() || "Anonyme";

    return {
      success: true,
      data: {
        id: lc.id,
        leaseId: lc.leaseId,
        leasePropertyDesignation: lc.lease.property.designation,
        leasePropertyReference: lc.lease.property.reference,
        leaseTenantFullName: tenantFullName,
        chargeTypeId: lc.chargeTypeId,
        chargeTypeName: lc.chargeType.name,
        chargeTypeAccountingMode: lc.chargeType.accountingMode,
        defaultAmount: lc.defaultAmount.toNumber(),
        createdAt: lc.createdAt.toISOString(),
        updatedAt: lc.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Erreur getLeaseChargeById:", error);
    return { success: false, error: "Erreur lors de la récupération de la ligne de charge" };
  }
}
