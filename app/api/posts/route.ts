import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPublishedPosts } from "@/lib/dal/posts";
import { PostCategory } from "@/lib/generated/prisma/enums";

const VALID_CATEGORIES = new Set<string>([
  "GUIDE",
  "ANALYSE",
  "CAS_CLIENT",
  "ACTUALITE",
]);

/**
 * GET /api/posts
 *
 * Paramètres query :
 * - category (optionnel) : GUIDE | ANALYSE | CAS_CLIENT | ACTUALITE
 *
 * Retourne : { posts: PostSummaryDTO[], total: number }
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const categoryParam = searchParams.get("category");

  // Validation de la catégorie
  let category: PostCategory | undefined;
  if (categoryParam) {
    const upper = categoryParam.toUpperCase();
    if (!VALID_CATEGORIES.has(upper)) {
      return NextResponse.json(
        {
          error: `Catégorie invalide: "${categoryParam}". Valeurs acceptées: ${[...VALID_CATEGORIES].join(", ")}`,
        },
        { status: 400 },
      );
    }
    category = upper as PostCategory;
  }

  const result = await getPublishedPosts(category);

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
