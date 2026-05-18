import { NextResponse, type NextRequest } from "next/server";
import {
  getAdminOwners,
  createAdminOwner,
  type SaveOwnerInputDTO,
} from "@/lib/dal/owners";
import type {
  GetOwnersResponseDTO,
  SaveOwnerResponseDTO,
} from "@/lib/types/property";

export async function GET(): Promise<NextResponse<GetOwnersResponseDTO>> {
  const result = await getAdminOwners();
  if (result.success && result.owners) {
    return NextResponse.json({
      success: true,
      owners: result.owners,
      totalCount: result.totalCount,
    });
  }
  return NextResponse.json(
    {
      success: false,
      owners: [],
      totalCount: 0,
      error: result.error || "Erreur de récupération des propriétaires",
    },
    { status: 500 },
  );
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<SaveOwnerResponseDTO>> {
  try {
    const body: SaveOwnerInputDTO = await request.json();
    const result = await createAdminOwner(body);

    if (result.success && result.owner) {
      return NextResponse.json({ success: true, owner: result.owner });
    }
    return NextResponse.json(
      {
        success: false,
        owner: null,
        error: result.error || "Erreur lors de la création du propriétaire",
      },
      { status: 500 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, owner: null, error: "Requête invalide" },
      { status: 400 },
    );
  }
}
