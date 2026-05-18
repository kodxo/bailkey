import { NextResponse, NextRequest } from "next/server";
import { completeOnboardingDal } from "@/lib/dal/onboarding";
import type { OnboardingRequestDTO, OnboardingResponseDTO } from "@/lib/types/dto";

export async function POST(
  req: NextRequest
): Promise<NextResponse<OnboardingResponseDTO>> {
  try {
    const body: unknown = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Format de requête invalide." },
        { status: 400 }
      );
    }

    const payload = body as OnboardingRequestDTO;

    if (!payload.role || !payload.operationType) {
      return NextResponse.json(
        { success: false, error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    const result = await completeOnboardingDal(payload);

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    }

    return NextResponse.json(result, { status: 500 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Erreur HTTP interne";
    return NextResponse.json(
      { success: false, error: `Erreur API interne: ${errorMessage}` },
      { status: 500 }
    );
  }
}
