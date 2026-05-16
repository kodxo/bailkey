import type { PostSaveDataDTO } from "@/lib/dal/posts";
import type {
  GetPostsResponseDTO,
  GetPostByIdResponseDTO,
  CreatePostResponseDTO,
  UpdatePostResponseDTO,
} from "@/lib/types/dto";

// Helper to support absolute URLs if called from Server Components during SSR
function getBaseUrl(): string {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const postService = {
  async getPosts(): Promise<GetPostsResponseDTO> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/posts`, {
        cache: "no-store",
      });
      if (!res.ok) {
        return { success: false, posts: [], error: "Erreur réseau" };
      }
      const data: unknown = await res.json();
      if (data && typeof data === "object" && "success" in data && "posts" in data && Array.isArray((data as GetPostsResponseDTO).posts)) {
        return data as GetPostsResponseDTO;
      }
      return { success: false, posts: [], error: "Format de réponse invalide" };
    } catch (error) {
      console.error("Erreur récupération posts:", error);
      return { success: false, posts: [], error: "Erreur récupération posts" };
    }
  },

  async getPostById(id: string): Promise<GetPostByIdResponseDTO> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/posts/${id}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        return { success: false, post: null, error: "Erreur réseau" };
      }
      const data: unknown = await res.json();
      if (data && typeof data === "object" && "success" in data && "post" in data) {
        return data as GetPostByIdResponseDTO;
      }
      return { success: false, post: null, error: "Format de réponse invalide" };
    } catch (error) {
      console.error("Erreur récupération post id:", error);
      return { success: false, post: null, error: "Erreur récupération post id" };
    }
  },

  async createDraftPost(): Promise<CreatePostResponseDTO> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        return { success: false, post: null, error: "Erreur réseau" };
      }
      const data: unknown = await res.json();
      if (data && typeof data === "object" && "success" in data && "post" in data) {
        return data as CreatePostResponseDTO;
      }
      return { success: false, post: null, error: "Format de réponse invalide" };
    } catch (error) {
      console.error("Erreur création brouillon:", error);
      return { success: false, post: null, error: "Erreur création brouillon" };
    }
  },

  async updatePost(postId: string, data: Partial<PostSaveDataDTO>): Promise<UpdatePostResponseDTO> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        return { success: false, post: null, error: "Erreur réseau" };
      }
      const respData: unknown = await res.json();
      if (respData && typeof respData === "object" && "success" in respData && "post" in respData) {
        return respData as UpdatePostResponseDTO;
      }
      return { success: false, post: null, error: "Format de réponse invalide" };
    } catch (error) {
      console.error("Erreur de sauvegarde:", error);
      return { success: false, post: null, error: "Sauvegarde échouée" };
    }
  }
};
