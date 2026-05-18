import { NextResponse, type NextRequest } from "next/server";
import { getAdminPropertyById, updateAdminProperty, type SavePropertyInputDTO } from "@/lib/dal/properties";
import type { GetPropertyByIdResponseDTO, SavePropertyResponseDTO } from "@/lib/types/property";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<GetPropertyByIdResponseDTO>> {
  const resolvedParams = await params;
  const result = await getAdminPropertyById(resolvedParams.id);
  if (result.success && result.property) {
    return NextResponse.json({ success: true, property: result.property });
  }
  return NextResponse.json(
    {
      success: false,
      property: null,
      error: result.error || "Propriété introuvable",
    },
    { status: 404 }
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<SavePropertyResponseDTO>> {
  try {
    const resolvedParams = await params;
    const body: Partial<SavePropertyInputDTO> = await request.json();
    const result = await updateAdminProperty(resolvedParams.id, body);

    if (result.success && result.property) {
      return NextResponse.json({ success: true, property: result.property });
    }
    return NextResponse.json(
      {
        success: false,
        property: null,
        error: result.error || "Erreur de mise à jour",
      },
      { status: 500 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, property: null, error: "Requête invalide" },
      { status: 400 }
    );
  }
}
