"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";

export function AdminNav(): React.JSX.Element {
  const pathname = usePathname() || "";

  const isContentActive =
    pathname === "/admin" ||
    pathname.startsWith("/admin/editor") ||
    pathname.startsWith("/admin/media");

  const isArticlesActive =
    pathname === "/admin" || pathname.startsWith("/admin/editor");

  const isMediaActive = pathname.startsWith("/admin/media");
  const isUsersActive = pathname.startsWith("/admin/users");

  const isSettingsGroupActive = pathname.startsWith("/admin/users");

  return (
    <>
      {/* Side Nav Rail (Medium/Desktop) */}
      <nav className="hidden md:flex flex-col py-md bg-surface border-r border-outline-variant shadow-none h-screen left-0 w-[88px] fixed top-0 z-50 transition-all duration-300 ease-in-out items-center">
        <div className="mb-lg flex flex-col items-center">
          <Link href="/">
            <Logo height={32} />
          </Link>
        </div>
        <div className="flex-1 flex flex-col gap-sm w-full">
          {/* Item 1: Content */}
          <div className="nav-item-group relative flex justify-center w-full group">
            <Link
              href="/admin"
              className={cn(
                "flex flex-col items-center justify-center p-sm w-[64px] h-[64px] rounded transition-colors cursor-pointer",
                isContentActive
                  ? "bg-primary-container/10 text-primary font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              )}
            >
              <span
                className="material-symbols-outlined text-[24px]"
                data-icon="folder"
                style={{
                  fontVariationSettings: isContentActive
                    ? '"FILL" 1'
                    : '"FILL" 0',
                }}
              >
                folder
              </span>
              <span className="text-[10px] font-label-caps mt-1">Contenu</span>
            </Link>
            {/* Flyout Menu */}
            <div className="nav-flyout hidden opacity-0 invisible absolute left-[88px] top-0 bg-surface border border-outline-variant shadow-md flex-col w-56 z-50 transition-all duration-200 rounded-r">
              <div className="px-sm py-xs border-b border-outline-variant bg-surface-container-low">
                <span className="text-[11px] font-label-caps uppercase font-bold tracking-widest text-on-surface-variant">
                  Gestion Contenu
                </span>
              </div>
              <Link
                className={cn(
                  "flex items-center gap-sm px-sm py-2.5 transition-colors font-body-md text-sm",
                  isArticlesActive
                    ? "bg-surface-container-low text-primary border-l-4 border-primary font-medium"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border-l-4 border-transparent"
                )}
                href="/admin"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  data-icon="article"
                >
                  article
                </span>
                <span>Articles</span>
              </Link>
              <Link
                className={cn(
                  "flex items-center gap-sm px-sm py-2.5 transition-colors font-body-md text-sm",
                  isMediaActive
                    ? "bg-surface-container-low text-primary border-l-4 border-primary font-medium"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border-l-4 border-transparent"
                )}
                href="/admin/media"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  data-icon="photo_library"
                >
                  photo_library
                </span>
                <span>Médias</span>
              </Link>
              <Link
                className="flex items-center gap-sm px-sm py-2.5 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border-l-4 border-transparent transition-colors font-body-md text-sm"
                href="/admin"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  data-icon="category"
                >
                  category
                </span>
                <span>Catégories</span>
              </Link>
              <Link
                className="flex items-center gap-sm px-sm py-2.5 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border-l-4 border-transparent transition-colors font-body-md text-sm"
                href="/admin"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  data-icon="sell"
                >
                  sell
                </span>
                <span>Mots-clés</span>
              </Link>
            </div>
          </div>
          {/* Item 2: Property */}
          <div className="nav-item-group relative flex justify-center w-full group">
            <Link
              href="/admin"
              className="flex flex-col items-center justify-center p-sm w-[64px] h-[64px] text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer rounded"
            >
              <span
                className="material-symbols-outlined text-[24px]"
                data-icon="domain"
              >
                domain
              </span>
              <span className="text-[10px] font-label-caps mt-1">Biens</span>
            </Link>
            {/* Flyout Menu */}
            <div className="nav-flyout hidden opacity-0 invisible absolute left-[88px] top-0 bg-surface border border-outline-variant shadow-md flex-col w-56 z-50 transition-all duration-200 rounded-r">
              <div className="px-sm py-xs border-b border-outline-variant bg-surface-container-low">
                <span className="text-[11px] font-label-caps uppercase font-bold tracking-widest text-on-surface-variant">
                  Patrimoine
                </span>
              </div>
              <Link
                className="flex items-center gap-sm px-sm py-2.5 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border-l-4 border-transparent transition-colors font-body-md text-sm"
                href="/admin"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  data-icon="apartment"
                >
                  apartment
                </span>
                <span>Propriétés</span>
              </Link>
              <Link
                className="flex items-center gap-sm px-sm py-2.5 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border-l-4 border-transparent transition-colors font-body-md text-sm"
                href="/admin"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  data-icon="real_estate_agent"
                >
                  real_estate_agent
                </span>
                <span>Locataires</span>
              </Link>
            </div>
          </div>
          {/* Item 3: Settings */}
          <div className="nav-item-group relative flex justify-center w-full group">
            <Link
              href="/admin/users"
              className={cn(
                "flex flex-col items-center justify-center p-sm w-[64px] h-[64px] rounded transition-colors cursor-pointer",
                isSettingsGroupActive
                  ? "bg-primary-container/10 text-primary font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              )}
            >
              <span
                className="material-symbols-outlined text-[24px]"
                data-icon="settings"
                style={{
                  fontVariationSettings: isSettingsGroupActive
                    ? '"FILL" 1'
                    : '"FILL" 0',
                }}
              >
                settings
              </span>
              <span className="text-[10px] font-label-caps mt-1">Config</span>
            </Link>
            {/* Flyout Menu */}
            <div className="nav-flyout hidden opacity-0 invisible absolute left-[88px] top-0 bg-surface border border-outline-variant shadow-md flex-col w-56 z-50 transition-all duration-200 rounded-r">
              <div className="px-sm py-xs border-b border-outline-variant bg-surface-container-low">
                <span className="text-[11px] font-label-caps uppercase font-bold tracking-widest text-on-surface-variant">
                  Paramètres
                </span>
              </div>
              <Link
                className={cn(
                  "flex items-center gap-sm px-sm py-2.5 transition-colors font-body-md text-sm",
                  isUsersActive
                    ? "bg-surface-container-low text-primary border-l-4 border-primary font-medium"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border-l-4 border-transparent"
                )}
                href="/admin/users"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  data-icon="group"
                >
                  group
                </span>
                <span>Utilisateurs</span>
              </Link>
              <Link
                className="flex items-center gap-sm px-sm py-2.5 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border-l-4 border-transparent transition-colors font-body-md text-sm"
                href="/admin"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  data-icon="security"
                >
                  security
                </span>
                <span>Sécurité</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-auto flex flex-col gap-sm items-center w-full pt-md border-t border-outline-variant">
          <Link
            className="flex flex-col items-center justify-center p-sm w-[64px] h-[64px] text-on-surface-variant hover:bg-surface-container-high transition-colors rounded"
            href="/admin"
            title="Support"
          >
            <span
              className="material-symbols-outlined text-[24px]"
              data-icon="help"
            >
              help
            </span>
          </Link>

          <UserButton />
        </div>
      </nav>

      {/* Mobile Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-surface border-t border-outline-variant z-60 md:hidden flex justify-around items-center h-16 transition-all duration-300 ease-in-out">
        <Link
          className={cn(
            "flex flex-col items-center justify-center w-full h-full transition-colors",
            isArticlesActive
              ? "text-primary bg-surface-container-low font-semibold"
              : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
          )}
          href="/admin"
        >
          <span className="material-symbols-outlined" data-icon="article">
            article
          </span>
          <span className="text-[10px] font-label-caps mt-1">Articles</span>
        </Link>
        <Link
          className={cn(
            "flex flex-col items-center justify-center w-full h-full transition-colors",
            isMediaActive
              ? "text-primary bg-surface-container-low font-semibold"
              : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
          )}
          href="/admin/media"
        >
          <span className="material-symbols-outlined" data-icon="photo_library">
            photo_library
          </span>
          <span className="text-[10px] font-label-caps mt-1">Médias</span>
        </Link>
        <Link
          className={cn(
            "flex flex-col items-center justify-center w-full h-full transition-colors",
            isUsersActive
              ? "text-primary bg-surface-container-low font-semibold"
              : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
          )}
          href="/admin/users"
        >
          <span className="material-symbols-outlined" data-icon="group">
            group
          </span>
          <span className="text-[10px] font-label-caps mt-1">Utilisateurs</span>
        </Link>
        <label
          className="flex flex-col items-center justify-center w-full h-full text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors cursor-pointer"
          htmlFor="mobile-menu-toggle"
        >
          <span className="material-symbols-outlined" data-icon="menu">
            menu
          </span>
          <span className="text-[10px] font-label-caps mt-1">Plus</span>
        </label>
      </nav>

      {/* Mobile Bottom Sheet Backdrop */}
      <label
        className="fixed inset-0 bg-on-background/50 z-55 hidden cursor-pointer md:hidden"
        htmlFor="mobile-menu-toggle"
        id="mobile-bottom-sheet-backdrop"
      ></label>

      {/* Mobile Bottom Sheet Menu */}
      <div
        className="fixed bottom-16 left-0 w-full bg-surface border-t border-outline-variant z-55 transform translate-y-full transition-transform duration-300 ease-in-out md:hidden flex flex-col max-h-[70vh] overflow-y-auto pb-4"
        id="mobile-bottom-sheet"
      >
        <div className="w-12 h-1 bg-outline-variant rounded-full mx-auto my-3"></div>
        <div className="px-sm py-xs">
          <h3 className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider mb-xs">
            Gestion Contenu
          </h3>
          <div className="flex flex-col gap-1">
            <Link
              className={cn(
                "flex items-center gap-sm p-xs rounded transition-colors font-body-md text-base",
                isArticlesActive
                  ? "bg-surface-container-low text-primary font-medium border-l-4 border-primary"
                  : "text-on-surface hover:bg-surface-container-low border-l-4 border-transparent"
              )}
              href="/admin"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                data-icon="article"
              >
                article
              </span>
              <span>Articles</span>
            </Link>
            <Link
              className={cn(
                "flex items-center gap-sm p-xs rounded transition-colors font-body-md text-base",
                isMediaActive
                  ? "bg-surface-container-low text-primary font-medium border-l-4 border-primary"
                  : "text-on-surface hover:bg-surface-container-low border-l-4 border-transparent"
              )}
              href="/admin/media"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                data-icon="photo_library"
              >
                photo_library
              </span>
              <span>Médias</span>
            </Link>
          </div>
        </div>
        <div className="px-sm py-xs border-t border-outline-variant mt-xs">
          <h3 className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider mb-xs mt-xs">
            Paramètres
          </h3>
          <div className="flex flex-col gap-1">
            <Link
              className={cn(
                "flex items-center gap-sm p-xs rounded transition-colors font-body-md text-base",
                isUsersActive
                  ? "bg-surface-container-low text-primary font-medium border-l-4 border-primary"
                  : "text-on-surface hover:bg-surface-container-low border-l-4 border-transparent"
              )}
              href="/admin/users"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                data-icon="group"
              >
                group
              </span>
              <span>Utilisateurs</span>
            </Link>
            <Link
              className="flex items-center gap-sm p-xs text-on-surface hover:bg-surface-container-low transition-colors font-body-md text-base"
              href="/admin"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                data-icon="security"
              >
                security
              </span>
              <span>Sécurité</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
