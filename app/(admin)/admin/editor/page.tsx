import React from "react";
import Image from "next/image";
import Link from "next/link";
import TailwindEditor from "@/components/editor/editor";
import { CoverUploader } from "@/components/editor/cover-uploader";
import { MetadataForm } from "@/components/editor/metadata-form";

export default function AdminEditorPage() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-surface">
      {/* TopAppBar */}
      <header className="bg-surface/80 backdrop-blur-xl border-b border-glass-border shadow-sm sticky top-0 h-16 flex justify-between items-center px-6 z-40 w-full">
        <div className="flex items-center gap-2 text-on-surface-variant font-body-md text-sm md:text-base overflow-hidden whitespace-nowrap">
          <Link
            className="hover:text-primary transition-colors font-medium"
            href="/admin"
          >
            Contenu
          </Link>
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
          <Link
            className="hover:text-primary transition-colors font-medium"
            href="/admin"
          >
            Articles
          </Link>
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
          <span className="text-on-surface font-semibold">
            Éditeur d&apos;article
          </span>
        </div>
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-2">
            <button className="hidden sm:inline-flex px-4 py-2 text-on-surface-variant font-label-caps text-xs md:text-sm hover:bg-surface-container rounded-full transition-colors border border-outline-variant cursor-pointer uppercase font-semibold">
              Aperçu
            </button>
            <button className="px-3 md:px-4 py-2 text-on-surface-variant font-label-caps text-xs md:text-sm hover:bg-surface-container rounded-full transition-colors border border-outline-variant cursor-pointer uppercase font-semibold">
              Brouillon
            </button>
            <button className="px-3 md:px-4 py-2 bg-primary text-on-primary font-label-caps text-xs md:text-sm rounded-full hover:bg-primary/90 transition-colors shadow-sm cursor-pointer uppercase font-semibold">
              Publier
            </button>
          </div>
          <div className="hidden lg:block h-6 w-px bg-outline-variant mx-2"></div>
          <div className="hidden lg:flex items-center gap-3 text-on-surface-variant">
            <button
              className="p-2 hover:bg-surface-container rounded-full transition-colors hover:text-primary cursor-pointer"
              title="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button
              className="p-2 hover:bg-surface-container rounded-full transition-colors hover:text-primary cursor-pointer"
              title="Historique"
            >
              <span className="material-symbols-outlined">history</span>
            </button>
            <button
              className="p-2 hover:bg-surface-container rounded-full transition-colors hover:text-primary cursor-pointer"
              title="Profil"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Editor Workspace */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col xl:flex-row gap-6 max-w-[1600px] mx-auto w-full">
        {/* Left Pane: Editor */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Title Input */}
          <div className="bg-surface-container-lowest p-6 rounded shadow-sm border border-outline-variant/50">
            <input
              className="w-full bg-transparent border-none p-0 focus:ring-0 font-display text-2xl md:text-4xl font-bold text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:outline-hidden"
              placeholder="Titre de l'article..."
              type="text"
              defaultValue="Les Nouvelles Tendances de l'Immobilier de Luxe"
            />
          </div>

          {/* Cover Image */}
          <CoverUploader />

          {/* Rich Text Editor */}
          <div className="bg-surface-container-lowest rounded shadow-sm border border-outline-variant/50 flex-1 flex flex-col min-h-[500px]">
            <TailwindEditor />
          </div>
        </div>

        {/* Right Pane: Configuration */}
        <MetadataForm />
      </div>
    </div>
  );
}
