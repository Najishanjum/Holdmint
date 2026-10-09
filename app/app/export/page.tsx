"use client";

import React, { useState } from "react";
import { FileDown, Printer, Calendar, Download, ShieldAlert, Check } from "lucide-react";
import { useVault } from "@/lib/store/vault-store";
import { formatUSDC } from "@/lib/utils/format-usdc";

export default function ExportPage() {
  const { payments, profile } = useVault();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const totalGross = profile.totalReceived;
  const totalTax = profile.totalTaxReserved;

  const handleDownloadCSV = () => {
    const headers = [
      "Date",
      "Time",
      "Payer",
      "Invoice Reference",
      "Gross USDC",
      "Spend Allocation",
      "Tax Allocation",
      "Savings Allocation",
      "Status",
      "Type",
    ];

    const rows = payments.map((p) => {
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

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TaxVault-Report-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-3">
        <div>
          <h2 className="text-xl font-bold text-primary">Financial Exports & Accountant Reports</h2>
          <p className="text-xs text-muted mt-0.5">
            Structured records of all client payments and atomic vault splits
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-surface-elevated hover:bg-border border border-border text-xs font-semibold text-primary flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 rounded-xl bg-spend hover:bg-spend/90 text-black font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {downloadSuccess ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            <span>{downloadSuccess ? "Downloaded!" : "Download CSV"}</span>
          </button>
        </div>
      </div>

      {/* Printable Accountant Summary Sheet */}
      <div className="bg-surface rounded-card border border-border p-6 md:p-8 space-y-6 print:border-none print:shadow-none">
        <div className="flex justify-between items-start pb-4 border-b border-border">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-tax block mb-1">
              Accountant Summary Document
            </span>
            <h3 className="text-lg font-bold text-primary">Tax Vault Annual Receipts & Split Ledger</h3>
            <p className="text-xs text-muted font-mono mt-0.5">
              Worker: {profile.displayName} · Owner: {profile.owner}
            </p>
          </div>
          <span className="text-xs text-muted font-mono">
            Generated: {new Date().toLocaleDateString()}
          </span>
        </div>

        {/* Ledger KPI Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-surface-elevated border border-border">
            <span className="text-muted block text-[11px]">Total Receipts</span>
            <span className="font-mono font-bold text-primary text-base tnum">
              {formatUSDC(totalGross)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-elevated border border-border">
            <span className="text-muted block text-[11px]">Spend Allocation</span>
            <span className="font-mono font-bold text-spend text-base tnum">
              {formatUSDC((totalGross * 70n) / 100n)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-elevated border border-border">
            <span className="text-muted block text-[11px]">Tax Reserve Allocation</span>
            <span className="font-mono font-bold text-tax text-base tnum">
              {formatUSDC(totalTax)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-elevated border border-border">
            <span className="text-muted block text-[11px]">Savings Allocation</span>
            <span className="font-mono font-bold text-savings text-base tnum">
              {formatUSDC((totalGross * 5n) / 100n)}
            </span>
          </div>
        </div>

        {/* Audit Table Preview */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-primary block">
            Payment Audit Trail ({payments.length} Transactions)
          </span>
          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-elevated text-muted text-[11px] uppercase border-b border-border">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Client</th>
                  <th className="py-2.5 px-3 font-mono">Gross</th>
                  <th className="py-2.5 px-3 font-mono text-tax">Tax (25%)</th>
                  <th className="py-2.5 px-3 font-mono text-spend">Spend (70%)</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2 px-3 font-mono text-muted">
                      {new Date(p.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3 font-medium text-primary">{p.payerName}</td>
                    <td className="py-2 px-3 font-mono font-semibold text-primary tnum">
                      {formatUSDC(p.grossAmount)}
                    </td>
                    <td className="py-2 px-3 font-mono text-tax tnum">{formatUSDC(p.taxAmount)}</td>
                    <td className="py-2 px-3 font-mono text-spend tnum">{formatUSDC(p.spendAmount)}</td>
                    <td className="py-2 px-3">
                      <span className="text-[10px] text-muted font-mono uppercase">{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mandatory Accountant Disclaimer */}
        <div className="p-4 rounded-xl bg-surface-elevated border border-border flex items-start gap-3 text-xs text-muted">
          <ShieldAlert className="w-4 h-4 text-tax shrink-0 mt-0.5" />
          <div className="leading-relaxed text-[11px]">
            <strong>Legal Notice & Tax Disclaimer:</strong> This document and associated CSV exports are records of non-custodial automated smart-contract transfers. This report is NOT an official tax return, IRS 1099-NEC, Schedule C filing, or statutory tax statement. Tax Vault does not calculate or remit taxes to any government. Consult a qualified professional accountant for tax preparation.
          </div>
        </div>
      </div>
    </div>
  );
}
