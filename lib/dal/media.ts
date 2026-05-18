import { prisma } from "@/lib/db";
import type { MediaDTO } from "@/lib/types/dto";
import { getClerkAuthorsMap } from "@/lib/clerk/authors";

export async function getAdminMedia(): Promise<{
  success: boolean;
  media: MediaDTO[];
  error?: string;
}> {
  try {
    const media = await prisma.media.findMany({
      include: {
        tags: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const authorIds = media.map((m) => m.authorId);
    const authorsMap = await getClerkAuthorsMap(authorIds);

    const serializedMedia: MediaDTO[] = media.map((m) => {
      const author = authorsMap[m.authorId] || {
        id: m.authorId,
        name: "Auteur inconnu",
        role: "Rédacteur",
        avatarUrl: null,
      };

      return {
        id: m.id,
        name: m.name,
        size: m.size,
        type: m.type,
        category: m.category,
        dimensions: m.dimensions,
        src: m.src,
        icon: m.icon,
        iconColor: m.iconColor,
        authorId: m.authorId,
        author,
        tags: m.tags.map((t) => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
        })),
        createdAt: m.createdAt.toISOString(),
        updatedAt: m.updatedAt.toISOString(),
      };
    });

    return { success: true, media: serializedMedia };
  } catch (error: unknown) {
    console.error("Erreur de récupération des médias dans le DAL:", error);
    return {
      success: false,
      media: [],
      error: "Impossible de récupérer les médias",
    };
  }
}
