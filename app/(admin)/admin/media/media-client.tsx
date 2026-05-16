"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { MediaDTO, TagDTO } from "@/lib/types/dto";

interface MediaClientProps {
  initialMedia: MediaDTO[];
}

const CATEGORIES: string[] = ["Tous", "Images", "PDF", "Plans", "Archives"];

export function MediaClient({ initialMedia }: MediaClientProps) {
  const [mediaFiles, setMediaFiles] =
    useState<MediaDTO[]>(initialMedia);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<MediaDTO | null>(
    initialMedia[0] || null,
  );
  const [newTagInput, setNewTagInput] = useState<string>("");

  const filteredFiles = mediaFiles.filter((file) => {
    const matchesCategory =
      selectedCategory === "Tous" || file.category === selectedCategory;
    const matchesSearch = file.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddTag = () => {
    if (newTagInput.trim() && selectedFile) {
      // Dans un cas réel, appeler une Server Action ici pour lier le tag en base
      const mockTag: TagDTO = {
        id: Date.now().toString(),
        name: newTagInput.trim(),
        slug: newTagInput.trim().toLowerCase(),
      };
      const updatedFile = {
        ...selectedFile,
        tags: [...selectedFile.tags, mockTag],
      };
      setSelectedFile(updatedFile);
      setMediaFiles(
        mediaFiles.map((f) => (f.id === updatedFile.id ? updatedFile : f)),
      );
      toast.success("Mot-clé ajouté (Simulation)");
      setNewTagInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (selectedFile) {
      // Server action call here
      const updatedFile = {
        ...selectedFile,
        tags: selectedFile.tags.filter((t) => t.name !== tagToRemove),
      };
      setSelectedFile(updatedFile);
      setMediaFiles(
        mediaFiles.map((f) => (f.id === updatedFile.id ? updatedFile : f)),
      );
      toast.info("Mot-clé supprimé (Simulation)");
    }
  };

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
          <span className="text-on-surface font-semibold">
            Bibliothèque de Médias
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <span
                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base"
                data-icon="search"
              >
                search
              </span>
              <input
                className="pl-10 pr-4 py-2 bg-surface-container border border-outline-variant rounded text-on-surface focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary w-64 font-body-md text-sm placeholder:text-on-surface-variant/70"
                placeholder="Rechercher un fichier..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* L'import réel nécessite l'intégration avec R2 similaire au CoverUploader */}
            <button className="bg-primary-container text-on-primary-container font-label-caps font-semibold text-xs uppercase tracking-wider py-2 px-4 rounded hover:bg-primary hover:text-on-primary transition-colors flex items-center gap-2 cursor-pointer shadow-sm">
              <span
                className="material-symbols-outlined text-base"
                data-icon="upload"
              >
                upload
              </span>
              Importer
            </button>
          </div>
          <div className="hidden lg:block h-6 w-px bg-outline-variant mx-2"></div>
        </div>
      </header>

      {/* Workspace Area */}
      <main className="flex-1 overflow-hidden p-6 flex flex-col lg:flex-row gap-6 max-w-[1600px] mx-auto w-full min-h-[calc(100vh-64px)]">
        {/* Left Pane: Media Grid */}
        <div className="flex-1 flex flex-col min-w-0 bg-surface-container-lowest border border-outline-variant rounded shadow-sm overflow-hidden h-full">
          {/* Filters */}
          <div className="p-4 border-b border-surface-variant flex gap-2 shrink-0 overflow-hidden flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-1.5 font-label-caps tracking-wider text-xs rounded-full cursor-pointer uppercase transition-all shadow-xs font-semibold",
                  selectedCategory === cat
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container text-on-surface-variant border border-outline-variant hover:bg-surface-container-high",
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredFiles.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-50">
                  imagesmode
                </span>
                <p>Aucun fichier multimédia trouvé.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFiles.map((file) => {
                  const isSelected = selectedFile?.id === file.id;

                  return (
                    <div
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      className={cn(
                        "group relative bg-surface rounded overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all flex flex-col border",
                        isSelected
                          ? "border-2 border-primary"
                          : "border-outline-variant hover:border-primary-container",
                      )}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 z-10 w-6 h-6 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-xs">
                          <span className="material-symbols-outlined text-sm font-bold">
                            check
                          </span>
                        </div>
                      )}
                      <div className="aspect-square bg-surface-container relative overflow-hidden flex items-center justify-center">
                        {file.category === "Images" && file.src ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            alt={file.name}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            src={file.src}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-surface-container-high/50 group-hover:bg-surface-container-highest transition-colors">
                            <span
                              className={cn(
                                "material-symbols-outlined text-5xl",
                                file.iconColor || "text-primary",
                              )}
                            >
                              {file.icon}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 bg-surface border-t border-surface-variant mt-auto">
                        <p
                          className="font-body-md font-semibold text-sm text-on-surface truncate"
                          title={file.name}
                        >
                          {file.name}
                        </p>
                        <p className="font-label-caps font-semibold uppercase tracking-wider text-xs text-on-surface-variant mt-1">
                          {file.size} • {file.type}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: File Details */}
        {selectedFile && (
          <aside className="w-full lg:w-[360px] bg-surface-container-lowest border border-outline-variant rounded shadow-sm flex flex-col shrink-0 overflow-hidden h-full">
            <div className="aspect-4/3 bg-surface-container relative group overflow-hidden shrink-0 flex items-center justify-center border-b border-surface-variant">
              {selectedFile.category === "Images" && selectedFile.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={selectedFile.name}
                  className="object-cover w-full h-full"
                  src={selectedFile.src}
                />
              ) : (
                <span
                  className={cn(
                    "material-symbols-outlined text-6xl",
                    selectedFile.iconColor || "text-primary",
                  )}
                >
                  {selectedFile.icon}
                </span>
              )}
            </div>

            <div className="p-6 flex-1 overflow-y-auto overflow-x-hidden">
              <div className="mb-6">
                <h2 className="font-h3 text-lg font-bold text-on-surface mb-2 wrap-break-words">
                  {selectedFile.name}
                </h2>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span
                    className="material-symbols-outlined text-base"
                    data-icon="image"
                  >
                    {selectedFile.icon}
                  </span>
                  <span className="font-body-md text-sm font-medium">
                    Fichier {selectedFile.type}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-center border-b border-surface-variant pb-2">
                  <span className="font-label-caps font-semibold text-xs text-on-surface-variant uppercase tracking-wider">
                    Taille
                  </span>
                  <span className="font-body-md text-sm text-on-surface font-semibold">
                    {selectedFile.size}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-surface-variant pb-2">
                  <span className="font-label-caps font-semibold text-xs text-on-surface-variant uppercase tracking-wider">
                    Dimensions
                  </span>
                  <span className="font-body-md text-sm text-on-surface font-semibold">
                    {selectedFile.dimensions || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-surface-variant pb-2">
                  <span className="font-label-caps font-semibold text-xs text-on-surface-variant uppercase tracking-wider">
                    Auteur
                  </span>
                  <span className="font-body-md text-sm text-on-surface font-semibold">
                    {selectedFile.author.name}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-label-caps font-semibold text-xs text-on-surface-variant uppercase tracking-wider mb-3">
                  Mots-clés liés
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedFile.tags.map((tag: TagDTO) => (
                    <span
                      key={tag.id}
                      className="bg-surface-container text-on-surface px-3 py-1 rounded-full font-label-caps font-semibold text-xs border border-outline-variant flex items-center gap-1.5 shadow-xs uppercase tracking-wider"
                    >
                      {tag.name}
                      <button
                        onClick={() => handleRemoveTag(tag.name)}
                        className="hover:text-destructive cursor-pointer flex items-center"
                      >
                        <span className="material-symbols-outlined text-xs">
                          close
                        </span>
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 w-full">
                  <input
                    type="text"
                    placeholder="Nouveau tag..."
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 min-w-0 bg-surface-container border border-outline-variant rounded px-3 py-1.5 font-body-md text-sm text-on-surface focus:ring-1 focus:ring-primary outline-hidden"
                  />
                  <button
                    onClick={handleAddTag}
                    className="shrink-0 bg-surface border border-outline text-on-surface px-3 py-1.5 rounded font-label-caps font-semibold uppercase text-xs tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm font-bold">
                      add
                    </span>
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          </aside>
        )}
      </main>
    </div>
  );
}
