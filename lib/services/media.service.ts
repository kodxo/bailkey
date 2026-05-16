import { prisma } from "@/lib/db";

export const mediaService = {
  async getMedia() {
    try {
      const media = await prisma.media.findMany({
        include: {
          author: true,
          tags: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return { success: true, media };
    } catch (error) {
      console.error("Erreur de récupération des médias:", error);
      return {
        success: false,
        error: "Impossible de récupérer les médias",
        media: [],
      };
    }
  }
};
