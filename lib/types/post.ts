// ---------------------------------------------------------------------------
// API Response DTOs — Formes sérialisables (dates → string ISO)
// ---------------------------------------------------------------------------

import { PostCategory, PostStatus } from "../generated/prisma/enums";

import type { AuthorDTO, TagDTO } from "./dto";
export type { AuthorDTO, TagDTO };

/** Article résumé pour les listes (sans `content`) */
export interface PostSummaryDTO {
  id: string;
  slug: string;
  title: string;
  category: PostCategory;
  status: PostStatus;
  publishedAt: string | null;
  readingTime: number | null;
  coverImage: string | null;
  coverImageAlt: string | null;
  excerpt: string | null;
  author: AuthorDTO;
  tags: TagDTO[];
}

/** Article complet pour la page de détail */
export interface PostDetailDTO extends PostSummaryDTO {
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  relatedPosts: PostSummaryDTO[];
}

/** Réponse paginée de la liste */
export interface PostListResponse {
  posts: PostSummaryDTO[];
  total: number;
}

// ---------------------------------------------------------------------------
// Labels UI — Mapping catégorie → label affiché
// ---------------------------------------------------------------------------

export const CATEGORY_LABELS: Record<PostCategory, string> = {
  GUIDE: "Guide",
  ANALYSE: "Analyse",
  CAS_CLIENT: "Cas Client",
  ACTUALITE: "Actualité",
};

/** Couleur de badge par catégorie (classes Tailwind) */
export const CATEGORY_TAG_COLORS: Record<PostCategory, string> = {
  GUIDE: "bg-primary text-on-primary",
  ANALYSE: "bg-secondary text-on-secondary",
  CAS_CLIENT: "bg-tertiary text-on-tertiary",
  ACTUALITE: "bg-surface text-on-surface border border-outline",
};
