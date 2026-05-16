import { prisma } from "@/lib/db";
import type { MediaDTO } from "@/lib/types/dto";

export async function getAdminMedia(): Promise<{ success: boolean; media: MediaDTO[]; error?: string }> {
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

    const serializedMedia: MediaDTO[] = media.map((m) => ({
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
      author: {
        id: m.author.id,
        name: m.author.name,
        role: m.author.role,
        avatarUrl: m.author.avatarUrl,
      },
      tags: m.tags.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
      })),
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
    }));

    return { success: true, media: serializedMedia };
  } catch (error) {
    console.error("Erreur de récupération des médias dans le DAL:", error);
    return {
      success: false,
      media: [],
      error: "Impossible de récupérer les médias",
    };
  }
}
