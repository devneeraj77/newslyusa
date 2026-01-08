import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const start = Date.now();
  try {
    // 1. Check if the client can establish a connection
    await db.$connect();

    // 2. Run a native MongoDB 'ping' command
    // This confirms the database engine is actually responding
    const ping = await db.$runCommandRaw({
      ping: 1,
    });

    const duration = Date.now() - start;

    return NextResponse.json({
      status: "connected",
      database: "mongodb",
      latency: `${duration}ms`,
      pingResponse: ping, // Usually returns { ok: 1 }
    });
  } catch (error: any) {
    console.error("Database connection failed:", error);
    return NextResponse.json({
      status: "disconnected",
      error: error.message,
      code: error.code,
    }, { status: 500 });
  }
}