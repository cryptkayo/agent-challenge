import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    agent: "CryptoDesk",
    version: "1.0.0",
    network: "Nosana",
    timestamp: new Date().toISOString(),
  });
}
