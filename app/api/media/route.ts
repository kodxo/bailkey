import { NextResponse } from "next/server";
import { getAdminMedia } from "@/lib/dal/media";
import type { GetMediaResponseDTO } from "@/lib/types/dto";

export async function GET(): Promise<NextResponse<GetMediaResponseDTO>> {
  const result = await getAdminMedia();
  if (result.success) {
    return NextResponse.json({ success: true, media: result.media });
  }
  return NextResponse.json({ success: false, media: [], error: result.error || "Failed to fetch media" }, { status: 500 });
}
