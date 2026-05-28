import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/clerk/auth-context";
import {
  PropertyType,
  PropertyStatus,
  CommissionType,
  LegalEntityType,
} from "../generated/prisma/enums";
import type { PropertyDTO, PropertyImageDTO, OwnerSummaryDTO } from "@/lib/types/property";

// Serializer
export function serializeProperty(raw: {
  id: string;
  organizationId: string;
  createdById: string;
  reference: string;
  designation: string;
  description: string | null;
  propertyType: PropertyType;
  address: string;
  country: string;
  city: string;
  neighborhood: string | null;
  zone: string | null;
  area: number | null;
  roomsCount: number | null;
  floor: string | null;
  landTitle: string | null;
  parcelNumber: string | null;
  cadastralSection: string | null;
  baseRent: { toNumber: () => number } | number;
  currentRent: { toNumber: () => number } | number | null;
  currency: string;
  commissionType: CommissionType | null;
  commissionValue: number | null;
  status: PropertyStatus;
  currentLeaseId: string | null;
  images: {
    id: string;
    url: string;
    fileKey: string;
    isCover: boolean;
    caption: string | null;
    sortOrder: number;
  }[];
  owners: {
    owner: {
      id: string;
      type: LegalEntityType;
      firstName: string | null;
      lastName: string | null;
      companyName: string | null;
      email: string | null;
      phone: string | null;
    };
    share: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}): PropertyDTO {
  const baseRentNum =
    typeof raw.baseRent === "number"
      ? raw.baseRent
      : raw.baseRent.toNumber();
  const currentRentNum =
    raw.currentRent === null || raw.currentRent === undefined
      ? null
      : typeof raw.currentRent === "number"
      ? raw.currentRent
      : raw.currentRent.toNumber();

  const imagesDTO: PropertyImageDTO[] = raw.images.map((img) => ({
    id: img.id,
    url: img.url,
    fileKey: img.fileKey,
    isCover: img.isCover,
    caption: img.caption,
    sortOrder: img.sortOrder,
  }));

  const ownersDTO: OwnerSummaryDTO[] = raw.owners.map((po) => {
    const o = po.owner;
    const fullName =
      o.type === LegalEntityType.COMPANY
        ? o.companyName || "Société inconnue"
        : `${o.firstName || ""} ${o.lastName || ""}`.trim() || "Anonyme";

    return {
      id: o.id,
      type: o.type,
      fullName,
      email: o.email,
      phone: o.phone,
      share: po.share,
    };
  });

  return {
    id: raw.id,
    organizationId: raw.organizationId,
    createdById: raw.createdById,
    reference: raw.reference,
    designation: raw.designation,
    description: raw.description,
    propertyType: raw.propertyType,
    address: raw.address,
    country: raw.country,
    city: raw.city,
    neighborhood: raw.neighborhood,
    zone: raw.zone,
    area: raw.area,
    roomsCount: raw.roomsCount,
    floor: raw.floor,
    landTitle: raw.landTitle,
    parcelNumber: raw.parcelNumber,
    cadastralSection: raw.cadastralSection,
    baseRent: baseRentNum,
    currentRent: currentRentNum,
    currency: raw.currency,
    commissionType: raw.commissionType,
    commissionValue: raw.commissionValue,
    status: raw.status,
    currentLeaseId: raw.currentLeaseId,
    images: imagesDTO,
    owners: ownersDTO,
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
  };
}

// DAL Methods
export async function getProperties(params?: {
  status?: PropertyStatus;
  includeIds?: string[];
}): Promise<{
  success: boolean;
  properties: PropertyDTO[];
  totalCount: number;
  error?: string;
}> {
  try {
    const { orgId } = await getAuthContext();

    const whereClause: any = { organizationId: orgId };
    if (params?.status || (params?.includeIds && params.includeIds.length > 0)) {
      whereClause.OR = [];
      if (params.status) {
        whereClause.OR.push({ status: params.status });
      }
      if (params.includeIds && params.includeIds.length > 0) {
        whereClause.OR.push({ id: { in: params.includeIds } });
      }
    }

    const properties = await prisma.property.findMany({
      where: whereClause,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        owners: { include: { owner: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      properties: properties.map(serializeProperty),
      totalCount: properties.length,
    };
  } catch (error: unknown) {
    console.error("Erreur getProperties:", error);
    return {
      success: false,
      properties: [],
      totalCount: 0,
      error: "Erreur lors de la récupération des propriétés",
    };
  }
}

export async function getPropertyById(id: string): Promise<{
  success: boolean;
  property: PropertyDTO | null;
  error?: string;
}> {
  try {
    const { orgId } = await getAuthContext();
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        owners: { include: { owner: true } },
      },
    });

    if (!property || property.organizationId !== orgId) {
      return { success: false, property: null, error: "Propriété non trouvée" };
    }

    return { success: true, property: serializeProperty(property) };
  } catch (error: unknown) {
    console.error("Erreur getPropertyById:", error);
    return {
      success: false,
      property: null,
      error: "Erreur de récupération de la propriété",
    };
  }
}

export interface SavePropertyInputDTO {
  reference: string;
  designation: string;
  description?: string | null;
  propertyType: PropertyType;
  address: string;
  country?: string;
  city: string;
  neighborhood?: string | null;
  zone?: string | null;
  area?: number | null;
  roomsCount?: number | null;
  floor?: string | null;
  landTitle?: string | null;
  parcelNumber?: string | null;
  cadastralSection?: string | null;
  baseRent: number;
  currentRent?: number | null;
  currency?: string;
  commissionType?: CommissionType | null;
  commissionValue?: number | null;
  status?: PropertyStatus;
  ownerId?: string; // Optional initial owner
  owners?: { ownerId: string; share: number }[];
  images?: { url: string; fileKey: string; isCover?: boolean; caption?: string | null; sortOrder?: number }[];
}

export async function createProperty(
  input: SavePropertyInputDTO
): Promise<{ success: boolean; property: PropertyDTO | null; error?: string }> {
  try {
    const { userId, orgId } = await getAuthContext();

    const newProperty = await prisma.property.create({
      data: {
        organizationId: orgId,
        createdById: userId,
        reference: input.reference,
        designation: input.designation,
        description: input.description,
        propertyType: input.propertyType,
        address: input.address,
        country: input.country || "Cameroun",
        city: input.city,
        neighborhood: input.neighborhood,
        zone: input.zone,
        area: input.area,
        roomsCount: input.roomsCount,
        floor: input.floor,
        landTitle: input.landTitle,
        parcelNumber: input.parcelNumber,
        cadastralSection: input.cadastralSection,
        baseRent: input.baseRent,
        currentRent: input.currentRent || input.baseRent,
        currency: input.currency || "XAF",
        commissionType: input.commissionType,
        commissionValue: input.commissionValue,
        status: input.status || PropertyStatus.AVAILABLE,
        owners: {
          create: input.owners && input.owners.length > 0
            ? input.owners.map((o) => ({ ownerId: o.ownerId, share: o.share }))
            : input.ownerId
            ? [{ ownerId: input.ownerId, share: 100.0 }]
            : [],
        },
        images: {
          create: input.images
            ? input.images.map((img) => ({
                url: img.url,
                fileKey: img.fileKey,
                isCover: img.isCover || false,
                caption: img.caption || null,
                sortOrder: img.sortOrder || 0,
              }))
            : [],
        },
      },
      include: {
        images: true,
        owners: { include: { owner: true } },
      },
    });

    return { success: true, property: serializeProperty(newProperty) };
  } catch (error: unknown) {
    console.error("Erreur createProperty:", error);
    return {
      success: false,
      property: null,
      error: "Erreur lors de la création de la propriété",
    };
  }
}

export async function updateProperty(
  id: string,
  input: Partial<SavePropertyInputDTO>
): Promise<{ success: boolean; property: PropertyDTO | null; error?: string }> {
  try {
    const { orgId } = await getAuthContext();
    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing || existing.organizationId !== orgId) {
      return { success: false, property: null, error: "Propriété non trouvée" };
    }

    const { ownerId, owners, images, ...updateFields } = input;

    if (owners !== undefined) {
      await prisma.propertyOwner.deleteMany({ where: { propertyId: id } });
      if (owners && owners.length > 0) {
        await prisma.propertyOwner.createMany({
          data: owners.map((o) => ({
            propertyId: id,
            ownerId: o.ownerId,
            share: o.share,
          })),
        });
      }
    }

    if (images !== undefined) {
      await prisma.propertyImage.deleteMany({ where: { propertyId: id } });
      if (images && images.length > 0) {
        await prisma.propertyImage.createMany({
          data: images.map((img, idx) => ({
            propertyId: id,
            url: img.url,
            fileKey: img.fileKey,
            isCover: img.isCover || idx === 0,
            caption: img.caption || null,
            sortOrder: img.sortOrder ?? idx,
          })),
        });
      }
    }

    const updated = await prisma.property.update({
      where: { id },
      data: {
        ...updateFields,
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        owners: { include: { owner: true } },
      },
    });

    return { success: true, property: serializeProperty(updated) };
  } catch (error: unknown) {
    console.error("Erreur updateProperty:", error);
    return {
      success: false,
      property: null,
      error: "Erreur lors de la mise à jour de la propriété",
    };
  }
}
