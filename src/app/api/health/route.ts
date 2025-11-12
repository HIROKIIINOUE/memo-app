import { NextResponse } from "next/server";
import { checkDatabaseConnection } from "@/lib/health";

export async function GET() {
  try {
    await checkDatabaseConnection();

    return NextResponse.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error("Healthcheck failed", error);
    return NextResponse.json(
      {
        status: "error",
        database: "unreachable",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
