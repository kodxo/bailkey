import { NextResponse, type NextRequest } from "next/server";
import { getLeases, createLease, type SaveLeaseInputDTO } from "@/lib/dal/leases";
import type { GetLeasesResponseDTO, SaveLeaseResponseDTO } from "@/lib/types/property";

export async function GET(): Promise<NextResponse<GetLeasesResponseDTO>> {
  const result = await getLeases();
  if (result.success && result.leases) {
    return NextResponse.json({
      success: true,
      leases: result.leases,
      totalCount: result.totalCount,
    });
  }
  return NextResponse.json(
    {
      success: false,
      leases: [],
      totalCount: 0,
      error: result.error || "Erreur de récupération des baux",
    },
    { status: 500 }
  );
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<SaveLeaseResponseDTO>> {
  try {
    const body: SaveLeaseInputDTO = await request.json();
    const result = await createLease(body);

    if (result.success && result.lease) {
      return NextResponse.json({ success: true, lease: result.lease });
    }
    return NextResponse.json(
      {
        success: false,
        lease: null,
        error: result.error || "Erreur lors de la création du contrat de bail",
      },
      { status: 500 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, lease: null, error: "Requête invalide" },
      { status: 400 }
    );
  }
}
