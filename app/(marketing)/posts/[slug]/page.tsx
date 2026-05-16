import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getPostBySlug } from "@/lib/dal/posts";
import {
  CATEGORY_LABELS,
  type PostDetailDTO,
  type PostSummaryDTO,
} from "@/lib/types/post";

// ---------------------------------------------------------------------------
// SEO – generateMetadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Article introuvable | BailKey" };
  }

  return {
    title: post.metaTitle ?? `${post.title} | BailKey`,
    description:
      post.metaDescription ?? post.excerpt ?? "Article de blog BailKey",
    openGraph: {
      title: post.metaTitle ?? post.title,
      description: post.metaDescription ?? post.excerpt ?? undefined,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
    },
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoDate));
}

/**
 * Transforme le contenu brut (texte + markdown light) en paragraphes et titres.
 * Gère les blocs `## titre`, `> citation`, et paragraphes normaux.
 */
function renderContent(content: string): React.ReactNode[] {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let blockquoteBuffer: string[] = [];
  let key = 0;

  function flushBlockquote(): void {
    if (blockquoteBuffer.length > 0) {
      elements.push(
        <blockquote
          key={`bq-${key++}`}
          className="my-8 pl-6 border-l-4 border-primary bg-surface-container-low p-6 font-h3 text-h3 text-on-surface italic shadow-sm relative overflow-hidden"
        >
          &quot;{blockquoteBuffer.join(" ").trim()}&quot;
        </blockquote>,
      );
      blockquoteBuffer = [];
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushBlockquote();
      continue;
    }

    if (trimmed.startsWith("> ")) {
      blockquoteBuffer.push(trimmed.slice(2));
      continue;
    }

    flushBlockquote();

    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2
          key={`h2-${key++}`}
          className="font-h2 text-h2 text-on-surface mt-10 mb-4"
        >
          {trimmed.slice(3)}
        </h2>,
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3
          key={`h3-${key++}`}
          className="font-h3 text-h3 text-on-surface mt-8 mb-3"
        >
          {trimmed.slice(4)}
        </h3>,
      );
      continue;
    }

    elements.push(
      <p
        key={`p-${key++}`}
        className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed"
      >
        {trimmed}
      </p>,
    );
  }

  flushBlockquote();
  return elements;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function RelatedPostCard({ post }: { post: PostSummaryDTO }) {
  return (
    <Link
      className="group block bg-surface-container-low border border-transparent hover:border-primary/30 transition-colors shadow-sm"
      href={`/posts/${post.slug}`}
    >
      {post.coverImage && (
        <div className="h-32 bg-surface-variant relative overflow-hidden">
          <Image
            alt={post.coverImageAlt ?? post.title}
            className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
            fill
            src={post.coverImage}
          />
        </div>
      )}
      <div className="p-4">
        <span className="font-label-caps text-label-caps text-primary mb-2 block uppercase">
          {CATEGORY_LABELS[post.category]}
        </span>
        <h4 className="font-body-lg text-body-lg text-on-surface font-semibold group-hover:text-primary transition-colors leading-snug">
          {post.title}
        </h4>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post: PostDetailDTO | null = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="grow pt-[120px] pb-xl px-gutter md:px-xl max-w-7xl mx-auto w-full">
        {/* Article Header */}
        <header className="mb-xl max-w-4xl">
          <div className="flex items-center space-x-4 mb-6">
            <span className="font-label-caps text-label-caps text-primary bg-primary-container/20 px-3 py-1 uppercase tracking-wider">
              {CATEGORY_LABELS[post.category]}
            </span>
            {post.publishedAt && (
              <span className="text-sm text-on-surface-variant flex items-center">
                <span
                  className="material-symbols-outlined text-[18px] mr-1"
                  data-weight="regular"
                >
                  calendar_today
                </span>
                {formatDate(post.publishedAt)}
              </span>
            )}
            {post.readingTime && (
              <span className="text-sm text-on-surface-variant flex items-center">
                <span
                  className="material-symbols-outlined text-[18px] mr-1"
                  data-weight="regular"
                >
                  schedule
                </span>
                {post.readingTime} min de lecture
              </span>
            )}
          </div>

          <h1 className="font-display text-display text-on-surface mb-8">
            {post.title}
          </h1>

          {/* Author info */}
          <div className="flex items-center space-x-4">
            {post.author.avatarUrl && (
              <Image
                alt={`Photo de ${post.author.name}`}
                className="w-12 h-12 object-cover bg-surface-container rounded-full"
                src={post.author.avatarUrl}
                width={48}
                height={48}
              />
            )}
            <div>
              <div className="font-h3 text-h3 text-on-surface">
                {post.author.name}
              </div>
              {post.author.role && (
                <div className="text-sm text-on-surface-variant">
                  {post.author.role}
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Hero Image */}
        {post.coverImage && (
          <div
            className="w-full h-[500px] mb-xl relative bg-surface-container overflow-hidden shadow-lg"
            style={{ boxShadow: "0 32px 64px -16px rgba(46, 177, 178, 0.1)" }}
          >
            <Image
              alt={post.coverImageAlt ?? post.title}
              className="object-cover"
              fill
              priority
              src={post.coverImage}
            />
          </div>
        )}

        {/* Article Body & Sidebar Layout */}
        <div className="flex flex-col lg:flex-row gap-xl">
          {/* Main Content */}
          <article className="lg:w-2/3 max-w-3xl prose prose-slate">
            {post.excerpt && (
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 leading-relaxed">
                {post.excerpt}
              </p>
            )}
            {renderContent(post.content)}
          </article>

          {/* Sidebar */}
          <aside className="lg:w-1/3">
            <div className="sticky top-[120px]">
              <h3 className="font-h3 text-h3 text-on-surface mb-6 border-b border-outline-variant pb-2">
                Articles recommandés
              </h3>
              <div className="space-y-6">
                {post.relatedPosts.map((related) => (
                  <RelatedPostCard key={related.id} post={related} />
                ))}

                {post.relatedPosts.length === 0 && (
                  <p className="text-sm text-on-surface-variant italic">
                    Aucun article recommandé pour le moment.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
