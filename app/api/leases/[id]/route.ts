import { NextResponse, type NextRequest } from "next/server";
import { getLeaseById, updateLease, type SaveLeaseInputDTO } from "@/lib/dal/leases";
import type { SaveLeaseResponseDTO } from "@/lib/types/property";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<{ success: boolean; lease: unknown | null; error?: string }>> {
  const resolvedParams = await params;
  const result = await getLeaseById(resolvedParams.id);
  if (result.success && result.lease) {
    return NextResponse.json({ success: true, lease: result.lease });
  }
  return NextResponse.json(
    {
      success: false,
      lease: null,
      error: result.error || "Bail introuvable",
    },
    { status: 404 }
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<SaveLeaseResponseDTO>> {
  try {
    const resolvedParams = await params;
    const body: Partial<SaveLeaseInputDTO> = await request.json();
    const result = await updateLease(resolvedParams.id, body);

    if (result.success && result.lease) {
      return NextResponse.json({ success: true, lease: result.lease });
    }
    return NextResponse.json(
      {
        success: false,
        lease: null,
        error: result.error || "Erreur de mise à jour",
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
