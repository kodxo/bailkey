import { NextResponse, type NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface PresignedRequestDTO {
  fileName: string;
  fileType: string;
  folder?: string;
}

interface PresignedResponseDTO {
  success: boolean;
  uploadUrl?: string;
  publicUrl?: string;
  fileKey?: string;
  error?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<PresignedResponseDTO>> {
  try {
    const { fileName, fileType, folder = "properties" }: PresignedRequestDTO = await request.json();

    if (!fileName || !fileType) {
      return NextResponse.json(
        { success: false, error: "Nom ou type de fichier manquant" },
        { status: 400 }
      );
    }

    if (!process.env.R2_ENDPOINT || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !process.env.R2_BUCKET_NAME) {
      return NextResponse.json(
        { success: false, error: "Configuration R2 manquante sur le serveur" },
        { status: 500 }
      );
    }

    const s3Client = new S3Client({
      region: "auto",
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });

    const bucketName = process.env.R2_BUCKET_NAME;
    const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `${folder}/${Date.now()}-${safeFileName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5 minutes expiration
    const publicDomain = process.env.NEXT_PUBLIC_R2_DEV_URL || "https://r2.bailkey.com";

    return NextResponse.json({
      success: true,
      uploadUrl: signedUrl,
      publicUrl: `${publicDomain}/${key}`,
      fileKey: key,
    });
  } catch (error: unknown) {
    console.error("Erreur lors de la génération de l'URL signée:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la génération de l'URL de téléchargement" },
      { status: 500 }
    );
  }
}
