import { createImageUpload } from "novel";
import { toast } from "sonner";

const onUpload = async (file: File) => {
  const promise = fetch("/api/upload", {
    method: "POST",
    headers: {
      "content-type": file?.type || "application/octet-stream",
      "x-vercel-filename": file?.name || "image.png",
    },
    body: file,
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Upload failed");
      }
      return res.text();
    })
    .catch((err) => {
      console.error(err);
      toast.error(
        "Échec du téléchargement. L'API /api/upload n'est pas encore implémentée.",
      );
      return "/images/admin/cover-sample.png"; // Fallback placeholder
    });

  return promise;
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
