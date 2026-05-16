import { prisma } from "@/lib/db";
import type {
  PostSummaryDTO,
  PostDetailDTO,
  AuthorDTO,
  TagDTO,
} from "@/lib/types/post";
import { PostCategory, PostStatus } from "../generated/prisma/enums";

// ---------------------------------------------------------------------------
// Internal Prisma result types
// ---------------------------------------------------------------------------

interface PrismaAuthor {
  id: string;
  name: string;
  role: string | null;
  avatarUrl: string | null;
}

interface PrismaTag {
  id: string;
  name: string;
  slug: string;
}

interface PrismaPostBase {
  id: string;
  slug: string;
  title: string;
  category: PostCategory;
  status: PostStatus;
  publishedAt: Date | null;
  readingTime: number | null;
  coverImage: string | null;
  coverImageAlt: string | null;
  excerpt: string | null;
  author: PrismaAuthor;
  tags: PrismaTag[];
}

interface PrismaPostFull extends PrismaPostBase {
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  relatedPosts: PrismaPostBase[];
}

// ---------------------------------------------------------------------------
// Serializers — Prisma → DTO
// ---------------------------------------------------------------------------

function serializeAuthor(author: PrismaAuthor): AuthorDTO {
  return {
    id: author.id,
    name: author.name,
    role: author.role,
    avatarUrl: author.avatarUrl,
  };
}

function serializeTag(tag: PrismaTag): TagDTO {
  return {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
  };
}

function serializePostSummary(post: PrismaPostBase): PostSummaryDTO {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    category: post.category,
    status: post.status,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    readingTime: post.readingTime,
    coverImage: post.coverImage,
    coverImageAlt: post.coverImageAlt,
    excerpt: post.excerpt,
    author: serializeAuthor(post.author),
    tags: post.tags.map(serializeTag),
  };
}

function serializePostDetail(
  post: PrismaPostFull,
  relatedPosts: PrismaPostBase[],
): PostDetailDTO {
  return {
    ...serializePostSummary(post),
    content: post.content,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    relatedPosts: relatedPosts.map(serializePostSummary),
  };
}

// ---------------------------------------------------------------------------
// Includes réutilisables
// ---------------------------------------------------------------------------

const POST_SUMMARY_INCLUDE = {
  author: true,
  tags: true,
} as const;

// ---------------------------------------------------------------------------
// Public DAL functions
// ---------------------------------------------------------------------------

/**
 * Récupère la liste des posts publiés.
 * Filtre optionnel par catégorie.
 */
export async function getPublishedPosts(
  category?: PostCategory,
): Promise<{ posts: PostSummaryDTO[]; total: number }> {
  const where = {
    status: "PUBLISHED" as const,
    ...(category ? { category } : {}),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: POST_SUMMARY_INCLUDE,
      orderBy: { publishedAt: "desc" },
    }),
    prisma.post.count({ where }),
  ]);

  return {
    posts: posts.map(serializePostSummary),
    total,
  };
}

/**
 * Récupère un post complet par slug, avec ses articles liés.
 * Retourne `null` si non trouvé.
 */
export async function getPostBySlug(
  slug: string,
): Promise<PostDetailDTO | null> {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      ...POST_SUMMARY_INCLUDE,
      relatedPosts: {
        include: POST_SUMMARY_INCLUDE,
        where: { status: "PUBLISHED" },
        take: 3,
      },
    },
  });

  if (!post) return null;

  // Si pas de related posts explicites, fallback sur la même catégorie
  let relatedPosts: PrismaPostBase[] = post.relatedPosts;

  if (relatedPosts.length === 0) {
    relatedPosts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        id: { not: post.id },
        category: post.category,
      },
      include: POST_SUMMARY_INCLUDE,
      orderBy: { publishedAt: "desc" },
      take: 3,
    });
  }

  return serializePostDetail(post, relatedPosts);
}

// ---------------------------------------------------------------------------
// Admin DAL functions
// ---------------------------------------------------------------------------

export interface PostSaveData {
  title?: string;
  content?: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  coverImage?: string;
  status?: PostStatus;
  category?: PostCategory;
  publishedAt?: Date | null;
  tags?: string[];
}

export async function getAdminPosts() {
  try {
    const posts = await prisma.post.findMany({
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, posts };
  } catch (error) {
    console.error("Erreur récupération posts:", error);
    return { success: false, posts: [] };
  }
}

export async function getAdminPostById(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: true, tags: true },
    });
    return { success: true, post };
  } catch (error) {
    console.error("Erreur récupération post id:", error);
    return { success: false, post: null };
  }
}

export async function createAdminDraftPost() {
  try {
    let defaultAuthor = await prisma.auteur.findFirst();
    if (!defaultAuthor) {
      defaultAuthor = await prisma.auteur.create({
        data: {
          name: "Sarah Jenkins",
          role: "Rédactrice",
          avatarUrl: "/images/admin/avatar1.png",
        },
      });
    }

    const newPost = await prisma.post.create({
      data: {
        title: "",
        slug: `brouillon-${crypto.randomUUID()}`,
        content: "",
        excerpt: "",
        category: PostCategory.ACTUALITE,
        authorId: defaultAuthor.id,
      },
    });

    return { success: true, post: newPost };
  } catch (error) {
    console.error("Erreur création brouillon:", error);
    return { success: false, post: null };
  }
}

export async function updateAdminPost(postId: string, data: PostSaveData) {
  try {
    const { tags, ...restData } = data;
    
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...restData,
        ...(tags && {
          tags: {
            set: [], // Dissocie les anciens tags
            connectOrCreate: tags.map((tag: string) => ({
              where: { name: tag },
              create: { name: tag, slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
            }))
          }
        })
      },
    });
    return { success: true, post: updatedPost };
  } catch (error) {
    console.error("Erreur de sauvegarde:", error);
    return { success: false, error: "Sauvegarde échouée" };
  }
}
