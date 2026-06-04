import { NextRequest, NextResponse } from "next/server";
import { getAllBalances, getEmployeeBalances } from "@/lib/mock-hcm-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get("employeeId");

  try {
    if (employeeId) {
      const result = await getEmployeeBalances(employeeId);
      return NextResponse.json({ success: true, data: result });
    }
    const result = await getAllBalances();
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: { code: "UNKNOWN", message } },
      { status: 503 }
    );
  }
}
