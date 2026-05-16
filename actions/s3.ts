"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function getPresignedUrl(fileName: string, fileType: string) {
  try {
    const bucketName = process.env.R2_BUCKET_NAME!;
    const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `blog-images/${Date.now()}-${safeFileName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: fileType,
    });

    // Cette URL sera valide pendant 60 secondes
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    return {
      success: true,
      uploadUrl: signedUrl,
      // L'URL publique que l'on utilisera pour afficher l'image
      publicUrl: `${process.env.NEXT_PUBLIC_R2_DEV_URL}/${key}`,
    };
  } catch (error) {
    console.error("Erreur lors de la génération de la presigned URL:", error);
    return {
      success: false,
      error: "Impossible de générer l'URL de téléchargement",
    };
  }
}
