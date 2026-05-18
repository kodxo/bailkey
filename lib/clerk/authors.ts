import { clerkClient } from "@clerk/nextjs/server";
import type { AuthorDTO } from "@/lib/types/dto";

const FALLBACK_AUTHORS: Record<string, AuthorDTO> = {
  user_seed_laurent: {
    id: "user_seed_laurent",
    name: "Laurent N.",
    role: "Expert en Stratégie Foncière",
    avatarUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200",
  },
  user_seed_sophie: {
    id: "user_seed_sophie",
    name: "Sophie M.",
    role: "Juriste Immobilier & Régulation",
    avatarUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
  },
  user_seed_tech: {
    id: "user_seed_tech",
    name: "Pôle Ingénierie",
    role: "Équipe Technique Bailkey",
    avatarUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=200&h=200",
  },
  user_seed_marc: {
    id: "user_seed_marc",
    name: "Marc A.",
    role: "Directeur de l'Innovation",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200",
  },
};

export async function getClerkAuthor(userId: string): Promise<AuthorDTO> {
  if (FALLBACK_AUTHORS[userId]) {
    return FALLBACK_AUTHORS[userId];
  }

  try {
    const client = await clerkClient();
    const u = await client.users.getUser(userId);
    const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim();
    const email = u.emailAddresses[0]?.emailAddress || "Auteur";

    return {
      id: u.id,
      name: fullName || email,
      role:
        (typeof u.publicMetadata?.role === "string"
          ? u.publicMetadata.role
          : null) || "Rédacteur",
      avatarUrl: u.imageUrl || null,
    };
  } catch (err: unknown) {
    console.error(`Erreur récupération auteur Clerk (${userId}):`, err);
    return {
      id: userId,
      name: "Auteur inconnu",
      role: "Rédacteur",
      avatarUrl: null,
    };
  }
}

export async function getClerkAuthorsMap(
  userIds: string[]
): Promise<Record<string, AuthorDTO>> {
  const uniqueIds = Array.from(new Set(userIds)).filter(Boolean);
  const map: Record<string, AuthorDTO> = {};

  if (uniqueIds.length === 0) {
    return map;
  }

  try {
    const client = await clerkClient();
    const userPromises = uniqueIds.map(
      async (id: string): Promise<AuthorDTO> => {
        if (FALLBACK_AUTHORS[id]) {
          return FALLBACK_AUTHORS[id];
        }
        try {
          const u = await client.users.getUser(id);
          const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim();
          const email = u.emailAddresses[0]?.emailAddress || "Auteur";
          return {
            id: u.id,
            name: fullName || email,
            role:
              (typeof u.publicMetadata?.role === "string"
                ? u.publicMetadata.role
                : null) || "Rédacteur",
            avatarUrl: u.imageUrl || null,
          };
        } catch {
          return {
            id,
            name: "Auteur inconnu",
            role: "Rédacteur",
            avatarUrl: null,
          };
        }
      }
    );

    const results = await Promise.all(userPromises);
    for (const author of results) {
      map[author.id] = author;
    }
  } catch (err: unknown) {
    console.error("Erreur globale getClerkAuthorsMap:", err);
    for (const id of uniqueIds) {
      map[id] = FALLBACK_AUTHORS[id] || {
        id,
        name: "Auteur inconnu",
        role: "Rédacteur",
        avatarUrl: null,
      };
    }
  }

  return map;
}
