import React from "react";
import Link from "next/link";
import { postService } from "@/lib/services/post.service";
import { PostStatus } from "@/lib/generated/prisma/enums";

import { MetricCard } from "@/components/ui/metric-card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { TablePagination } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { BreadcrumbNav } from "@/components/ui/breadcrumb";

export default async function AdminArticlesPage(): Promise<React.JSX.Element> {
  const res = await postService.getPosts();
  const posts = res.posts || [];

  const totalPosts = posts.length;
  const draftPosts = posts.filter((p) => p.status === PostStatus.DRAFT).length;
  const publishedPosts = posts.filter(
    (p) => p.status === PostStatus.PUBLISHED
  ).length;

  return (
    <div className="p-md w-full max-w-[1200px] mx-auto flex flex-col gap-lg relative">
      {/* Floating Action Button */}
      <Link
        href="/admin/editor"
        className="hidden md:flex fixed bottom-md right-md z-50 py-sm px-md bg-primary text-on-primary font-label-caps text-label-caps hover:bg-primary/90 transition-all items-center justify-center gap-xs uppercase tracking-wider shadow-md cursor-pointer"
      >
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: '"FILL" 1' }}
        >
          add
        </span>
        Nouvel Article
      </Link>

      {/* Header & Summary Stats */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-md border-b border-outline-variant pb-md">
        <div className="flex flex-col gap-sm">
          <BreadcrumbNav
            items={[
              { label: "Administration", href: "/admin" },
              { label: "Articles" },
            ]}
          />
          <div>
            <h1 className="text-h1 text-on-background mb-xs font-bold font-display">
              Gestion des Articles
            </h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant">
              Vue d&apos;ensemble et contrôle sur toutes les ressources publiées
              et en brouillon.
            </p>
          </div>
        </div>
        <div className="flex gap-sm overflow-x-auto pb-2 md:pb-0">
          <MetricCard value={totalPosts} label="Total" />
          <MetricCard
            value={draftPosts}
            label="Brouillons"
            valueClassName="text-tertiary"
          />
          <MetricCard
            value={publishedPosts}
            label="Publiés"
            valueClassName="text-primary-container"
          />
        </div>
      </section>

      {/* Filters Bar */}
      <section className="bg-surface-container-lowest border border-outline-variant flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center gap-0 z-30 transition-all duration-300 ease-in-out shadow-sm overflow-hidden">
        <div className="flex-1 min-w-[200px] flex items-center border-b md:border-b-0 md:border-r border-outline-variant">
          <Input
            iconName="search"
            placeholder="Rechercher..."
            type="text"
            wrapperClassName="border-none w-full bg-transparent px-sm py-sm"
          />
        </div>
        <div className="flex items-center border-b md:border-b-0 md:border-r border-outline-variant bg-surface-container-lowest justify-between md:justify-start">
          <Select
            label="Catégorie:"
            options={[
              { label: "Toutes", value: "all" },
              { label: "Guide", value: "Guide" },
              { label: "Analyse", value: "Analyse" },
              { label: "Cas Client", value: "Cas Client" },
              { label: "Actualité", value: "Actualité" },
            ]}
            wrapperClassName="border-none py-sm"
          />
        </div>
        <div className="flex items-center px-sm py-sm bg-surface-container-lowest gap-xs overflow-x-auto">
          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase mr-xs shrink-0 select-none">
            Statut:
          </span>
          <div className="flex border border-outline-variant overflow-hidden shrink-0 rounded-xs">
            <button
              type="button"
              className="px-sm py-[4px] bg-primary text-on-primary text-label-caps font-label-caps border-r border-outline-variant transition-colors uppercase cursor-pointer"
            >
              Tous
            </button>
            <button
              type="button"
              className="px-sm py-[4px] bg-transparent text-on-surface text-label-caps font-label-caps border-r border-outline-variant hover:bg-surface-variant transition-colors uppercase cursor-pointer"
            >
              Publié
            </button>
            <button
              type="button"
              className="px-sm py-[4px] bg-transparent text-on-surface text-label-caps font-label-caps border-r border-outline-variant hover:bg-surface-variant transition-colors uppercase cursor-pointer"
            >
              Brouillon
            </button>
            <button
              type="button"
              className="px-sm py-[4px] bg-transparent text-on-surface text-label-caps font-label-caps hover:bg-surface-variant transition-colors uppercase cursor-pointer"
            >
              Archivé
            </button>
          </div>
        </div>
      </section>

      {/* Data Table */}
      <section className="transition-all duration-300 ease-in-out">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>TITRE</TableHead>
              <TableHead>AUTEUR</TableHead>
              <TableHead>CATÉGORIE</TableHead>
              <TableHead>STATUT</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead className="text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="p-md text-center text-on-surface-variant"
                >
                  Aucun article trouvé.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Link
                      href={`/admin/editor?id=${post.id}`}
                      className="text-body-md font-body-md text-on-surface font-semibold hover:text-primary transition-colors"
                    >
                      {post.title || "Nouvel article sans titre"}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-xs">
                      <Avatar
                        src={post.author.avatarUrl}
                        alt={post.author.name}
                        fallback={post.author.name.charAt(0)}
                        size="sm"
                      />
                      <span className="text-body-md font-body-md text-on-surface truncate max-w-[150px]">
                        {post.author.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{post.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {post.status === PostStatus.PUBLISHED ? (
                      <Badge variant="default" dot>
                        Publié
                      </Badge>
                    ) : post.status === PostStatus.DRAFT ? (
                      <Badge variant="surface" dot>
                        Brouillon
                      </Badge>
                    ) : (
                      <Badge variant="destructive" dot>
                        Archivé
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-on-surface-variant">
                    {new Intl.DateTimeFormat("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(post.createdAt))}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-xs opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/editor?id=${post.id}`}
                        className="p-xs text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-colors rounded-full inline-flex items-center justify-center"
                        title="Modifier"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          edit
                        </span>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          total={totalPosts}
          start={1}
          end={Math.min(totalPosts, 10)}
          disabledPrev={true}
          disabledNext={totalPosts <= 10}
        />
      </section>
    </div>
  );
}
