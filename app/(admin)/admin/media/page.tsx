"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AuthorInfo {
  name: string;
  initials: string;
}

interface MediaFile {
  id: string;
  name: string;
  size: string;
  type: string;
  category: string;
  dimensions: string;
  addedAt: string;
  author: AuthorInfo;
  src: string;
  tags: string[];
  icon: string;
  iconColor?: string;
}

const INITIAL_FILES: MediaFile[] = [
  {
    id: "1",
    name: "facade_batiment_A.jpg",
    size: "4.2 MB",
    type: "JPG",
    category: "Images",
    dimensions: "4000 x 3000 px",
    addedAt: "12 Oct 2023, 14:30",
    author: { name: "Jean Dupont", initials: "JD" },
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4FA_UjfiFwcZ1qNYAo7hb5-ACSijU6WUtaf5n4I4NyID3FGD1IzGVr7Fg9D940Nq51XYYc7Yfc_lw32b0qY0G4EmObejeExdchwmYGPwEcfydTBticYnFrB5ReDtBUyL6-Rt4fUE17i71uAxEVzSqQMUkXq7TlK23bHPdQb0vOA-HYmhaPwddDFTqktpSuhkgy00ozMu2t4PcKzG7gLxRYH1LtfbeYzD1jDPvcgA_2UCPJ-HLDhF3GCpPZgEw72iKjI6w5H7-6uY",
    tags: ["Façade", "Extérieur", "Batiment A"],
    icon: "image"
  },
  {
    id: "2",
    name: "contrat_bail_2024.pdf",
    size: "1.1 MB",
    type: "PDF",
    category: "PDF",
    dimensions: "A4 Standard",
    addedAt: "14 Oct 2023, 09:15",
    author: { name: "Sarah Jenkins", initials: "SJ" },
    src: "",
    tags: ["Contrat", "Bail", "Juridique"],
    icon: "picture_as_pdf",
    iconColor: "text-tertiary"
  },
  {
    id: "3",
    name: "plan_etage_3_cad.dwg",
    size: "8.5 MB",
    type: "DWG",
    category: "Plans",
    dimensions: "Vecteur CAD",
    addedAt: "10 Oct 2023, 16:45",
    author: { name: "Marc Lemaire", initials: "ML" },
    src: "",
    tags: ["Plan", "Étage 3", "Architecture"],
    icon: "architecture",
    iconColor: "text-on-surface-variant"
  },
  {
    id: "4",
    name: "bureau_open_space.png",
    size: "2.8 MB",
    type: "PNG",
    category: "Images",
    dimensions: "2560 x 1440 px",
    addedAt: "08 Oct 2023, 11:20",
    author: { name: "Alice Martin", initials: "AM" },
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIAhyR17eayczQk9YFS6kCB8iw_kcB9Xo_MuXkEzbdlYjCrgqLkuq5s1bTbwVEZeUdGy2TEKoIk4BfvUCI6lPnU_zqAlEbNohkl5_ao0ZCWEWygrcjMJugO7ZtQ_zy8d9BdZi1HsoZnl3e4ZCOxaXFrRwVgEc43dibyvr82USWkBvSROmZ_AkkEQMKQRI10RCOHNiX7GcrT-EllyID8kDlEBdllLFNtkDCYzoMtDbHT0MJeiCs0BOdSfrLPaA8LSomEw9xhuJszjg",
    tags: ["Intérieur", "Bureaux", "Open Space"],
    icon: "image"
  }
];

const CATEGORIES: string[] = ["Tous", "Images", "PDF", "Plans", "Archives"];

export default function MediaPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<MediaFile>(INITIAL_FILES[0]);
  const [newTagInput, setNewTagInput] = useState<string>("");

  const filteredFiles = INITIAL_FILES.filter((file) => {
    const matchesCategory =
      selectedCategory === "Tous" || file.category === selectedCategory;
    const matchesSearch = file.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddTag = () => {
    if (newTagInput.trim() && !selectedFile.tags.includes(newTagInput.trim())) {
      setSelectedFile({
        ...selectedFile,
        tags: [...selectedFile.tags, newTagInput.trim()],
      });
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
    setSelectedFile({
      ...selectedFile,
      tags: selectedFile.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-surface">
      {/* TopAppBar */}
      <header className="bg-surface/80 backdrop-blur-xl border-b border-glass-border shadow-sm sticky top-0 h-16 flex justify-between items-center px-6 z-40 w-full">
        <div className="flex items-center gap-2 text-on-surface-variant font-body-md text-sm md:text-base overflow-hidden whitespace-nowrap">
          <Link className="hover:text-primary transition-colors font-medium" href="/admin">
            Contenu
          </Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-on-surface font-semibold">Bibliothèque de Médias</span>
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
            <button
              className="bg-primary-container text-on-primary-container font-label-caps font-semibold text-xs uppercase tracking-wider py-2 px-4 rounded hover:bg-primary hover:text-on-primary transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-base" data-icon="upload">
                upload
              </span>
              Importer
            </button>
          </div>
          <div className="hidden lg:block h-6 w-px bg-outline-variant mx-2"></div>
          <div className="hidden lg:flex items-center gap-3 text-on-surface-variant">
            <button className="p-2 hover:bg-surface-container rounded-full transition-colors hover:text-primary cursor-pointer">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
            <button className="p-2 hover:bg-surface-container rounded-full transition-colors hover:text-primary cursor-pointer">
              <span className="material-symbols-outlined text-xl">history</span>
            </button>
            <button className="p-2 hover:bg-surface-container rounded-full transition-colors hover:text-primary cursor-pointer">
              <span className="material-symbols-outlined text-xl">account_circle</span>
            </button>
          </div>
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
                    : "bg-surface-container text-on-surface-variant border border-outline-variant hover:bg-surface-container-high"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFiles.map((file) => {
                const isSelected = selectedFile.id === file.id;

                return (
                  <div
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className={cn(
                      "group relative bg-surface rounded overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all flex flex-col border",
                      isSelected ? "border-2 border-primary" : "border-outline-variant hover:border-primary-container"
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 z-10 w-6 h-6 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                      </div>
                    )}
                    <div className="aspect-square bg-surface-container relative overflow-hidden flex items-center justify-center">
                      {file.src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          alt={file.name}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          src={file.src}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-surface-container-high/50 group-hover:bg-surface-container-highest transition-colors">
                          <span className={cn("material-symbols-outlined text-5xl", file.iconColor || "text-primary")}>
                            {file.icon}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-surface border-t border-surface-variant mt-auto">
                      <p className="font-body-md font-semibold text-sm text-on-surface truncate" title={file.name}>
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
          </div>
        </div>

        {/* Right Pane: File Details */}
        <aside className="w-full lg:w-[360px] bg-surface-container-lowest border border-outline-variant rounded shadow-sm flex flex-col shrink-0 overflow-hidden h-full">
          {/* Preview Area */}
          <div className="aspect-[4/3] bg-surface-container relative group overflow-hidden shrink-0 flex items-center justify-center border-b border-surface-variant">
            {selectedFile.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={selectedFile.name}
                className="object-cover w-full h-full"
                src={selectedFile.src}
              />
            ) : (
              <span className={cn("material-symbols-outlined text-6xl", selectedFile.iconColor || "text-primary")}>
                {selectedFile.icon}
              </span>
            )}
            {/* Glassmorphism overlay action */}
            <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button
                onClick={() => window.open(selectedFile.src || "#", "_blank")}
                className="bg-surface/90 text-on-surface px-4 py-2 rounded font-label-caps uppercase text-xs tracking-wider font-semibold flex items-center gap-2 border border-glass-border shadow-lg cursor-pointer hover:bg-surface transition-colors"
              >
                <span className="material-symbols-outlined text-sm" data-icon="fullscreen">
                  fullscreen
                </span>
                Agrandir
              </button>
            </div>
          </div>

          {/* Info Area */}
          <div className="p-6 flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mb-6">
              <h2 className="font-h3 text-lg font-bold text-on-surface mb-2 break-words">
                {selectedFile.name}
              </h2>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-base" data-icon="image">
                  {selectedFile.icon}
                </span>
                <span className="font-body-md text-sm font-medium">Fichier {selectedFile.type}</span>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between items-center border-b border-surface-variant pb-2">
                <span className="font-label-caps font-semibold text-xs text-on-surface-variant uppercase tracking-wider">Taille</span>
                <span className="font-body-md text-sm text-on-surface font-semibold">{selectedFile.size}</span>
              </div>
              <div className="flex justify-between items-center border-b border-surface-variant pb-2">
                <span className="font-label-caps font-semibold text-xs text-on-surface-variant uppercase tracking-wider">Dimensions</span>
                <span className="font-body-md text-sm text-on-surface font-semibold">{selectedFile.dimensions}</span>
              </div>
              <div className="flex justify-between items-center border-b border-surface-variant pb-2">
                <span className="font-label-caps font-semibold text-xs text-on-surface-variant uppercase tracking-wider">Ajouté le</span>
                <span className="font-body-md text-sm text-on-surface font-semibold">{selectedFile.addedAt}</span>
              </div>
              <div className="flex justify-between items-center border-b border-surface-variant pb-2">
                <span className="font-label-caps font-semibold text-xs text-on-surface-variant uppercase tracking-wider">Auteur</span>
                <span className="font-body-md text-sm text-on-surface font-semibold flex items-center gap-2">
                  <div className="w-5 h-5 bg-primary-container rounded-full flex items-center justify-center text-[10px] text-on-primary-container font-bold">
                    {selectedFile.author.initials}
                  </div>
                  {selectedFile.author.name}
                </span>
              </div>
            </div>

            {/* Tags / Metadata */}
            <div className="mb-6">
              <h3 className="font-label-caps font-semibold text-xs text-on-surface-variant uppercase tracking-wider mb-3">
                Mots-clés liés
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedFile.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-surface-container text-on-surface px-3 py-1 rounded-full font-label-caps font-semibold text-xs border border-outline-variant flex items-center gap-1.5 shadow-xs uppercase tracking-wider"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-destructive cursor-pointer flex items-center"
                      title="Supprimer le tag"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
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
                  className="flex-1 min-w-0 bg-surface-container border border-outline-variant rounded px-3 py-1.5 font-body-md text-sm text-on-surface focus:ring-1 focus:ring-primary outline-hidden placeholder:text-on-surface-variant/60"
                />
                <button
                  onClick={handleAddTag}
                  className="shrink-0 whitespace-nowrap bg-surface border border-outline text-on-surface px-3 py-1.5 rounded font-label-caps font-semibold uppercase text-xs tracking-wider hover:border-primary hover:text-primary transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-sm font-bold" data-icon="add">
                    add
                  </span>
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="p-4 bg-surface-container-low border-t border-surface-variant flex flex-col gap-2 shrink-0">
            <button
              onClick={() => window.open(selectedFile.src || "#", "_blank")}
              className="w-full bg-primary text-on-primary font-label-caps font-semibold uppercase tracking-wider text-xs py-3 px-4 rounded shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg" data-icon="download">
                download
              </span>
              Télécharger
            </button>
            <div className="flex gap-2">
              <button
                className="flex-1 bg-surface border border-outline-variant text-on-surface font-label-caps font-semibold uppercase tracking-wider text-xs py-2 px-3 rounded hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-base" data-icon="find_replace">
                  find_replace
                </span>
                Remplacer
              </button>
              <button
                className="flex-1 bg-surface border border-error/30 text-error font-label-caps font-semibold uppercase tracking-wider text-xs py-2 px-3 rounded hover:bg-error-container hover:text-on-error-container transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-base" data-icon="delete">
                  delete
                </span>
                Supprimer
              </button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
