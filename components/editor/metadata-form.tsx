"use client";

import React, { useState } from "react";
import { toast } from "sonner";

export const MetadataForm = () => {
  const [isPublished, setIsPublished] = useState(false);
  const [author, setAuthor] = useState("Sarah Jenkins");
  const [category, setCategory] = useState("Analyse du Marché");
  const [tags, setTags] = useState<string[]>(["Luxe", "ESG"]);
  const [tagInput, setTagInput] = useState("");
  const [metaTitle, setMetaTitle] = useState("Tendances Immobilier de Luxe & Investissement | BailKey");
  const [metaDesc, setMetaDesc] = useState("Découvrez les nouvelles tendances de l'immobilier de luxe institutionnel. Comment l'ESG et les technologies transforment la valorisation des actifs premium.");
  const [publishDate, setPublishDate] = useState("2026-05-15");
  const [publishTime, setPublishTime] = useState("14:30");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        toast.success(`Mot-clé "${tagInput.trim()}" ajouté.`);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
    toast.info(`Mot-clé supprimé.`);
  };

  return (
    <div className="w-full xl:w-[360px] flex-shrink-0 flex flex-col gap-6">
      {/* Status Card */}
      <div className="bg-surface-container-lowest p-6 rounded shadow-sm border border-outline-variant/50">
        <h3 className="font-label-caps text-xs text-on-surface-variant mb-4 flex items-center gap-2 uppercase tracking-wider font-semibold">
          <span className="material-symbols-outlined text-sm">
            visibility
          </span>
          Visibilité &amp; Statut
        </h3>
        <div className="flex items-center justify-between mb-4">
          <span className="font-body-md text-sm text-on-surface">
            Statut actuel
          </span>
          <span
            className={`px-3 py-1 rounded-full font-label-caps text-xs flex items-center gap-1 font-semibold uppercase tracking-wider ${
              isPublished
                ? "bg-primary-container text-on-primary-container"
                : "bg-primary-container/20 text-primary"
            }`}
          >
            {isPublished ? "Publié" : "Brouillon"}
          </span>
        </div>
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="font-body-md text-sm text-on-surface group-hover:text-primary transition-colors font-medium">
            Publier en direct
          </span>
          <div className="relative">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => {
                setIsPublished(e.target.checked);
                toast.success(e.target.checked ? "Article passé en statut Publié." : "Article repassé en Brouillon.");
              }}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-surface-container-high peer-checked:bg-primary rounded-full border border-outline-variant transition-colors"></div>
            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4 shadow-sm"></div>
          </div>
        </label>
      </div>

      {/* Metadata Card */}
      <div className="bg-surface-container-lowest p-6 rounded shadow-sm border border-outline-variant/50 flex flex-col gap-4">
        <h3 className="font-label-caps text-xs text-on-surface-variant mb-2 flex items-center gap-2 uppercase tracking-wider font-semibold">
          <span className="material-symbols-outlined text-sm">label</span>
          Métadonnées
        </h3>
        <div>
          <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold uppercase tracking-wider">
            Auteur
          </label>
          <div className="flex items-center gap-3 p-3 bg-surface-container-low border border-outline-variant rounded">
            <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs">
              {author.split(" ").map((n) => n[0]).join("")}
            </div>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="font-body-md text-sm text-on-surface flex-1 font-medium bg-transparent border-none p-0 focus:ring-0 outline-none"
            />
            <span className="material-symbols-outlined text-sm text-on-surface-variant">
              edit
            </span>
          </div>
        </div>
        <div>
          <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold uppercase tracking-wider">
            Catégorie
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              toast.success(`Catégorie modifiée en "${e.target.value}".`);
            }}
            className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded font-body-md text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none cursor-pointer"
          >
            <option value="Analyse du Marché">Analyse du Marché</option>
            <option value="Tendances Architecturales">Tendances Architecturales</option>
            <option value="Investissement">Investissement</option>
            <option value="ESG &amp; Durabilité">ESG &amp; Durabilité</option>
          </select>
        </div>
        <div>
          <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold uppercase tracking-wider">
            Mots-clés (Entrée pour valider)
          </label>
          <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded flex flex-wrap gap-2 focus-within:ring-1 focus-within:ring-primary">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-surface-container px-2 py-1 rounded text-xs flex items-center gap-1 text-on-surface font-medium border border-outline-variant/30"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-destructive cursor-pointer"
                  title="Supprimer"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    close
                  </span>
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="bg-transparent border-none p-0 focus:ring-0 text-xs w-28 outline-none placeholder:text-on-surface-variant/50 focus:outline-hidden"
              placeholder="Ajouter un tag..."
            />
          </div>
        </div>
      </div>

      {/* SEO Card */}
      <div className="bg-surface-container-lowest p-6 rounded shadow-sm border border-outline-variant/50 flex flex-col gap-4">
        <h3 className="font-label-caps text-xs text-on-surface-variant mb-2 flex items-center gap-2 uppercase tracking-wider font-semibold">
          <span className="material-symbols-outlined text-sm">search</span>
          Paramètres SEO
        </h3>
        <div>
          <label className="block font-label-caps text-xs text-on-surface-variant mb-1 flex justify-between font-semibold uppercase tracking-wider">
            Meta Title
            <span className={metaTitle.length > 60 ? "text-destructive font-bold" : "text-outline"}>
              {metaTitle.length}/60
            </span>
          </label>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded font-body-md text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none focus:outline-hidden"
          />
        </div>
        <div>
          <label className="block font-label-caps text-xs text-on-surface-variant mb-1 flex justify-between font-semibold uppercase tracking-wider">
            Meta Description
            <span className={metaDesc.length > 160 ? "text-destructive font-bold" : "text-outline"}>
              {metaDesc.length}/160
            </span>
          </label>
          <textarea
            value={metaDesc}
            onChange={(e) => setMetaDesc(e.target.value)}
            rows={3}
            className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded font-body-md text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none resize-none focus:outline-hidden"
          ></textarea>
        </div>
      </div>

      {/* Schedule Card */}
      <div className="bg-surface-container-lowest p-6 rounded shadow-sm border border-outline-variant/50 flex flex-col gap-4">
        <h3 className="font-label-caps text-xs text-on-surface-variant mb-2 flex items-center gap-2 uppercase tracking-wider font-semibold">
          <span className="material-symbols-outlined text-sm">
            calendar_month
          </span>
          Calendrier de publication
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold uppercase tracking-wider">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded font-body-md text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none focus:outline-hidden"
              />
            </div>
          </div>
          <div>
            <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold uppercase tracking-wider">
              Heure
            </label>
            <div className="relative">
              <input
                type="time"
                value={publishTime}
                onChange={(e) => setPublishTime(e.target.value)}
                className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded font-body-md text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
