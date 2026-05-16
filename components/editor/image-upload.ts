import { createImageUpload } from "novel";
import { toast } from "sonner";

import { getPresignedUrl } from "@/actions/s3";

const onUpload = async (file: File) => {
  try {
    // 1. Demander l'URL pré-signée à l'Action Serveur
    const presignedData = await getPresignedUrl(file.name, file.type);
    
    if (!presignedData.success || !presignedData.uploadUrl || !presignedData.publicUrl) {
      throw new Error(presignedData.error || "Impossible d'obtenir l'URL de téléchargement");
    }

    // 2. Uploader directement vers Cloudflare R2
    const uploadResponse = await fetch(presignedData.uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

    if (!uploadResponse.ok) {
      throw new Error("L'upload vers R2 a échoué");
    }

    // 3. Retourner l'URL publique pour que l'éditeur l'insère dans le champ "content"
    return presignedData.publicUrl;
  } catch (err) {
    console.error(err);
    toast.error("Échec du téléchargement vers Cloudflare R2.");
    return "/images/admin/cover-sample.png"; // Fallback placeholder
  }
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes("image/")) {
      toast.error("Type de fichier non supporté.");
      return false;
    } else if (file.size / 1024 / 1024 > 20) {
      toast.error("Fichier trop volumineux (max 20MB).");
      return false;
    }
    return true;
  },
});
