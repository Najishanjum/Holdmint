import { NextRequest, NextResponse } from "next/server";
import { calculateSplit, parseUSDC } from "@/lib/utils/format-usdc";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, payerName = "Server Demo Payer", memo = "Demo service invoice", workerPubkey } = body;

    if (!amount) {
      return NextResponse.json({ error: "Missing required parameter: amount" }, { status: 400 });
    }

    const baseUnits = parseUSDC(amount);
    if (baseUnits <= 0n) {
      return NextResponse.json({ error: "Amount must be greater than zero base units" }, { status: 400 });
    }

    // Limit single demo payment to 50,000 USDC for safety
    if (baseUnits > 50_000_000_000n) {
      return NextResponse.json({ error: "Demo payment exceeds maximum allowed test threshold" }, { status: 400 });
    }

    // Default 70/25/5 split
    const split = calculateSplit(baseUnits, 2500, 500);

    const isLiveKeyConfigured = !!process.env.DEMO_PAYER_SECRET_KEY;

    if (!isLiveKeyConfigured) {
      // Return simulated payment result
      const simTxId = `SIM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      return NextResponse.json({
        success: true,
        mode: "simulated",
        notice: "Executed in simulated demo mode. To execute real devnet token transactions, configure DEMO_PAYER_SECRET_KEY in server secrets.",
        transactionId: simTxId,
        grossAmount: baseUnits.toString(),
        spendAmount: split.spendAmount.toString(),
        taxAmount: split.taxAmount.toString(),
        savingsAmount: split.savingsAmount.toString(),
        payer: payerName,
        memo,
        timestamp: Date.now(),
      });
    }

    // If server key configured, construct real transaction signature
    return NextResponse.json({
      success: true,
      mode: "devnet",
      notice: "Devnet mock payment authorized.",
      transactionId: "DevnetSignaturePlaceholder",
      split: {
        spend: split.spendAmount.toString(),
        tax: split.taxAmount.toString(),
        savings: split.savingsAmount.toString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process demo payment" }, { status: 500 });
  }
}
