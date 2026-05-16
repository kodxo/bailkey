import { NextResponse } from "next/server";
import { getAdminPosts, createAdminDraftPost } from "@/lib/dal/posts";
import type { GetPostsResponseDTO, CreatePostResponseDTO } from "@/lib/types/dto";

export async function GET(): Promise<NextResponse<GetPostsResponseDTO>> {
  const result = await getAdminPosts();
  if (result.success && result.posts) {
    return NextResponse.json({ success: true, posts: result.posts });
  }
  return NextResponse.json({ success: false, posts: [], error: result.error || "Failed to fetch posts" }, { status: 500 });
}

export async function POST(): Promise<NextResponse<CreatePostResponseDTO>> {
  const result = await createAdminDraftPost();
  if (result.success && result.post) {
    return NextResponse.json({ success: true, post: result.post });
  }
  return NextResponse.json({ success: false, post: null, error: result.error || "Failed to create draft" }, { status: 500 });
}
