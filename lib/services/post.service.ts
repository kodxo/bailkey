import type { PostSaveData } from "@/lib/dal/posts";

// Helper to support absolute URLs if called from Server Components during SSR
function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const postService = {
  async getPosts() {
    try {
      const res = await fetch(`${getBaseUrl()}/api/posts`, {
        cache: "no-store",
      });
      return await res.json();
    } catch (error) {
      console.error("Erreur récupération posts:", error);
      return { success: false, posts: [] };
    }
  },

  async getPostById(id: string) {
    try {
      const res = await fetch(`${getBaseUrl()}/api/posts/${id}`, {
        cache: "no-store",
      });
      return await res.json();
    } catch (error) {
      console.error("Erreur récupération post id:", error);
      return { success: false, post: null };
    }
  },

  async createDraftPost() {
    try {
      const res = await fetch(`${getBaseUrl()}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      return await res.json();
    } catch (error) {
      console.error("Erreur création brouillon:", error);
      return { success: false, post: null };
    }
  },

  async updatePost(postId: string, data: PostSaveData) {
    try {
      const res = await fetch(`${getBaseUrl()}/api/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (error) {
      console.error("Erreur de sauvegarde:", error);
      return { success: false, error: "Sauvegarde échouée" };
    }
  }
};

