import { NextRequest, NextResponse } from "next/server";
import { INITIAL_DEMO_PAYMENTS } from "@/lib/demo/seed-data";

export async function GET(req: NextRequest) {
  const headers = [
    "Date",
    "Time",
    "Payer",
    "Invoice Reference",
    "Gross USDC",
    "Spend USDC",
    "Tax USDC",
    "Savings USDC",
    "Status",
    "Type",
  ];

  const rows = INITIAL_DEMO_PAYMENTS.map((p) => {
    const d = new Date(p.timestamp);
    return [
      `"${d.toISOString().split("T")[0]}"`,
      `"${d.toTimeString().split(" ")[0]}"`,
      `"${p.payerName.replace(/"/g, '""')}"`,
      `"${(p.invoiceRef || "").replace(/"/g, '""')}"`,
      (Number(p.grossAmount) / 1000000).toFixed(2),
      (Number(p.spendAmount) / 1000000).toFixed(2),
      (Number(p.taxAmount) / 1000000).toFixed(2),
      (Number(p.savingsAmount) / 1000000).toFixed(2),
      p.status,
      p.isSimulated ? "SIMULATED" : "REAL",
    ].join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="tax-vault-export-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
