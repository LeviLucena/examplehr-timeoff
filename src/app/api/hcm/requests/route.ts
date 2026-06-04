import { NextRequest, NextResponse } from "next/server";
import {
  submitTimeOffRequest,
  getPendingRequests,
  approveDenyRequest,
} from "@/lib/mock-hcm-data";

export async function GET() {
  try {
    const result = await getPendingRequests();
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: { code: "UNKNOWN", message } },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employeeId, locationId, daysRequested } = body;

    if (!employeeId || !locationId || !daysRequested) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_DIMENSION",
            message: "employeeId, locationId, and daysRequested are required",
          },
        },
        { status: 400 }
      );
    }

    const result = await submitTimeOffRequest({
      employeeId,
      locationId,
      daysRequested,
    });
    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    let parsed;
    try {
      parsed = JSON.parse(message);
    } catch {
      parsed = { code: "UNKNOWN", message };
    }
    const status =
      parsed.code === "INSUFFICIENT_BALANCE" || parsed.code === "INVALID_DIMENSION"
        ? 409
        : 503;
    return NextResponse.json({ success: false, error: parsed }, { status });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId, action, reviewerId } = body;

    if (!requestId || !action || !reviewerId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_DIMENSION",
            message: "requestId, action, and reviewerId are required",
          },
        },
        { status: 400 }
      );
    }

    if (action !== "approved" && action !== "denied") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_DIMENSION",
            message: "action must be 'approved' or 'denied'",
          },
        },
        { status: 400 }
      );
    }

    const result = await approveDenyRequest(requestId, action, reviewerId);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    let parsed;
    try {
      parsed = JSON.parse(message);
    } catch {
      parsed = { code: "UNKNOWN", message };
    }
    const status =
      parsed.code === "CONFLICT" ? 409 : parsed.code === "INVALID_DIMENSION" ? 404 : 503;
    return NextResponse.json({ success: false, error: parsed }, { status });
  }
}
