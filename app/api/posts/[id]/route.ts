import { NextRequest, NextResponse } from "next/server";
import { getAdminPostById, updateAdminPost, type PostSaveDataDTO } from "@/lib/dal/posts";
import type { GetPostByIdResponseDTO, UpdatePostResponseDTO } from "@/lib/types/dto";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<GetPostByIdResponseDTO>> {
  const { id } = await params;
  const result = await getAdminPostById(id);
  
  if (result.success && result.post) {
    return NextResponse.json({ success: true, post: result.post });
  }
  
  return NextResponse.json({ success: false, post: null, error: "Post not found" }, { status: 404 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<UpdatePostResponseDTO>> {
  try {
    const { id } = await params;
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, post: null, error: "Invalid request body" }, { status: 400 });
    }
    
    const result = await updateAdminPost(id, body as Partial<PostSaveDataDTO>);
    
    if (result.success && result.post) {
      return NextResponse.json({ success: true, post: result.post });
    }
    
    return NextResponse.json({ success: false, post: null, error: result.error || "Update failed" }, { status: 400 });
  } catch (error) {
    console.error("PATCH /api/posts/[id] error:", error);
    return NextResponse.json({ success: false, post: null, error: "Invalid request body" }, { status: 400 });
  }
}
