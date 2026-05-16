import type { GetMediaResponseDTO } from "@/lib/types/dto";

function getBaseUrl(): string {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const mediaService = {
  async getMedia(): Promise<GetMediaResponseDTO> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/media`, {
        cache: "no-store",
      });
      if (!res.ok) {
        return {
          success: false,
          media: [],
          error: "Erreur réseau lors de la récupération des médias",
        };
      }
      const data: unknown = await res.json();
      if (data && typeof data === "object" && "success" in data && "media" in data && Array.isArray((data as GetMediaResponseDTO).media)) {
        return data as GetMediaResponseDTO;
      }
      return {
        success: false,
        media: [],
        error: "Format de réponse invalide",
      };
    } catch (error) {
      console.error("Erreur de récupération des médias dans mediaService:", error);
      return {
        success: false,
        media: [],
        error: "Impossible de récupérer les médias",
      };
    }
  }
};
