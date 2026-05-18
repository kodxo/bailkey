import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/clerk/auth-context";
import { LegalEntityType } from "../generated/prisma/enums";
import type { TenantDTO } from "@/lib/types/property";

export function serializeTenant(raw: {
  id: string;
  organizationId: string;
  clerkUserId: string | null;
  type: LegalEntityType;
  firstName: string | null;
  lastName: string | null;
  identityDocument: string | null;
  companyName: string | null;
  registrationNumber: string | null;
  taxNumber: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  leases?: { id: string }[];
  createdAt: Date;
  updatedAt: Date;
}): TenantDTO {
  return {
    id: raw.id,
    organizationId: raw.organizationId,
    clerkUserId: raw.clerkUserId,
    type: raw.type,
    firstName: raw.firstName,
    lastName: raw.lastName,
    identityDocument: raw.identityDocument,
    companyName: raw.companyName,
    registrationNumber: raw.registrationNumber,
    taxNumber: raw.taxNumber,
    email: raw.email,
    phone: raw.phone,
    address: raw.address,
    activeLeasesCount: raw.leases ? raw.leases.length : 0,
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
  };
}

export async function getAdminTenants(): Promise<{
  success: boolean;
  tenants: TenantDTO[];
  totalCount: number;
  error?: string;
}> {
  try {
    const { orgId } = await getAuthContext();
    const tenants = await prisma.tenant.findMany({
      where: { organizationId: orgId },
      include: { leases: true },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      tenants: tenants.map(serializeTenant),
      totalCount: tenants.length,
    };
  } catch (error: unknown) {
    console.error("Erreur getAdminTenants:", error);
    return {
      success: false,
      tenants: [],
      totalCount: 0,
      error: "Erreur lors de la récupération des locataires",
    };
  }
}

export async function getAdminTenantById(id: string): Promise<{
  success: boolean;
  tenant: TenantDTO | null;
  error?: string;
}> {
  try {
    const { orgId } = await getAuthContext();
    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: { leases: true },
    });

    if (!tenant || tenant.organizationId !== orgId) {
      return { success: false, tenant: null, error: "Locataire non trouvé" };
    }

    return { success: true, tenant: serializeTenant(tenant) };
  } catch (error: unknown) {
    console.error("Erreur getAdminTenantById:", error);
    return {
      success: false,
      tenant: null,
      error: "Erreur de récupération du locataire",
    };
  }
}

export interface SaveTenantInputDTO {
  clerkUserId?: string | null;
  type: LegalEntityType;
  firstName?: string | null;
  lastName?: string | null;
  identityDocument?: string | null;
  companyName?: string | null;
  registrationNumber?: string | null;
  taxNumber?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export async function createAdminTenant(
  input: SaveTenantInputDTO
): Promise<{ success: boolean; tenant: TenantDTO | null; error?: string }> {
  try {
    const { orgId } = await getAuthContext();

    const newTenant = await prisma.tenant.create({
      data: {
        organizationId: orgId,
        clerkUserId: input.clerkUserId,
        type: input.type,
        firstName: input.firstName,
        lastName: input.lastName,
        identityDocument: input.identityDocument,
        companyName: input.companyName,
        registrationNumber: input.registrationNumber,
        taxNumber: input.taxNumber,
        email: input.email,
        phone: input.phone,
        address: input.address,
      },
      include: { leases: true },
    });

    return { success: true, tenant: serializeTenant(newTenant) };
  } catch (error: unknown) {
    console.error("Erreur createAdminTenant:", error);
    return {
      success: false,
      tenant: null,
      error: "Erreur lors de la création du locataire",
    };
  }
}

export async function updateAdminTenant(
  id: string,
  input: Partial<SaveTenantInputDTO>
): Promise<{ success: boolean; tenant: TenantDTO | null; error?: string }> {
  try {
    const { orgId } = await getAuthContext();
    const existing = await prisma.tenant.findUnique({ where: { id } });
    if (!existing || existing.organizationId !== orgId) {
      return { success: false, tenant: null, error: "Locataire non trouvé" };
    }

    const updated = await prisma.tenant.update({
      where: { id },
      data: input,
      include: { leases: true },
    });

    return { success: true, tenant: serializeTenant(updated) };
  } catch (error: unknown) {
    console.error("Erreur updateAdminTenant:", error);
    return {
      success: false,
      tenant: null,
      error: "Erreur lors de la mise à jour du locataire",
    };
  }
}
