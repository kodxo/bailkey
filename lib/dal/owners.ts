import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/clerk/auth-context";
import { LegalEntityType } from "../generated/prisma/enums";
import type { OwnerDTO } from "@/lib/types/property";

export function serializeOwner(raw: {
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
  properties?: { id: string }[];
  createdAt: Date;
  updatedAt: Date;
}): OwnerDTO {
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
    propertiesCount: raw.properties ? raw.properties.length : 0,
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
  };
}

export async function getOwners(): Promise<{
  success: boolean;
  owners: OwnerDTO[];
  totalCount: number;
  error?: string;
}> {
  try {
    const { orgId } = await getAuthContext();
    const owners = await prisma.owner.findMany({
      where: { organizationId: orgId },
      include: { properties: true },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      owners: owners.map(serializeOwner),
      totalCount: owners.length,
    };
  } catch (error: unknown) {
    console.error("Erreur getOwners:", error);
    return {
      success: false,
      owners: [],
      totalCount: 0,
      error: "Erreur lors de la récupération des propriétaires",
    };
  }
}

export async function getOwnerById(id: string): Promise<{
  success: boolean;
  owner: OwnerDTO | null;
  error?: string;
}> {
  try {
    const { orgId } = await getAuthContext();
    const owner = await prisma.owner.findUnique({
      where: { id },
      include: { properties: true },
    });

    if (!owner || owner.organizationId !== orgId) {
      return { success: false, owner: null, error: "Propriétaire non trouvé" };
    }

    return { success: true, owner: serializeOwner(owner) };
  } catch (error: unknown) {
    console.error("Erreur getOwnerById:", error);
    return {
      success: false,
      owner: null,
      error: "Erreur de récupération du propriétaire",
    };
  }
}

export interface SaveOwnerInputDTO {
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

export async function createOwner(
  input: SaveOwnerInputDTO
): Promise<{ success: boolean; owner: OwnerDTO | null; error?: string }> {
  try {
    const { orgId } = await getAuthContext();

    const newOwner = await prisma.owner.create({
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
      include: { properties: true },
    });

    return { success: true, owner: serializeOwner(newOwner) };
  } catch (error: unknown) {
    console.error("Erreur createOwner:", error);
    return {
      success: false,
      owner: null,
      error: "Erreur lors de la création du propriétaire",
    };
  }
}

export async function updateOwner(
  id: string,
  input: Partial<SaveOwnerInputDTO>
): Promise<{ success: boolean; owner: OwnerDTO | null; error?: string }> {
  try {
    const { orgId } = await getAuthContext();
    const existing = await prisma.owner.findUnique({ where: { id } });
    if (!existing || existing.organizationId !== orgId) {
      return { success: false, owner: null, error: "Propriétaire non trouvé" };
    }

    const updated = await prisma.owner.update({
      where: { id },
      data: input,
      include: { properties: true },
    });

    return { success: true, owner: serializeOwner(updated) };
  } catch (error: unknown) {
    console.error("Erreur updateOwner:", error);
    return {
      success: false,
      owner: null,
      error: "Erreur lors de la mise à jour du propriétaire",
    };
  }
}
