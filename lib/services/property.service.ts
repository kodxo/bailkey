import type {
  GetPropertiesResponseDTO,
  GetPropertyByIdResponseDTO,
  SavePropertyResponseDTO,
  GetOwnersResponseDTO,
  SaveOwnerResponseDTO,
  GetTenantsResponseDTO,
  SaveTenantResponseDTO,
  GetLeasesResponseDTO,
  SaveLeaseResponseDTO,
} from "../types/property";
import type { SavePropertyInputDTO } from "../dal/properties";
import type { SaveOwnerInputDTO } from "../dal/owners";
import type { SaveTenantInputDTO } from "../dal/tenants";
import type { SaveLeaseInputDTO } from "../dal/leases";

function getBaseUrl(): string {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

async function parseApiResponse<T>(res: Response, defaultError: string): Promise<T> {
  let data: unknown;
  try {
    data = await res.json();
  } catch (err) {
    // Unable to parse JSON body
  }

  if (!res.ok) {
    let errorMsg = defaultError;
    if (data && typeof data === "object" && "error" in data && typeof (data as { error?: unknown }).error === "string") {
      errorMsg = (data as { error: string }).error;
    } else if (data && typeof data === "object" && "message" in data && typeof (data as { message?: unknown }).message === "string") {
      errorMsg = (data as { message: string }).message;
    }
    return { success: false, error: errorMsg } as unknown as T;
  }

  if (data && typeof data === "object" && "success" in data) {
    return data as T;
  }

  return { success: false, error: "Format de réponse du serveur invalide." } as unknown as T;
}

export interface PresignedResponseDTO {
  success: boolean;
  uploadUrl?: string;
  publicUrl?: string;
  fileKey?: string;
  error?: string;
}

export const uploadService = {
  async getPresignedUrl(fileName: string, fileType: string, folder = "properties"): Promise<PresignedResponseDTO> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/upload/presigned`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, fileType, folder }),
      });
      return await parseApiResponse<PresignedResponseDTO>(res, "Erreur lors de l'obtention de l'URL de téléchargement.");
    } catch (error) {
      console.error("Erreur getPresignedUrl:", error);
      return { success: false, error: "Impossible de joindre le serveur de téléchargement." };
    }
  },

  async uploadFileToR2(file: File, folder = "properties"): Promise<{ success: boolean; url?: string; fileKey?: string; error?: string }> {
    const presigned = await this.getPresignedUrl(file.name, file.type, folder);
    if (!presigned.success || !presigned.uploadUrl || !presigned.publicUrl || !presigned.fileKey) {
      return { success: false, error: presigned.error || "Impossible de préparer le téléchargement." };
    }

    try {
      const uploadRes = await fetch(presigned.uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (uploadRes.ok) {
        return { success: true, url: presigned.publicUrl, fileKey: presigned.fileKey };
      }
      return { success: false, error: "Échec du téléchargement vers Cloudflare R2." };
    } catch (error) {
      console.error("Erreur uploadFileToR2:", error);
      return { success: false, error: "Erreur de réseau lors du téléchargement." };
    }
  },
};

export const propertyService = {
  async getProperties(): Promise<GetPropertiesResponseDTO> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/properties`, {
        cache: "no-store",
      });
      return await parseApiResponse<GetPropertiesResponseDTO>(
        res,
        "Erreur lors de la récupération des propriétés."
      );
    } catch (error) {
      console.error("Erreur getProperties:", error);
      return { success: false, properties: [], totalCount: 0, error: "Impossible de joindre le serveur API." };
    }
  },

  async getPropertyById(id: string): Promise<GetPropertyByIdResponseDTO> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/properties/${id}`, {
        cache: "no-store",
      });
      return await parseApiResponse<GetPropertyByIdResponseDTO>(
        res,
        "Erreur lors de la récupération de la fiche propriété."
      );
    } catch (error) {
      console.error("Erreur getPropertyById:", error);
      return { success: false, property: null, error: "Impossible de joindre le serveur API." };
    }
  },

  async createProperty(data: SavePropertyInputDTO): Promise<SavePropertyResponseDTO> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/properties`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await parseApiResponse<SavePropertyResponseDTO>(
        res,
        "Erreur lors de la création de la propriété."
      );
    } catch (error) {
      console.error("Erreur createProperty:", error);
      return { success: false, property: null, error: "Impossible d'envoyer les données au serveur API." };
    }
  },

  async updateProperty(
    id: string,
    data: Partial<SavePropertyInputDTO>
  ): Promise<SavePropertyResponseDTO> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/properties/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await parseApiResponse<SavePropertyResponseDTO>(
        res,
        "Erreur lors de la mise à jour de la propriété."
      );
    } catch (error) {
      console.error("Erreur updateProperty:", error);
      return { success: false, property: null, error: "Impossible d'envoyer les modifications au serveur API." };
    }
  },
};

export const ownerService = {
  async getOwners(): Promise<GetOwnersResponseDTO> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/owners`, { cache: "no-store" });
      return await parseApiResponse<GetOwnersResponseDTO>(
        res,
        "Erreur lors de la récupération des propriétaires."
      );
    } catch (error) {
      console.error("Erreur getOwners:", error);
      return { success: false, owners: [], totalCount: 0, error: "Impossible de joindre le serveur API." };
    }
  },

  async createOwner(data: SaveOwnerInputDTO): Promise<SaveOwnerResponseDTO> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/owners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await parseApiResponse<SaveOwnerResponseDTO>(
        res,
        "Erreur lors de la création du propriétaire."
      );
    } catch (error) {
      console.error("Erreur createOwner:", error);
      return { success: false, owner: null, error: "Impossible d'envoyer les données au serveur API." };
    }
  },

  async updateOwner(id: string, data: Partial<SaveOwnerInputDTO>): Promise<SaveOwnerResponseDTO> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/owners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await parseApiResponse<SaveOwnerResponseDTO>(
        res,
        "Erreur lors de la mise à jour du propriétaire."
      );
    } catch (error) {
      console.error("Erreur updateOwner:", error);
      return { success: false, owner: null, error: "Impossible d'envoyer les modifications au serveur API." };
    }
  },
};

export const tenantService = {
  async getTenants(): Promise<GetTenantsResponseDTO> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/tenants`, { cache: "no-store" });
      return await parseApiResponse<GetTenantsResponseDTO>(
        res,
        "Erreur lors de la récupération des locataires."
      );
    } catch (error) {
      console.error("Erreur getTenants:", error);
      return { success: false, tenants: [], totalCount: 0, error: "Impossible de joindre le serveur API." };
    }
  },

  async createTenant(data: SaveTenantInputDTO): Promise<SaveTenantResponseDTO> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/tenants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await parseApiResponse<SaveTenantResponseDTO>(
        res,
        "Erreur lors de la création du locataire."
      );
    } catch (error) {
      console.error("Erreur createTenant:", error);
      return { success: false, tenant: null, error: "Impossible d'envoyer les données au serveur API." };
    }
  },

  async updateTenant(id: string, data: Partial<SaveTenantInputDTO>): Promise<SaveTenantResponseDTO> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/tenants/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await parseApiResponse<SaveTenantResponseDTO>(
        res,
        "Erreur lors de la mise à jour du locataire."
      );
    } catch (error) {
      console.error("Erreur updateTenant:", error);
      return { success: false, tenant: null, error: "Impossible d'envoyer les modifications au serveur API." };
    }
  },
};

export const leaseService = {
  async getLeases(): Promise<GetLeasesResponseDTO> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/leases`, { cache: "no-store" });
      return await parseApiResponse<GetLeasesResponseDTO>(
        res,
        "Erreur lors de la récupération des contrats de bail."
      );
    } catch (error) {
      console.error("Erreur getLeases:", error);
      return { success: false, leases: [], totalCount: 0, error: "Impossible de joindre le serveur API." };
    }
  },

  async createLease(data: SaveLeaseInputDTO): Promise<SaveLeaseResponseDTO> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/leases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await parseApiResponse<SaveLeaseResponseDTO>(
        res,
        "Erreur lors de la création du contrat de bail."
      );
    } catch (error) {
      console.error("Erreur createLease:", error);
      return { success: false, lease: null, error: "Impossible d'envoyer les données au serveur API." };
    }
  },

  async updateLease(id: string, data: Partial<SaveLeaseInputDTO>): Promise<SaveLeaseResponseDTO> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/leases/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await parseApiResponse<SaveLeaseResponseDTO>(
        res,
        "Erreur lors de la mise à jour du contrat de bail."
      );
    } catch (error) {
      console.error("Erreur updateLease:", error);
      return { success: false, lease: null, error: "Impossible d'envoyer les modifications au serveur API." };
    }
  },
};
