import {
  PropertyType,
  PropertyStatus,
  CommissionType,
  LegalEntityType,
  LeaseStatus,
} from "../generated/prisma/enums";

export interface PropertyImageDTO {
  id: string;
  url: string;
  fileKey: string;
  isCover: boolean;
  caption: string | null;
  sortOrder: number;
}

export interface OwnerSummaryDTO {
  id: string;
  type: LegalEntityType;
  fullName: string;
  email: string | null;
  phone: string | null;
  share: number;
}

export interface PropertyDTO {
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
  baseRent: number;
  currentRent: number | null;
  currency: string;
  commissionType: CommissionType | null;
  commissionValue: number | null;
  status: PropertyStatus;
  currentLeaseId: string | null;
  images: PropertyImageDTO[];
  owners: OwnerSummaryDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface OwnerDTO {
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
  propertiesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TenantDTO {
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
  activeLeasesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LeaseDTO {
  id: string;
  organizationId: string;
  propertyId: string;
  propertyDesignation: string;
  propertyReference: string;
  tenantId: string;
  tenantFullName: string;
  startDate: string;
  endDate: string | null;
  rentAmount: number;
  depositAmount: number | null;
  status: LeaseStatus;
  createdAt: string;
  updatedAt: string;
}

// Responses DTOs
export interface GetPropertiesResponseDTO {
  success: boolean;
  properties: PropertyDTO[];
  totalCount: number;
  error?: string;
}

export interface GetPropertyByIdResponseDTO {
  success: boolean;
  property: PropertyDTO | null;
  error?: string;
}

export interface SavePropertyResponseDTO {
  success: boolean;
  property: PropertyDTO | null;
  error?: string;
}

export interface GetOwnersResponseDTO {
  success: boolean;
  owners: OwnerDTO[];
  totalCount: number;
  error?: string;
}

export interface SaveOwnerResponseDTO {
  success: boolean;
  owner: OwnerDTO | null;
  error?: string;
}

export interface GetTenantsResponseDTO {
  success: boolean;
  tenants: TenantDTO[];
  totalCount: number;
  error?: string;
}

export interface SaveTenantResponseDTO {
  success: boolean;
  tenant: TenantDTO | null;
  error?: string;
}

export interface GetLeasesResponseDTO {
  success: boolean;
  leases: LeaseDTO[];
  totalCount: number;
  error?: string;
}

export interface SaveLeaseResponseDTO {
  success: boolean;
  lease: LeaseDTO | null;
  error?: string;
}
