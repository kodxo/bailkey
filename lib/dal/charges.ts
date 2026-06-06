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
