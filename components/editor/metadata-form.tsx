"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import type { Post, Tag, Auteur } from "@/lib/generated/prisma/client";

type PostCategoryType = "GUIDE" | "ANALYSE" | "CAS_CLIENT" | "ACTUALITE";

interface MetadataFormProps {
  post: Post & { author: Auteur; tags: Tag[] };
}

export const MetadataForm = ({ post }: MetadataFormProps) => {
  const [isPublished, setIsPublished] = useState(post.status === "PUBLISHED");
  const author = post.author?.name || "Sarah Jenkins";
  const [category, setCategory] = useState<
    "GUIDE" | "ANALYSE" | "CAS_CLIENT" | "ACTUALITE"
  >(post.category || "ACTUALITE");
  const [tags, setTags] = useState<string[]>(
    post.tags?.map((t) => t.name) || [],
  );
  const [tagInput, setTagInput] = useState("");
  const [metaTitle, setMetaTitle] = useState(post.metaTitle || "");
  const [metaDesc, setMetaDesc] = useState(post.metaDescription || "");

  const initialDate = post.publishedAt
    ? new Date(post.publishedAt).toISOString().split("T")[0]
    : "";
  const initialTime = post.publishedAt
    ? new Date(post.publishedAt).toISOString().split("T")[1].substring(0, 5)
    : "";

  const [publishDate, setPublishDate] = useState(initialDate);
  const [publishTime, setPublishTime] = useState(initialTime);

  const handleSave = async (data: Partial<import("@/lib/services/post.service").PostSaveData>) => {
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      const res = await response.json();
      
      if (!response.ok || !res.success) {
        toast.error("Erreur de sauvegarde automatique");
      }
    } catch (e) {
      console.error(e);
      toast.error("Erreur réseau lors de la sauvegarde");
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        const newTags = [...tags, newTag];
        setTags(newTags);
        handleSave({ tags: newTags });
        toast.success(`Mot-clé "${newTag}" ajouté.`);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((t) => t !== tagToRemove);
    setTags(newTags);
    handleSave({ tags: newTags });
    toast.info(`Mot-clé supprimé.`);
  };

  return (
    <div className="w-full xl:w-[360px] shrink-0 flex flex-col gap-6">
      {/* Status Card */}
      <div className="bg-surface-container-lowest p-6 rounded shadow-sm border border-outline-variant/50">
        <h3 className="font-label-caps text-xs text-on-surface-variant mb-4 flex items-center gap-2 uppercase tracking-wider font-semibold">
          <span className="material-symbols-outlined text-sm">visibility</span>
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
                const checked = e.target.checked;
                setIsPublished(checked);
                handleSave({
                  status: checked ? "PUBLISHED" : "DRAFT",
                });
                toast.success(
                  checked
                    ? "Article passé en statut Publié."
                    : "Article repassé en Brouillon.",
                );
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
          Classification
        </h3>

        {/* Category */}
        <div>
          <label className="block text-xs font-label-caps text-on-surface-variant mb-1 uppercase tracking-wider">
            Catégorie
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as PostCategoryType);
              handleSave({ category: e.target.value as PostCategoryType });
              toast.success(`Catégorie modifiée en "${e.target.value}".`);
            }}
            className="w-full bg-surface-container border border-outline-variant rounded px-3 py-2 text-sm font-body-md text-on-surface focus:outline-hidden focus:ring-1 focus:ring-primary transition-shadow cursor-pointer"
          >
            <option value="GUIDE">Guide</option>
            <option value="ANALYSE">Analyse</option>
            <option value="CAS_CLIENT">Cas Client</option>
            <option value="ACTUALITE">Actualité</option>
          </select>
        </div>

        {/* Author */}
        <div>
          <label className="block text-xs font-label-caps text-on-surface-variant mb-1 uppercase tracking-wider">
            Auteur (Lecture seule)
          </label>
          <div className="flex items-center gap-2 p-2 bg-surface-container border border-outline-variant rounded">
            <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-caps text-[10px] font-bold">
              {author.charAt(0)}
            </span>
            <span className="font-body-md text-sm text-on-surface flex-1 font-medium bg-transparent border-none p-0">
              {author}
            </span>
          </div>
        </div>

        {/* Tags */}
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
          <span className="material-symbols-outlined text-sm">public</span>
          SEO &amp; Référencement
        </h3>
        <div>
          <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold uppercase tracking-wider">
            Méta Titre
          </label>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            onBlur={() => handleSave({ metaTitle })}
            className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded font-body-md text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none focus:outline-hidden placeholder:text-on-surface-variant/50"
            placeholder="Titre optimisé SEO..."
          />
        </div>
        <div>
          <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold uppercase tracking-wider">
            Méta Description
          </label>
          <textarea
            value={metaDesc}
            onChange={(e) => setMetaDesc(e.target.value)}
            onBlur={() => handleSave({ metaDescription: metaDesc })}
            rows={3}
            className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded font-body-md text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none resize-none focus:outline-hidden placeholder:text-on-surface-variant/50"
            placeholder="Courte description pour Google (150-160 caractères max)..."
          ></textarea>
        </div>
      </div>

      {/* Schedule Card */}
      <div className="bg-surface-container-lowest p-6 rounded shadow-sm border border-outline-variant/50 flex flex-col gap-4">
        <h3 className="font-label-caps text-xs text-on-surface-variant mb-2 flex items-center gap-2 uppercase tracking-wider font-semibold">
          <span className="material-symbols-outlined text-sm">event</span>
          Planification
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold uppercase tracking-wider">
              Date
            </label>
            <input
              type="date"
              value={publishDate}
              onChange={(e) => {
                setPublishDate(e.target.value);
                if (e.target.value) {
                  handleSave({
                    publishedAt: new Date(
                      `${e.target.value}T${publishTime || "00:00"}:00Z`,
                    ),
                  });
                }
              }}
              className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded font-body-md text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none cursor-pointer focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block font-label-caps text-xs text-on-surface-variant mb-1 font-semibold uppercase tracking-wider">
              Heure
            </label>
            <input
              type="time"
              value={publishTime}
              onChange={(e) => {
                setPublishTime(e.target.value);
                if (publishDate) {
                  handleSave({
                    publishedAt: new Date(
                      `${publishDate}T${e.target.value || "00:00"}:00Z`,
                    ),
                  });
                }
              }}
              className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded font-body-md text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none cursor-pointer focus:outline-hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
