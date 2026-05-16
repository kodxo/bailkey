"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import TailwindEditor from "@/components/editor/editor";
import { CoverUploader } from "@/components/editor/cover-uploader";
import { MetadataForm } from "@/components/editor/metadata-form";
import { postService } from "@/lib/services/post.service";
import { useRouter } from "next/navigation";
import { PostStatus } from "@/lib/generated/prisma/enums";

import type { Post, User, Tag } from "@/lib/generated/prisma/client";

export default function AdminEditorPage(props: { searchParams: Promise<{ id?: string }> }) {
  const searchParams = use(props.searchParams);
  const id = searchParams.id;
  const router = useRouter();
  
  const [post, setPost] = useState<(Post & { author: User; tags: Tag[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    async function loadPost() {
      setLoading(true);
      if (id) {
        const res = await postService.getPostById(id);
        if (isMounted) {
          if (res.post) {
            setPost(res.post);
          } else {
            // Error loading post
            setPost(null);
          }
          setLoading(false);
        }
      } else {
        const res = await postService.createDraftPost();
        if (isMounted) {
          if (res.post) {
            router.replace(`/admin/editor?id=${res.post.id}`);
          } else {
            setLoading(false);
          }
        }
      }
    }
    
    loadPost();
    
    return () => {
      isMounted = false;
    };
  }, [id, router]);

  if (loading) {
    return <div className="p-8 text-center text-on-surface-variant font-body-lg font-semibold">Chargement...</div>;
  }

  if (!post) {
    return <div className="p-8 text-center text-error font-body-lg font-semibold">Impossible de charger ou de créer l&apos;article.</div>;
  }

  return (
    <div className="w-full flex flex-col min-h-screen bg-surface">
      {/* TopAppBar */}
      <header className="bg-surface/80 backdrop-blur-xl border-b border-glass-border shadow-sm sticky top-0 h-16 flex justify-between items-center px-6 z-40 w-full">
        <div className="flex items-center gap-2 text-on-surface-variant font-body-md text-sm md:text-base overflow-hidden whitespace-nowrap">
          <Link className="hover:text-primary transition-colors font-medium" href="/admin">Contenu</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <Link className="hover:text-primary transition-colors font-medium" href="/admin">Articles</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-on-surface font-semibold">Éditeur d&apos;article</span>
        </div>
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-2">
            <button className="hidden sm:inline-flex px-4 py-2 text-on-surface-variant font-label-caps text-xs md:text-sm hover:bg-surface-container rounded-full transition-colors border border-outline-variant cursor-pointer uppercase font-semibold">
              Aperçu
            </button>
            <button className="px-3 md:px-4 py-2 text-on-surface-variant font-label-caps text-xs md:text-sm hover:bg-surface-container rounded-full transition-colors border border-outline-variant cursor-pointer uppercase font-semibold">
              {post.status === PostStatus.DRAFT ? "Brouillon" : "Passer en brouillon"}
            </button>
            <button className="px-3 md:px-4 py-2 bg-primary text-on-primary font-label-caps text-xs md:text-sm rounded-full hover:bg-primary/90 transition-colors shadow-sm cursor-pointer uppercase font-semibold">
              Publier
            </button>
          </div>
        </div>
      </header>

      {/* Editor Workspace */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col xl:flex-row gap-6 max-w-[1600px] mx-auto w-full">
        {/* Left Pane: Editor */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Title Input */}
          <div className="bg-surface-container-lowest p-6 rounded shadow-sm border border-outline-variant/50">
            <input
              className="w-full bg-transparent border-none p-0 focus:ring-0 font-display text-2xl md:text-4xl font-bold text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:outline-hidden"
              placeholder="Titre de l'article..."
              type="text"
              defaultValue={post.title}
              // Ideally, this should also auto-save. For now it is uncontrolled. We'll leave it as defaultValue.
            />
          </div>

          {/* Cover Image */}
          <CoverUploader initialImage={post.coverImage || ""} postId={post.id} />

          {/* Rich Text Editor */}
          <div className="bg-surface-container-lowest rounded shadow-sm border border-outline-variant/50 flex-1 flex flex-col min-h-[500px]">
            {/* Note: TailwindEditor expects JSONContent. Since we save HTML, we pass the raw HTML string as initialHTML if we modify the editor */}
            <TailwindEditor postId={post.id} initialHTML={post.content} />
          </div>
        </div>

        {/* Right Pane: Configuration */}
        <MetadataForm post={post} />
      </div>
    </div>
  );
}
