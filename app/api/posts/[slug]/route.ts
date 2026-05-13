import { NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/dal/posts";

/**
 * GET /api/posts/[slug]
 *
 * Retourne le post complet avec auteur, tags et articles liés.
 * 404 si le slug n'existe pas.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post) {
    return NextResponse.json(
      { error: `Article introuvable pour le slug: "${slug}"` },
      { status: 404 },
    );
  }

  return NextResponse.json(post, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
