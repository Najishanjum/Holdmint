import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "Tax Vault",
    network: "solana-devnet",
    version: "0.1.0",
    usdcDecimals: 6,
    timestamp: new Date().toISOString(),
    demoMode: true,
  });
}
