"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { PostSummaryDTO } from "@/lib/types/post";
import { CATEGORY_LABELS, CATEGORY_TAG_COLORS } from "@/lib/types/post";
import { PostCategory } from "@/lib/generated/prisma/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FilterValue = "Tous" | PostCategory;

interface FilterConfig {
  value: FilterValue;
  label: string;
}

const FILTERS: FilterConfig[] = [
  { value: "Tous", label: "Tous" },
  { value: "GUIDE", label: "Guides" },
  { value: "ANALYSE", label: "Analyses" },
  { value: "CAS_CLIENT", label: "Études de cas" },
  { value: "ACTUALITE", label: "Actualités" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ResourcesGrid({ posts }: { posts: PostSummaryDTO[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("Tous");

  const filteredPosts = posts.filter(
    (post) => activeFilter === "Tous" || post.category === activeFilter,
  );

  return (
    <>
      {/* Filter Bar */}
      <section className="mb-12 flex flex-wrap gap-2 border-b border-outline-variant/50 pb-4">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-4 py-2 rounded-none font-label-caps text-label-caps tracking-widest uppercase transition-colors ${
              activeFilter === filter.value
                ? "bg-primary text-on-primary"
                : "bg-transparent border border-outline text-on-surface hover:bg-surface-variant"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </section>

      {/* Resources Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="bg-surface-container-lowest border border-outline-variant/50 rounded-none shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
          >
            <div className="h-48 bg-surface-variant overflow-hidden relative">
              {post.coverImage && (
                <Image
                  alt={post.coverImageAlt ?? post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={post.coverImage}
                  fill
                />
              )}
              <span
                className={`absolute top-4 left-4 px-2 py-1 font-label-caps text-label-caps uppercase rounded-none ${CATEGORY_TAG_COLORS[post.category]}`}
              >
                {CATEGORY_LABELS[post.category]}
              </span>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="font-h2 text-h2 text-on-surface mb-2">
                {post.title}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant flex-grow mb-4">
                {post.excerpt}
              </p>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Author + Link */}
              <div className="flex items-center justify-between mt-auto pt-2">
                <div className="flex items-center gap-2">
                  {post.author.avatarUrl && (
                    <Image
                      alt={post.author.name}
                      className="w-6 h-6 rounded-full object-cover"
                      src={post.author.avatarUrl}
                      width={24}
                      height={24}
                    />
                  )}
                  <span className="text-xs text-on-surface-variant">
                    {post.author.name}
                  </span>
                </div>

                <Link
                  className="font-h3 text-sm text-primary hover:text-primary-container inline-flex items-center gap-2 font-semibold uppercase tracking-wider transition-colors"
                  href={`/posts/${post.slug}`}
                >
                  Lire
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </article>
        ))}

        {filteredPosts.length === 0 && (
          <div className="col-span-full text-center py-16">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4 block">
              article
            </span>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Aucun article trouvé dans cette catégorie.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
