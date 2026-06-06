import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/clerk/auth-context";
import { AccountingMode } from "../generated/prisma/enums";

export interface ChargeTypeDTO {
  id: string;
  name: string;
  accountingMode: AccountingMode;
  isDefault: boolean;
  isUtility: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getChargeTypes(): Promise<{ success: boolean; data?: ChargeTypeDTO[]; error?: string }> {
  try {
    const { orgId } = await getAuthContext();
    const charges = await prisma.chargeType.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: charges.map((c) => ({
        id: c.id,
        name: c.name,
        accountingMode: c.accountingMode,
        isDefault: c.isDefault,
        isUtility: c.isUtility,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Erreur getChargeTypes:", error);
    return { success: false, error: "Erreur lors de la récupération des charges" };
  }
}

export async function getChargeTypesPaginated(params: {
  page: number;
  pageSize: number;
  search?: string;
}): Promise<{
  success: boolean;
  data?: ChargeTypeDTO[];
  total?: number;
  error?: string;
}> {
  try {
    const { orgId } = await getAuthContext();
    const { page, pageSize, search } = params;
    const skip = (page - 1) * pageSize;

    const where = {
      organizationId: orgId,
      ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}),
    };

    const [total, items] = await prisma.$transaction([
      prisma.chargeType.count({ where }),
      prisma.chargeType.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      success: true,
      total,
      data: items.map((c) => ({
        id: c.id,
        name: c.name,
        accountingMode: c.accountingMode,
        isDefault: c.isDefault,
        isUtility: c.isUtility,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Erreur getChargeTypesPaginated:", error);
    return { success: false, error: "Erreur lors de la récupération des charges" };
  }
}

export async function getChargeTypeById(id: string): Promise<{
  success: boolean;
  data?: ChargeTypeDTO;
  error?: string;
}> {
  try {
    const { orgId } = await getAuthContext();
    const c = await prisma.chargeType.findUnique({
      where: { id },
    });

    if (!c || c.organizationId !== orgId) {
      return { success: false, error: "Type de charge introuvable" };
    }

    return {
      success: true,
      data: {
        id: c.id,
        name: c.name,
        accountingMode: c.accountingMode,
        isDefault: c.isDefault,
        isUtility: c.isUtility,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Erreur getChargeTypeById:", error);
    return { success: false, error: "Erreur lors de la récupération de la charge" };
  }
}
