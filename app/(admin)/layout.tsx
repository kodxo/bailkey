import "./global-admin.css";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background text-on-background font-body-md flex min-h-screen transition-all duration-300 ease-in-out">
      {/* Side Nav Rail (Medium/Desktop) */}
      <nav className="hidden md:flex flex-col py-md bg-surface border-r border-outline-variant shadow-none h-screen left-0 w-[88px] fixed top-0 z-50 transition-all duration-300 ease-in-out items-center">
        <div className="mb-lg flex flex-col items-center">
          <Link href="/">
            <Image
              alt="BailKey Logo"
              width={40}
              height={40}
              className="w-10 h-auto object-contain"
              src="/logo.png"
            />
          </Link>
        </div>
        <div className="flex-1 flex flex-col gap-sm w-full">
          {/* Item 1: Content */}
          <div className="nav-item-group relative flex justify-center w-full group">
            <Link
              href="/admin"
              className="flex flex-col items-center justify-center p-sm w-[64px] h-[64px] hover:bg-surface-container-high transition-colors cursor-pointer bg-primary-container/10 text-primary"
            >
              <span
                className="material-symbols-outlined text-[24px]"
                data-icon="folder"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                folder
              </span>
              <span className="text-[10px] font-label-caps mt-1">Contenu</span>
            </Link>
            {/* Flyout Menu */}
            <div className="nav-flyout hidden opacity-0 invisible absolute left-[88px] top-0 bg-surface border border-outline-variant shadow-md flex-col w-48 z-50 transition-all duration-200">
              <div className="px-sm py-xs border-b border-outline-variant bg-surface-container-low">
                <span className="text-[11px] font-label-caps uppercase font-bold tracking-widest text-on-surface-variant">
                  Gestion Contenu
                </span>
              </div>
              <Link
                className="flex items-center gap-sm px-sm py-2 hover:bg-surface-container-high text-primary border-l-4 border-primary transition-colors"
                href="/admin"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  data-icon="article"
                >
                  article
                </span>
                <span className="text-body-md">Articles</span>
              </Link>
              <Link
                className="flex items-center gap-sm px-sm py-2 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border-l-4 border-transparent transition-colors"
                href="/admin"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  data-icon="category"
                >
                  category
                </span>
                <span className="text-body-md">Catégories</span>
              </Link>
              <Link
                className="flex items-center gap-sm px-sm py-2 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border-l-4 border-transparent transition-colors"
                href="/admin"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  data-icon="sell"
                >
                  sell
                </span>
                <span className="text-body-md">Mots-clés</span>
              </Link>
            </div>
          </div>
          {/* Item 2: Property */}
          <div className="nav-item-group relative flex justify-center w-full group">
            <Link
              href="/admin"
              className="flex flex-col items-center justify-center p-sm w-[64px] h-[64px] hover:bg-surface-container-high text-on-surface-variant transition-colors cursor-pointer"
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
            <div className="nav-flyout hidden opacity-0 invisible absolute left-[88px] top-0 bg-surface border border-outline-variant shadow-md flex-col w-48 z-50 transition-all duration-200">
              <div className="px-sm py-xs border-b border-outline-variant bg-surface-container-low">
                <span className="text-[11px] font-label-caps uppercase font-bold tracking-widest text-on-surface-variant">
                  Patrimoine
                </span>
              </div>
              <Link
                className="flex items-center gap-sm px-sm py-2 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border-l-4 border-transparent transition-colors"
                href="/admin"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  data-icon="apartment"
                >
                  apartment
                </span>
                <span className="text-body-md">Propriétés</span>
              </Link>
              <Link
                className="flex items-center gap-sm px-sm py-2 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border-l-4 border-transparent transition-colors"
                href="/admin"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  data-icon="real_estate_agent"
                >
                  real_estate_agent
                </span>
                <span className="text-body-md">Locataires</span>
              </Link>
            </div>
          </div>
          {/* Item 3: Settings */}
          <div className="nav-item-group relative flex justify-center w-full group">
            <Link
              href="/admin"
              className="flex flex-col items-center justify-center p-sm w-[64px] h-[64px] hover:bg-surface-container-high text-on-surface-variant transition-colors cursor-pointer"
            >
              <span
                className="material-symbols-outlined text-[24px]"
                data-icon="settings"
              >
                settings
              </span>
              <span className="text-[10px] font-label-caps mt-1">Config</span>
            </Link>
            {/* Flyout Menu */}
            <div className="nav-flyout hidden opacity-0 invisible absolute left-[88px] top-0 bg-surface border border-outline-variant shadow-md flex-col w-48 z-50 transition-all duration-200">
              <div className="px-sm py-xs border-b border-outline-variant bg-surface-container-low">
                <span className="text-[11px] font-label-caps uppercase font-bold tracking-widest text-on-surface-variant">
                  Paramètres
                </span>
              </div>
              <Link
                className="flex items-center gap-sm px-sm py-2 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border-l-4 border-transparent transition-colors"
                href="/admin"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  data-icon="group"
                >
                  group
                </span>
                <span className="text-body-md">Utilisateurs</span>
              </Link>
              <Link
                className="flex items-center gap-sm px-sm py-2 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border-l-4 border-transparent transition-colors"
                href="/admin"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  data-icon="security"
                >
                  security
                </span>
                <span className="text-body-md">Sécurité</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-auto flex flex-col gap-sm items-center w-full pt-md border-t border-outline-variant">
          <Link
            className="flex flex-col items-center justify-center p-sm w-[64px] h-[64px] text-on-surface-variant hover:bg-surface-container-high transition-colors"
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
          <Link
            className="flex flex-col items-center justify-center p-sm w-[64px] h-[64px] text-on-surface-variant hover:bg-surface-container-high transition-colors"
            href="/"
            title="Déconnexion"
          >
            <span
              className="material-symbols-outlined text-[24px]"
              data-icon="logout"
            >
              logout
            </span>
          </Link>
          <Image
            alt="Administrator profile photo"
            width={40}
            height={40}
            className="w-10 h-10 object-cover mt-sm border border-outline-variant"
            src="/images/admin/profile.png"
          />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:ml-[88px] w-full bg-surface-bright transition-all duration-300 ease-in-out pb-[80px] md:pb-0 relative">
        {/* TopNavBar (Mobile) */}
        <header className="flex justify-between items-center w-full px-md h-16 sticky top-0 z-40 bg-surface border-b border-outline-variant text-primary md:hidden transition-all duration-300 ease-in-out">
          <div className="flex items-center gap-sm">
            <Link href="/">
              <Image
                alt="BailKey Logo"
                width={120}
                height={24}
                className="h-6 w-auto object-contain"
                src="/logo.png"
              />
            </Link>
          </div>
          <div className="flex items-center gap-sm">
            <button className="text-primary hover:bg-primary-container/10 transition-colors p-xs">
              <span className="material-symbols-outlined" data-icon="search">
                search
              </span>
            </button>
            <Image
              alt="Administrator profile photo"
              width={32}
              height={32}
              className="w-8 h-8 object-cover ml-xs"
              src="/images/admin/profile.png"
            />
          </div>
        </header>

        {/* Floating Action Button for Medium/Desktop */}
        <button className="hidden md:flex fixed bottom-md right-md z-50 py-sm px-md bg-primary text-on-primary font-label-caps text-label-caps hover:bg-primary/90 transition-all items-center justify-center gap-xs uppercase tracking-wider shadow-md cursor-pointer">
          <span
            className="material-symbols-outlined"
            data-icon="add"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            add
          </span>
          Nouvel Article
        </button>

        {/* Page Content Canvas (Renders Page Children) */}
        <div className="p-md w-full max-w-[1200px] mx-auto flex flex-col gap-lg transition-all duration-300 ease-in-out">
          {children}
        </div>
      </main>

      <input className="hidden" id="mobile-menu-toggle" type="checkbox" />

      {/* Bottom Nav Bar for Mobile */}
      <nav className="fixed bottom-0 left-0 w-full bg-surface border-t border-outline-variant z-[60] md:hidden flex justify-around items-center h-16 transition-all duration-300 ease-in-out">
        <Link
          className="flex flex-col items-center justify-center w-full h-full text-primary hover:bg-surface-container-low transition-colors"
          href="/admin"
        >
          <span className="material-symbols-outlined" data-icon="article">
            article
          </span>
          <span className="text-[10px] font-label-caps mt-1">Articles</span>
        </Link>
        <Link
          className="flex flex-col items-center justify-center w-full h-full text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
          href="/admin"
        >
          <span className="material-symbols-outlined" data-icon="apartment">
            apartment
          </span>
          <span className="text-[10px] font-label-caps mt-1">Propriétés</span>
        </Link>
        <Link
          className="flex flex-col items-center justify-center w-full h-full text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
          href="/admin"
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
        className="fixed inset-0 bg-on-background/50 z-[55] hidden md:hidden cursor-pointer"
        htmlFor="mobile-menu-toggle"
        id="mobile-bottom-sheet-backdrop"
      ></label>

      {/* Mobile Bottom Sheet Menu */}
      <div
        className="fixed bottom-16 left-0 w-full bg-surface border-t border-outline-variant z-[55] transform translate-y-full transition-transform duration-300 ease-in-out md:hidden flex flex-col max-h-[70vh] overflow-y-auto pb-4"
        id="mobile-bottom-sheet"
      >
        <div className="w-12 h-1 bg-outline-variant rounded-full mx-auto my-3"></div>
        <div className="px-sm py-xs">
          <h3 className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider mb-xs">
            Gestion Contenu
          </h3>
          <div className="flex flex-col gap-1">
            <Link
              className="flex items-center gap-sm p-xs text-on-surface hover:bg-surface-container-low transition-colors"
              href="/admin"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                data-icon="article"
              >
                article
              </span>
              <span className="text-body-md font-body-md">Articles</span>
            </Link>
            <Link
              className="flex items-center gap-sm p-xs text-on-surface hover:bg-surface-container-low transition-colors"
              href="/admin"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                data-icon="category"
              >
                category
              </span>
              <span className="text-body-md font-body-md">Catégories</span>
            </Link>
            <Link
              className="flex items-center gap-sm p-xs text-on-surface hover:bg-surface-container-low transition-colors"
              href="/admin"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                data-icon="sell"
              >
                sell
              </span>
              <span className="text-body-md font-body-md">Mots-clés</span>
            </Link>
          </div>
        </div>
        <div className="px-sm py-xs border-t border-outline-variant mt-xs">
          <h3 className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider mb-xs mt-xs">
            Gestion Patrimoine
          </h3>
          <div className="flex flex-col gap-1">
            <Link
              className="flex items-center gap-sm p-xs text-on-surface hover:bg-surface-container-low transition-colors"
              href="/admin"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                data-icon="apartment"
              >
                apartment
              </span>
              <span className="text-body-md font-body-md">Propriétés</span>
            </Link>
            <Link
              className="flex items-center gap-sm p-xs text-on-surface hover:bg-surface-container-low transition-colors"
              href="/admin"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                data-icon="real_estate_agent"
              >
                real_estate_agent
              </span>
              <span className="text-body-md font-body-md">Locataires</span>
            </Link>
          </div>
        </div>
        <div className="px-sm py-xs border-t border-outline-variant mt-xs">
          <h3 className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider mb-xs mt-xs">
            Paramètres
          </h3>
          <div className="flex flex-col gap-1">
            <Link
              className="flex items-center gap-sm p-xs text-on-surface hover:bg-surface-container-low transition-colors"
              href="/admin"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                data-icon="settings"
              >
                settings
              </span>
              <span className="text-body-md font-body-md">Configuration</span>
            </Link>
            <Link
              className="flex items-center gap-sm p-xs text-on-surface hover:bg-surface-container-low transition-colors"
              href="/admin"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                data-icon="security"
              >
                security
              </span>
              <span className="text-body-md font-body-md">Sécurité</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
