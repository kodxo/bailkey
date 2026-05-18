import { NextResponse, type NextRequest } from "next/server";
import { getOwnerById, updateOwner, type SaveOwnerInputDTO } from "@/lib/dal/owners";
import type { SaveOwnerResponseDTO } from "@/lib/types/property";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<{ success: boolean; owner: unknown | null; error?: string }>> {
  const resolvedParams = await params;
  const result = await getOwnerById(resolvedParams.id);
  if (result.success && result.owner) {
    return NextResponse.json({ success: true, owner: result.owner });
  }
  return NextResponse.json(
    {
      success: false,
      owner: null,
      error: result.error || "Propriétaire introuvable",
    },
    { status: 404 }
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<SaveOwnerResponseDTO>> {
  try {
    const resolvedParams = await params;
    const body: Partial<SaveOwnerInputDTO> = await request.json();
    const result = await updateOwner(resolvedParams.id, body);

    if (result.success && result.owner) {
      return NextResponse.json({ success: true, owner: result.owner });
    }
    return NextResponse.json(
      {
        success: false,
        owner: null,
        error: result.error || "Erreur de mise à jour",
      },
      { status: 500 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, owner: null, error: "Requête invalide" },
      { status: 400 }
    );
  }
}
