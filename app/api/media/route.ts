import { NextResponse } from "next/server";
import { mediaService } from "@/lib/services/media.service";

export async function GET() {
  const result = await mediaService.getMedia();
  if (result.success) {
    return NextResponse.json({ media: result.media });
  }
  return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
}
