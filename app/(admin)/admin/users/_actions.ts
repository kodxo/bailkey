"use server";

import { clerkClient, type User } from "@clerk/nextjs/server";
import { checkRole } from "@/lib/clerk/check-role";
import { Roles } from "@/types/globals";
export interface OrganizationBrief {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
}

export interface UserItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  role: Roles;
  createdAt: number;
  lastSignInAt: number | null;
  organizations?: OrganizationBrief[];
}

export interface UpdateRoleResponse {
  success: boolean;
  error?: string;
}

export async function formatUserItems(rawUsers: User[]): Promise<UserItem[]> {
  const client = await clerkClient();
  return Promise.all(
    rawUsers.map(async (u) => {
      let orgs: OrganizationBrief[] = [];
      try {
        const memRes = await client.users.getOrganizationMembershipList({
          userId: u.id,
          limit: 10,
        });
        const memberships = Array.isArray(memRes) ? memRes : memRes.data || [];
        orgs = memberships.map((m) => ({
          id: m.organization.id,
          name: m.organization.name,
          slug: m.organization.slug || "",
          imageUrl: m.organization.imageUrl || null,
        }));
      } catch (err) {
        console.error(`Erreur fetch orgs pour user ${u.id}:`, err);
      }
      return {
        id: u.id,
        email: u.emailAddresses[0]?.emailAddress || "Aucun email",
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        imageUrl: u.imageUrl || "",
        role: (u.publicMetadata?.role as Roles) || "user",
        createdAt: u.createdAt,
        lastSignInAt: u.lastSignInAt || null,
        organizations: orgs,
      };
    })
  );
}

export async function updateUserRoleAction(
  userId: string,
  newRole: Roles
): Promise<UpdateRoleResponse> {
  if (!(await checkRole("admin"))) {
    return {
      success: false,
      error: "Accès refusé. Droits administrateur requis.",
    };
  }

  const client = await clerkClient();

  try {
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role: newRole },
    });
    return { success: true };
  } catch (error) {
    console.error("Erreur mise à jour rôle:", error);
    return {
      success: false,
      error: "Erreur lors de la mise à jour du rôle.",
    };
  }
}

export interface FetchUsersParams {
  page: number;
  pageSize: number;
  query?: string;
  orgId?: string;
}

export interface FetchUsersResult {
  success: boolean;
  users: UserItem[];
  totalCount: number;
  error?: string;
}

export async function fetchUsersAction(
  params: FetchUsersParams
): Promise<FetchUsersResult> {
  if (!(await checkRole("admin"))) {
    return {
      success: false,
      users: [],
      totalCount: 0,
      error: "Accès refusé",
    };
  }

  const client = await clerkClient();
  const offset = (params.page - 1) * params.pageSize;

  try {
    const res = await client.users.getUserList({
      limit: params.pageSize,
      offset: offset,
      query: params.query || undefined,
      organizationId: params.orgId ? [params.orgId] : undefined,
      orderBy: "-created_at",
    });

    const rawUsers = Array.isArray(res) ? res : res.data || [];
    const totalCount =
      !Array.isArray(res) && typeof res.totalCount === "number"
        ? res.totalCount
        : rawUsers.length;

    const formattedUsers: UserItem[] = await formatUserItems(rawUsers);

    return {
      success: true,
      users: formattedUsers,
      totalCount: totalCount,
    };
  } catch (error) {
    console.error("Erreur fetchUsersAction:", error);
    return {
      success: false,
      users: [],
      totalCount: 0,
      error: "Erreur lors de la récupération des utilisateurs",
    };
  }
}
