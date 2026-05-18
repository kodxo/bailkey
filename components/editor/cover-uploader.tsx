"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";

import { getPresignedUrl } from "@/actions/s3";

interface CoverUploaderProps {
  initialImage?: string;
  postId?: string;
}

export const CoverUploader = ({ initialImage, postId }: CoverUploaderProps) => {
  const [coverImage, setCoverImage] = useState<string>(
    initialImage || "/images/admin/cover-sample.png",
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 5 Mo.");
        return;
      }

      // Temporary local preview
      const localUrl = URL.createObjectURL(file);
      setCoverImage(localUrl);
      setIsUploading(true);

      try {
        // 1. Get Presigned URL
        const presignedData = await getPresignedUrl(file.name, file.type);
        if (
          !presignedData.success ||
          !presignedData.uploadUrl ||
          !presignedData.publicUrl
        ) {
          throw new Error(presignedData.error || "Erreur URL R2");
        }

        // 2. Upload to R2
        const uploadResponse = await fetch(presignedData.uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!uploadResponse.ok) {
          throw new Error("L'upload vers R2 a échoué");
        }

        // 3. Set the final public URL
        setCoverImage(presignedData.publicUrl);
        toast.success("Image de couverture sauvegardée sur R2.");

        // 4. Update the database
        if (postId) {
          const res = await fetch(`/api/posts/${postId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ coverImage: presignedData.publicUrl }),
          });
          const updateResult: unknown = await res.json();
          if (
            !res.ok ||
            !updateResult ||
            typeof updateResult !== "object" ||
            !("success" in updateResult) ||
            !(updateResult as { success: boolean }).success
          ) {
            toast.error(
              "Erreur lors de la sauvegarde dans la base de données.",
            );
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Échec de l'upload de la couverture.");
      } finally {
        setIsUploading(false);
      }
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
          {isUploading ? (
            <>
              <span
                className="material-symbols-outlined text-3xl mb-2 text-primary animate-spin"
                data-icon="refresh"
              >
                refresh
              </span>
              <span className="font-body-md text-sm md:text-base font-semibold text-primary animate-pulse">
                Téléversement...
              </span>
            </>
          ) : (
            <>
              <span
                className="material-symbols-outlined text-3xl mb-2 text-primary"
                data-icon="cloud_upload"
              >
                cloud_upload
              </span>
              <span className="font-body-md text-sm md:text-base font-medium text-on-surface">
                Cliquez pour remplacer ou glissez-déposez
              </span>
              <span className="font-label-caps text-xs text-on-surface-variant mt-1">
                PNG, JPG, WEBP (Max 5MB)
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
