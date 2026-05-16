"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";

export const CoverUploader = () => {
  const [coverImage, setCoverImage] = useState<string>("/images/admin/cover-sample.png");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 5 Mo.");
        return;
      }
      const url = URL.createObjectURL(file);
      setCoverImage(url);
      toast.success("Image de couverture modifiée avec succès.");
    }
  };

  return (
    <div className="bg-surface-container-lowest p-6 rounded shadow-sm border border-outline-variant/50 flex flex-col gap-4">
      <h3 className="font-h3 text-xl font-semibold text-on-surface">
        Image de couverture
      </h3>
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-outline-variant rounded h-64 flex flex-col items-center justify-center text-on-surface-variant bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer group relative overflow-hidden"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Image
          alt="Luxury real estate interior"
          fill
          priority
          sizes="(max-width: 1600px) 100vw, 1600px"
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
          src={coverImage}
        />
        <div className="relative z-10 flex flex-col items-center bg-surface/80 p-4 rounded backdrop-blur-md border border-glass-border shadow-sm text-center">
          <span className="material-symbols-outlined text-3xl mb-2 text-primary">
            cloud_upload
          </span>
          <span className="font-body-md text-sm md:text-base font-medium text-on-surface">
            Cliquez pour remplacer ou glissez-déposez
          </span>
          <span className="font-label-caps text-xs text-on-surface-variant mt-1">
            PNG, JPG, WEBP (Max 5MB)
          </span>
        </div>
      </div>
    </div>
  );
};
