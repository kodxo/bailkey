import React from "react";
import Image from "next/image";
import Link from "next/link";
import { postService } from "@/lib/services/post.service";
import { PostStatus } from "@/lib/generated/prisma/enums";

export default async function AdminArticlesPage() {
  const res = await postService.getPosts();
  const posts = res.posts || [];

  const totalPosts = posts.length;
  const draftPosts = posts.filter((p) => p.status === PostStatus.DRAFT).length;
  const publishedPosts = posts.filter(
    (p) => p.status === PostStatus.PUBLISHED,
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
        <div>
          <h1 className="text-h1 text-on-background mb-xs font-bold font-display">
            Gestion des Articles
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Vue d&apos;ensemble et contrôle sur toutes les ressources publiées
            et en brouillon.
          </p>
        </div>
        <div className="flex gap-sm overflow-x-auto pb-2 md:pb-0">
          <div className="bg-surface-container-low border border-outline-variant/30 px-md py-sm flex flex-col items-center min-w-[120px] shrink-0 shadow-sm">
            <span className="text-h1 font-h1 text-primary leading-none font-bold">
              {totalPosts}
            </span>
            <span className="text-[10px] font-label-caps text-on-surface-variant uppercase mt-xs tracking-widest text-center">
              Total
            </span>
          </div>
          <div className="bg-surface-container-low border border-outline-variant/30 px-md py-sm flex flex-col items-center min-w-[120px] shrink-0 shadow-sm">
            <span className="text-h1 font-h1 text-tertiary leading-none font-bold">
              {draftPosts}
            </span>
            <span className="text-[10px] font-label-caps text-on-surface-variant uppercase mt-xs tracking-widest text-center">
              Brouillons
            </span>
          </div>
          <div className="bg-surface-container-low border border-outline-variant/30 px-md py-sm flex flex-col items-center min-w-[120px] shrink-0 shadow-sm">
            <span className="text-h1 font-h1 text-primary-container leading-none font-bold">
              {publishedPosts}
            </span>
            <span className="text-[10px] font-label-caps text-on-surface-variant uppercase mt-xs tracking-widest text-center">
              Publiés
            </span>
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="bg-surface-container-lowest border border-outline-variant flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center gap-0 z-30 transition-all duration-300 ease-in-out shadow-sm">
        <div className="flex-1 min-w-[200px] flex items-center border-b md:border-b-0 md:border-r border-outline-variant bg-transparent px-sm py-sm">
          <span className="material-symbols-outlined text-outline mr-xs">
            search
          </span>
          <input
            className="w-full bg-transparent border-none focus:ring-0 text-body-md font-body-md text-on-surface placeholder:text-outline p-0 focus:outline-hidden"
            placeholder="Rechercher..."
            type="text"
          />
        </div>
        <div className="flex items-center border-b md:border-b-0 md:border-r border-outline-variant px-sm py-sm bg-surface-container-lowest justify-between md:justify-start">
          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase mr-xs">
            Catégorie:
          </span>
          <select className="border-none bg-transparent text-body-md font-body-md text-on-surface py-0 pl-0 pr-lg focus:ring-0 focus:border-none cursor-pointer text-right md:text-left focus:outline-hidden">
            <option>Toutes</option>
            <option>Guide</option>
            <option>Analyse</option>
            <option>Cas Client</option>
            <option>Actualité</option>
          </select>
        </div>
        <div className="flex items-center px-sm py-sm bg-surface-container-lowest gap-xs overflow-x-auto">
          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase mr-xs shrink-0">
            Statut:
          </span>
          <div className="flex border border-outline-variant overflow-hidden shrink-0">
            <button className="px-sm py-[4px] bg-primary text-on-primary text-label-caps font-label-caps border-r border-outline-variant transition-colors uppercase">
              Tous
            </button>
            <button className="px-sm py-[4px] bg-transparent text-on-surface text-label-caps font-label-caps border-r border-outline-variant hover:bg-surface-variant transition-colors uppercase">
              Publié
            </button>
            <button className="px-sm py-[4px] bg-transparent text-on-surface text-label-caps font-label-caps border-r border-outline-variant hover:bg-surface-variant transition-colors uppercase">
              Brouillon
            </button>
            <button className="px-sm py-[4px] bg-transparent text-on-surface text-label-caps font-label-caps hover:bg-surface-variant transition-colors uppercase">
              Archivé
            </button>
          </div>
        </div>
      </section>

      {/* Data Table */}
      <section className="bg-surface-container-lowest border border-outline-variant overflow-x-auto transition-all duration-300 ease-in-out">
        <table className="w-full text-left border-collapse min-w-[800px] border-spacing-0">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="p-sm text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider">
                TITRE
              </th>
              <th className="p-sm text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider">
                AUTEUR
              </th>
              <th className="p-sm text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider">
                CATÉGORIE
              </th>
              <th className="p-sm text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider">
                STATUT
              </th>
              <th className="p-sm text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider">
                DATE
              </th>
              <th className="p-sm text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider text-right">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant even:[&_tr]:bg-surface-container-lowest/50">
            {posts.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-md text-center text-on-surface-variant"
                >
                  Aucun article trouvé.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-surface-container-low transition-colors group"
                >
                  <td className="p-sm">
                    <Link
                      href={`/admin/editor?id=${post.id}`}
                      className="text-body-md font-body-md text-on-surface font-semibold hover:text-primary transition-colors"
                    >
                      {post.title || "Nouvel article sans titre"}
                    </Link>
                  </td>
                  <td className="p-sm">
                    <div className="flex items-center gap-xs">
                      {post.author.avatarUrl ? (
                        <Image
                          alt={post.author.name}
                          width={32}
                          height={32}
                          className="w-8 h-8 object-cover rounded-full"
                          src={post.author.avatarUrl}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant text-label-caps font-semibold">
                          {post.author.name.charAt(0)}
                        </div>
                      )}
                      <span className="text-body-md font-body-md text-on-surface">
                        {post.author.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-sm">
                    <span className="inline-block px-xs py-[2px] bg-secondary-container text-on-secondary-container text-label-caps font-label-caps border border-outline-variant uppercase">
                      {post.category}
                    </span>
                  </td>
                  <td className="p-sm">
                    {post.status === PostStatus.PUBLISHED ? (
                      <span className="inline-flex items-center gap-[6px] px-2 py-1 bg-primary text-on-primary text-[10px] font-label-caps uppercase tracking-wider">
                        <span className="w-[4px] h-[4px] bg-white rounded-full"></span>
                        Publié
                      </span>
                    ) : post.status === PostStatus.DRAFT ? (
                      <span className="inline-flex items-center gap-[6px] px-2 py-1 bg-surface-variant text-on-surface-variant text-[10px] font-label-caps uppercase tracking-wider border border-outline/30">
                        <span className="w-[4px] h-[4px] bg-outline-variant rounded-full"></span>
                        Brouillon
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-[6px] px-2 py-1 bg-error-container text-on-error-container text-[10px] font-label-caps uppercase tracking-wider">
                        <span className="w-[4px] h-[4px] bg-error rounded-full"></span>
                        Archivé
                      </span>
                    )}
                  </td>
                  <td className="p-sm text-body-md font-body-md text-on-surface-variant">
                    {new Intl.DateTimeFormat("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(post.createdAt))}
                  </td>
                  <td className="p-sm text-right">
                    <div className="flex justify-end gap-xs opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/editor?id=${post.id}`}
                        className="p-xs text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-colors rounded-full inline-flex"
                        title="Modifier"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          edit
                        </span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex items-center justify-between p-sm border-t border-outline-variant bg-surface-container-low">
          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase">
            Affichage de 1-{Math.min(totalPosts, 10)} sur {totalPosts}
          </span>
          <div className="flex gap-xs">
            <button
              className="p-xs border border-outline-variant bg-surface-container-lowest hover:bg-surface-variant text-on-surface transition-colors disabled:opacity-50"
              disabled
            >
              <span className="material-symbols-outlined text-[20px]">
                chevron_left
              </span>
            </button>
            <button
              className="p-xs border border-outline-variant bg-surface-container-lowest hover:bg-surface-variant text-on-surface transition-colors disabled:opacity-50"
              disabled={totalPosts <= 10}
            >
              <span className="material-symbols-outlined text-[20px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
