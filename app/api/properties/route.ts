import { NextResponse, type NextRequest } from "next/server";
import { getProperties, createProperty, type SavePropertyInputDTO } from "@/lib/dal/properties";
import type { GetPropertiesResponseDTO, SavePropertyResponseDTO } from "@/lib/types/property";

export async function GET(): Promise<NextResponse<GetPropertiesResponseDTO>> {
  const result = await getProperties();
  if (result.success && result.properties) {
    return NextResponse.json({
      success: true,
      properties: result.properties,
      totalCount: result.totalCount,
    });
  }
  return NextResponse.json(
    {
      success: false,
      properties: [],
      totalCount: 0,
      error: result.error || "Erreur de récupération des propriétés",
    },
    { status: 500 }
  );
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<SavePropertyResponseDTO>> {
  try {
    const body: SavePropertyInputDTO = await request.json();
    const result = await createProperty(body);

    if (result.success && result.property) {
      return NextResponse.json({ success: true, property: result.property });
    }
    return NextResponse.json(
      {
        success: false,
        property: null,
        error: result.error || "Erreur lors de la création de la propriété",
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
