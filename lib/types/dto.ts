import { PostCategory, PostStatus } from "../generated/prisma/enums";

export interface AuthorDTO {
  id: string;
  name: string;
  role: string | null;
  avatarUrl: string | null;
}

export interface TagDTO {
  id: string;
  name: string;
  slug: string;
}

export interface AdminPostDTO {
  id: string;
  slug: string;
  title: string;
  category: PostCategory;
  status: PostStatus;
  publishedAt: string | null;
  readingTime: number | null;
  coverImage: string | null;
  coverImageAlt: string | null;
  excerpt: string | null;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  authorId: string;
  author: AuthorDTO;
  tags: TagDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface MediaDTO {
  id: string;
  name: string;
  size: string;
  type: string;
  category: string;
  dimensions: string | null;
  src: string;
  icon: string;
  iconColor: string | null;
  authorId: string;
  author: AuthorDTO;
  tags: TagDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface GetPostsResponseDTO {
  success: boolean;
  posts: AdminPostDTO[];
  error?: string;
}

export interface GetPostByIdResponseDTO {
  success: boolean;
  post: AdminPostDTO | null;
  error?: string;
}

export interface CreatePostResponseDTO {
  success: boolean;
  post: AdminPostDTO | null;
  error?: string;
}

export interface UpdatePostResponseDTO {
  success: boolean;
  post: AdminPostDTO | null;
  error?: string;
}

export interface GetMediaResponseDTO {
  success: boolean;
  media: MediaDTO[];
  error?: string;
}

// === ONBOARDING DTOs ===
export interface OnboardingRequestDTO {
  role: "owner" | "tenant";
  operationType: "individual" | "company";
  firstName?: string;
  lastName?: string;
  companyName?: string;
  idNumber?: string;
  rccm?: string;
  niu?: string;
  phone?: string;
  address?: string;
}

export interface OnboardingResponseDTO {
  success: boolean;
  message?: string;
  redirectUrl?: string;
  error?: string;
}
