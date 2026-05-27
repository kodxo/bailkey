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
