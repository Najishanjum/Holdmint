"use client";

import React, { useState } from "react";
import { FileDown, Printer, Calendar, Download, ShieldAlert, Check, FileText } from "lucide-react";
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
      {/* Neo-Brutalist Header */}
      <div className="bg-[#050505] neo-border neo-shadow p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-[#E8FF00] inline-block animate-pulse"></span>
            <span className="font-mono text-xs uppercase tracking-widest text-[#E8FF00]">
              ACCOUNTING RECONCILIATION // EXPORT LEDGER
            </span>
          </div>
          <h2 className="font-display text-3xl font-black uppercase tracking-tight text-white">
            Financial Exports & Reports
          </h2>
          <p className="text-xs text-white/60 font-mono mt-0.5">
            Structured records of all client payments and atomic on-chain vault splits
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="neo-btn px-4 py-2.5 bg-white hover:bg-neutral-200 neo-border font-mono text-xs font-bold text-black flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT REPORT</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="neo-btn px-4 py-2.5 bg-[#E8FF00] hover:bg-[#d8ed00] neo-border neo-shadow font-mono text-xs font-black text-black flex items-center gap-2 transition-colors"
          >
            {downloadSuccess ? <Check className="w-4 h-4 text-black font-black" /> : <Download className="w-4 h-4" />}
            <span>{downloadSuccess ? "DOWNLOADED!" : "DOWNLOAD CSV"}</span>
          </button>
        </div>
      </div>

      {/* Printable Accountant Summary Sheet */}
      <div className="bg-white neo-border neo-shadow print:border-none print:shadow-none">
        {/* Terminal Header */}
        <div className="bg-[#050505] text-white px-5 py-3 flex items-center justify-between border-b-2 border-black font-mono text-xs font-bold uppercase">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#E8FF00]" />
            <span>AUDIT DOCUMENT // ANNUAL RECEIPTS & SPLIT LEDGER</span>
          </div>
          <span className="text-[#E8FF00]">GENERATED: {new Date().toLocaleDateString()}</span>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-start pb-4 border-b-2 border-black">
            <div>
              <span className="font-mono text-xs font-black uppercase tracking-wider text-[#5919F6] block mb-1">
                SOLANA DEVNET ATTESTATION RECORD
              </span>
              <h3 className="font-display text-2xl font-black uppercase tracking-tight text-black">
                Tax Vault Reconciled Income Ledger
              </h3>
              <p className="text-xs text-black/70 font-mono mt-1">
                Worker: <strong>{profile.displayName}</strong> · Owner: {profile.owner}
              </p>
            </div>
            <span className="bg-[#050505] text-[#E8FF00] px-3 py-1 font-mono text-xs font-black">
              STATUS: VERIFIED
            </span>
          </div>

          {/* Ledger KPI Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 bg-[#F2F0F7] neo-border space-y-1">
              <span className="text-black/60 font-bold block text-[11px] uppercase">Total Receipts</span>
              <span className="font-black text-black text-lg tnum block">
                {formatUSDC(totalGross)}
              </span>
            </div>

            <div className="p-4 bg-[#F2F0F7] neo-border space-y-1">
              <span className="text-black/60 font-bold block text-[11px] uppercase">Spend (70%)</span>
              <span className="font-black text-[#050505] text-lg tnum block">
                {formatUSDC((totalGross * 70n) / 100n)}
              </span>
            </div>

            <div className="p-4 bg-[#F2F0F7] neo-border space-y-1">
              <span className="text-black/60 font-bold block text-[11px] uppercase">Tax Reserve (25%)</span>
              <span className="font-black text-[#FFBD45] text-lg tnum block">
                {formatUSDC(totalTax)}
              </span>
            </div>

            <div className="p-4 bg-[#F2F0F7] neo-border space-y-1">
              <span className="text-black/60 font-bold block text-[11px] uppercase">Savings (5%)</span>
              <span className="font-black text-[#5919F6] text-lg tnum block">
                {formatUSDC((totalGross * 5n) / 100n)}
              </span>
            </div>
          </div>

          {/* Audit Table Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs font-bold text-black uppercase">
              <span>Payment Audit Trail ({payments.length} Transactions)</span>
              <span>USDC Token Unit</span>
            </div>

            <div className="neo-border overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#050505] text-white uppercase text-[11px] border-b-2 border-black">
                  <tr>
                    <th className="py-2.5 px-3 border-r border-white/20">Date</th>
                    <th className="py-2.5 px-3 border-r border-white/20">Client</th>
                    <th className="py-2.5 px-3 border-r border-white/20">Gross</th>
                    <th className="py-2.5 px-3 border-r border-white/20 text-[#FFBD45]">Tax (25%)</th>
                    <th className="py-2.5 px-3 border-r border-white/20 text-[#21D99B]">Spend (70%)</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black bg-white">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-[#E8FF00]/15">
                      <td className="py-2.5 px-3 text-black/80 border-r-2 border-black">
                        {new Date(p.timestamp).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-black border-r-2 border-black">
                        {p.payerName}
                      </td>
                      <td className="py-2.5 px-3 font-black text-black border-r-2 border-black tnum">
                        {formatUSDC(p.grossAmount)}
                      </td>
                      <td className="py-2.5 px-3 font-black text-[#FFBD45] border-r-2 border-black tnum">
                        {formatUSDC(p.taxAmount)}
                      </td>
                      <td className="py-2.5 px-3 font-black text-[#050505] border-r-2 border-black tnum">
                        {formatUSDC(p.spendAmount)}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-[10px] uppercase">
                        {p.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mandatory Accountant Disclaimer */}
          <div className="p-4 bg-[#F2F0F7] neo-border flex items-start gap-3 text-xs font-mono text-black/80">
            <ShieldAlert className="w-5 h-5 text-[#FFBD45] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-black uppercase">Legal Notice & Tax Disclaimer:</strong> This document and associated CSV exports are records of non-custodial automated smart-contract transfers. This report is NOT an official tax return, IRS 1099-NEC, Schedule C filing, or statutory tax statement. Tax Vault does not calculate or remit taxes to any government. Consult a qualified professional accountant for tax preparation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
