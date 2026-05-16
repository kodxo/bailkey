import React from "react";
import { mediaService } from "@/lib/services/media.service";
import { MediaClient } from "./media-client";

export default async function AdminMediaPage() {
  const res = await mediaService.getMedia();
  const initialMedia = res.media || [];

  return <MediaClient initialMedia={initialMedia} />;
}
