import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function AdminArticlesPage() {
  return (
    <>
      {/* Header & Summary Stats */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-md border-b border-outline-variant pb-md">
        <div>
          <h1 className="text-h1 font-h1 text-on-background mb-xs font-bold font-display">
            Gestion des Articles
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Vue d&apos;ensemble et contrôle sur toutes les ressources publiées
            et en brouillon.
          </p>
        </div>
        <div className="flex gap-sm overflow-x-auto pb-2 md:pb-0">
          <div className="bg-surface-container-low border border-outline-variant/30 px-md py-sm flex flex-col items-center min-w-[120px] flex-shrink-0 shadow-sm">
            <span className="text-h1 font-h1 text-primary leading-none font-bold">
              142
            </span>
            <span className="text-[10px] font-label-caps text-on-surface-variant uppercase mt-xs tracking-widest text-center">
              Total
            </span>
          </div>
          <div className="bg-surface-container-low border border-outline-variant/30 px-md py-sm flex flex-col items-center min-w-[120px] flex-shrink-0 shadow-sm">
            <span className="text-h1 font-h1 text-tertiary leading-none font-bold">
              28
            </span>
            <span className="text-[10px] font-label-caps text-on-surface-variant uppercase mt-xs tracking-widest text-center">
              Brouillons
            </span>
          </div>
          <div className="bg-surface-container-low border border-outline-variant/30 px-md py-sm flex flex-col items-center min-w-[120px] flex-shrink-0 shadow-sm">
            <span className="text-h1 font-h1 text-primary-container leading-none font-bold">
              114
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
          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase mr-xs flex-shrink-0">
            Statut:
          </span>
          <div className="flex border border-outline-variant overflow-hidden flex-shrink-0">
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
            {/* Row 1 */}
            <tr className="hover:bg-surface-container-low transition-colors group">
              <td className="p-sm">
                <Link
                  href="/admin"
                  className="text-body-md font-body-md text-on-surface font-semibold hover:text-primary transition-colors"
                >
                  Maximizing Urban Asset Yields in Q4
                </Link>
              </td>
              <td className="p-sm">
                <div className="flex items-center gap-xs">
                  <Image
                    alt="Sarah Jenkins"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-cover"
                    src="/images/admin/avatar1.png"
                  />
                  <span className="text-body-md font-body-md text-on-surface">
                    S. Jenkins
                  </span>
                </div>
              </td>
              <td className="p-sm">
                <span className="inline-block px-xs py-[2px] bg-secondary-container text-on-secondary-container text-label-caps font-label-caps border border-outline-variant uppercase">
                  Analyse
                </span>
              </td>
              <td className="p-sm">
                <span className="inline-flex items-center gap-[6px] px-2 py-1 bg-primary text-on-primary text-[10px] font-label-caps uppercase tracking-wider">
                  <span className="w-[4px] h-[4px] bg-white rounded-full"></span>
                  Publié
                </span>
              </td>
              <td className="p-sm text-body-md font-body-md text-on-surface-variant">
                24 Oct 2023
              </td>
              <td className="p-sm text-right">
                <div className="flex justify-end gap-xs opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-xs text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-colors"
                    title="Aperçu"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      visibility
                    </span>
                  </button>
                  <button
                    className="p-xs text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-colors"
                    title="Modifier"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      edit
                    </span>
                  </button>
                  <button
                    className="p-xs text-on-surface-variant hover:text-destructive hover:bg-error-container/50 transition-colors"
                    title="Archiver"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      archive
                    </span>
                  </button>
                </div>
              </td>
            </tr>
            {/* Row 2 */}
            <tr className="hover:bg-surface-container-low transition-colors group">
              <td className="p-sm">
                <Link
                  href="/admin"
                  className="text-body-md font-body-md text-on-surface font-semibold hover:text-primary transition-colors"
                >
                  Guide to Sustainable Property Transitions
                </Link>
              </td>
              <td className="p-sm">
                <div className="flex items-center gap-xs">
                  <Image
                    alt="David Chen"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-cover"
                    src="/images/admin/avatar2.png"
                  />
                  <span className="text-body-md font-body-md text-on-surface">
                    D. Chen
                  </span>
                </div>
              </td>
              <td className="p-sm">
                <span className="inline-block px-xs py-[2px] bg-secondary-container text-on-secondary-container text-label-caps font-label-caps border border-outline-variant uppercase">
                  Guide
                </span>
              </td>
              <td className="p-sm">
                <span className="inline-flex items-center gap-[6px] px-2 py-1 bg-surface-variant text-on-surface-variant text-[10px] font-label-caps uppercase tracking-wider border border-outline/30">
                  <span className="w-[4px] h-[4px] bg-outline-variant rounded-full"></span>
                  Brouillon
                </span>
              </td>
              <td className="p-sm text-body-md font-body-md text-on-surface-variant">
                22 Oct 2023
              </td>
              <td className="p-sm text-right">
                <div className="flex justify-end gap-xs opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-xs text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-colors"
                    title="Aperçu"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      visibility
                    </span>
                  </button>
                  <button
                    className="p-xs text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-colors"
                    title="Modifier"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      edit
                    </span>
                  </button>
                  <button
                    className="p-xs text-on-surface-variant hover:text-destructive hover:bg-error-container/50 transition-colors"
                    title="Archiver"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      archive
                    </span>
                  </button>
                </div>
              </td>
            </tr>
            {/* Row 3 */}
            <tr className="hover:bg-surface-container-low transition-colors group">
              <td className="p-sm">
                <Link
                  href="/admin"
                  className="text-body-md font-body-md text-on-surface font-semibold hover:text-primary transition-colors"
                >
                  Client Case: Retrofitting the Zenith Tower
                </Link>
              </td>
              <td className="p-sm">
                <div className="flex items-center gap-xs">
                  <Image
                    alt="M. Ross"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-cover"
                    src="/images/admin/avatar3.png"
                  />
                  <span className="text-body-md font-body-md text-on-surface">
                    M. Ross
                  </span>
                </div>
              </td>
              <td className="p-sm">
                <span className="inline-block px-xs py-[2px] bg-secondary-container text-on-secondary-container text-label-caps font-label-caps border border-outline-variant uppercase">
                  Cas Client
                </span>
              </td>
              <td className="p-sm">
                <span className="inline-flex items-center gap-[6px] px-2 py-1 bg-primary text-on-primary text-[10px] font-label-caps uppercase tracking-wider">
                  <span className="w-[4px] h-[4px] bg-white rounded-full"></span>
                  Publié
                </span>
              </td>
              <td className="p-sm text-body-md font-body-md text-on-surface-variant">
                18 Oct 2023
              </td>
              <td className="p-sm text-right">
                <div className="flex justify-end gap-xs opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-xs text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-colors"
                    title="Aperçu"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      visibility
                    </span>
                  </button>
                  <button
                    className="p-xs text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-colors"
                    title="Modifier"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      edit
                    </span>
                  </button>
                  <button
                    className="p-xs text-on-surface-variant hover:text-destructive hover:bg-error-container/50 transition-colors"
                    title="Archiver"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      archive
                    </span>
                  </button>
                </div>
              </td>
            </tr>
            {/* Row 4 */}
            <tr className="hover:bg-surface-container-low transition-colors group">
              <td className="p-sm">
                <Link
                  href="/admin"
                  className="text-body-md font-body-md text-on-surface font-semibold hover:text-primary transition-colors"
                >
                  Q3 Market Shifts in Commercial Real Estate
                </Link>
              </td>
              <td className="p-sm">
                <div className="flex items-center gap-xs">
                  <div className="w-8 h-8 bg-tertiary-container text-on-tertiary-container flex items-center justify-center text-label-caps font-label-caps">
                    AK
                  </div>
                  <span className="text-body-md font-body-md text-on-surface">
                    A. Kumar
                  </span>
                </div>
              </td>
              <td className="p-sm">
                <span className="inline-block px-xs py-[2px] bg-secondary-container text-on-secondary-container text-label-caps font-label-caps border border-outline-variant uppercase">
                  Actualité
                </span>
              </td>
              <td className="p-sm">
                <span className="inline-flex items-center gap-[6px] px-2 py-1 bg-error-container text-on-error-container text-[10px] font-label-caps uppercase tracking-wider">
                  <span className="w-[4px] h-[4px] bg-error rounded-full"></span>
                  Archivé
                </span>
              </td>
              <td className="p-sm text-body-md font-body-md text-on-surface-variant">
                30 Sep 2023
              </td>
              <td className="p-sm text-right">
                <div className="flex justify-end gap-xs opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-xs text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-colors"
                    title="Aperçu"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      visibility
                    </span>
                  </button>
                  <button
                    className="p-xs text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-colors"
                    title="Modifier"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      edit
                    </span>
                  </button>
                  <button
                    className="p-xs text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-colors"
                    title="Restaurer"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      restore
                    </span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex items-center justify-between p-sm border-t border-outline-variant bg-surface-container-low">
          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase">
            Affichage de 1-4 sur 142
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
            <button className="p-xs border border-outline-variant bg-surface-container-lowest hover:bg-surface-variant text-on-surface transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
