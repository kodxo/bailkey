import { NextRequest, NextResponse } from "next/server";
import { getAdminPostById, updateAdminPost } from "@/lib/dal/posts";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getAdminPostById(id);
  
  if (result.success && result.post) {
    return NextResponse.json({ post: result.post });
  }
  
  return NextResponse.json({ error: "Post not found" }, { status: 404 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const result = await updateAdminPost(id, body);
    
    if (result.success) {
      return NextResponse.json({ success: true, post: result.post });
    }
    
    return NextResponse.json({ error: result.error || "Update failed" }, { status: 400 });
  } catch (error) {
    console.error("PATCH /api/posts/[id] error:", error);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
