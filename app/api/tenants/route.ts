import { NextResponse, type NextRequest } from "next/server";
import {
  getTenants,
  createTenant,
  type SaveTenantInputDTO,
} from "@/lib/dal/tenants";
import type {
  GetTenantsResponseDTO,
  SaveTenantResponseDTO,
} from "@/lib/types/property";

export async function GET(): Promise<NextResponse<GetTenantsResponseDTO>> {
  const result = await getTenants();
  if (result.success && result.tenants) {
    return NextResponse.json({
      success: true,
      tenants: result.tenants,
      totalCount: result.totalCount,
    });
  }
  return NextResponse.json(
    {
      success: false,
      tenants: [],
      totalCount: 0,
      error: result.error || "Erreur de récupération des locataires",
    },
    { status: 500 },
  );
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<SaveTenantResponseDTO>> {
  try {
    const body: SaveTenantInputDTO = await request.json();
    const result = await createTenant(body);

    if (result.success && result.tenant) {
      return NextResponse.json({ success: true, tenant: result.tenant });
    }
    return NextResponse.json(
      {
        success: false,
        tenant: null,
        error: result.error || "Erreur lors de la création du locataire",
      },
      { status: 500 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, tenant: null, error: "Requête invalide" },
      { status: 400 },
    );
  }
}
