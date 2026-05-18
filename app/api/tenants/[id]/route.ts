import { NextResponse, type NextRequest } from "next/server";
import { getAdminTenantById, updateAdminTenant, type SaveTenantInputDTO } from "@/lib/dal/tenants";
import type { SaveTenantResponseDTO } from "@/lib/types/property";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<{ success: boolean; tenant: unknown | null; error?: string }>> {
  const resolvedParams = await params;
  const result = await getAdminTenantById(resolvedParams.id);
  if (result.success && result.tenant) {
    return NextResponse.json({ success: true, tenant: result.tenant });
  }
  return NextResponse.json(
    {
      success: false,
      tenant: null,
      error: result.error || "Locataire introuvable",
    },
    { status: 404 }
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<SaveTenantResponseDTO>> {
  try {
    const resolvedParams = await params;
    const body: Partial<SaveTenantInputDTO> = await request.json();
    const result = await updateAdminTenant(resolvedParams.id, body);

    if (result.success && result.tenant) {
      return NextResponse.json({ success: true, tenant: result.tenant });
    }
    return NextResponse.json(
      {
        success: false,
        tenant: null,
        error: result.error || "Erreur de mise à jour",
      },
      { status: 500 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, tenant: null, error: "Requête invalide" },
      { status: 400 }
    );
  }
}
