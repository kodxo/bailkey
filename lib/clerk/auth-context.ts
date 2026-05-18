import { auth } from "@clerk/nextjs/server";

export interface AuthContextDTO {
  userId: string;
  orgId: string;
}

export async function getAuthContext(): Promise<AuthContextDTO> {
  const { userId, orgId } = await auth();
  if (!userId) {
    throw new Error("Authentification requise");
  }
  // Fallback to default organization if orgId is not set in single-tenant / local dev mode
  const effectiveOrgId = orgId || "org_default_bailkey";
  return { userId, orgId: effectiveOrgId };
}
