import { NextRequest, NextResponse } from "next/server";
import { getSingleBalance } from "@/lib/mock-hcm-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get("employeeId");
  const locationId = searchParams.get("locationId");

  if (!employeeId || !locationId) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_DIMENSION",
          message: "employeeId and locationId are required",
        },
      },
      { status: 400 }
    );
  }

  try {
    const result = await getSingleBalance(employeeId, locationId);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    let parsed;
    try {
      parsed = JSON.parse(message);
    } catch {
      parsed = { code: "UNKNOWN", message };
    }
    return NextResponse.json(
      { success: false, error: parsed },
      { status: parsed.code === "INVALID_DIMENSION" ? 404 : 503 }
    );
  }
}
