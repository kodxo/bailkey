import { NextResponse } from "next/server";
import { getAdminPosts, createAdminDraftPost } from "@/lib/dal/posts";

export async function GET() {
  const result = await getAdminPosts();
  if (result.success) {
    return NextResponse.json({ posts: result.posts });
  }
  return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
}

export async function POST() {
  const result = await createAdminDraftPost();
  if (result.success) {
    return NextResponse.json({ post: result.post });
  }
  return NextResponse.json({ error: "Failed to create draft" }, { status: 500 });
}
