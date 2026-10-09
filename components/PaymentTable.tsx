"use client";

import React, { useState } from "react";
import { Search, Download, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { PaymentRecordItem } from "@/lib/services/types";
import { formatUSDC } from "@/lib/utils/format-usdc";
import { PaymentDetailsDrawer } from "./PaymentDetailsDrawer";

interface PaymentTableProps {
  payments: PaymentRecordItem[];
  title?: string;
  showExport?: boolean;
}

export function PaymentTable({
  payments,
  title = "RECORDED TRANSACTIONS",
  showExport = true,
}: PaymentTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecordItem | null>(null);
  const pageSize = 8;

  const filtered = payments.filter(
    (p) =>
      p.payerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.invoiceRef && p.invoiceRef.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.payer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportCSV = () => {
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

    const rows = filtered.map((p) => {
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
    link.setAttribute("download", `TaxVault-Audit-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="bg-white text-[#050505] rounded-[6px] border-2 border-[#050505] neo-shadow overflow-hidden">
        {/* Table Toolbar */}
        <div className="bg-[#050505] text-white px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#050505]">
          <div>
            <h3 className="font-display font-black text-sm uppercase tracking-wider text-white">
              {title}
            </h3>
            <span className="text-[10px] text-[#A1A1AA] font-mono tracking-wider">
              ATOMIC THREE-VAULT LEDGER
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#050505] absolute left-3 top-2" />
              <input
                type="text"
                placeholder="Search payer, ref..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 pr-3 py-1 rounded bg-white border border-[#050505] text-xs font-mono text-black placeholder-[#696574] focus:outline-none w-48 sm:w-56"
              />
            </div>

            {showExport && (
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#E8FF00] text-black font-display font-black text-xs uppercase neo-btn tracking-wider"
                title="Download CSV"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">CSV EXPORT</span>
              </button>
            )}
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2F0F7] text-[#050505] uppercase font-display font-black border-b-2 border-[#050505] text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">DATE & CLIENT</th>
                <th className="py-3 px-4 font-mono">GROSS</th>
                <th className="py-3 px-4 font-mono text-[#050505]">SPEND (70%)</th>
                <th className="py-3 px-4 font-mono text-[#050505]">TAX (25%)</th>
                <th className="py-3 px-4 font-mono text-[#050505]">SAVINGS (5%)</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E3ED] font-mono">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#696574]">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                paginated.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F2F0F7] transition-colors">
                    <td className="py-3 px-4 font-sans">
                      <div className="font-bold text-[#050505]">{p.payerName}</div>
                      <div className="text-[11px] text-[#696574] font-mono">
                        {new Date(p.timestamp).toLocaleDateString()} · {p.invoiceRef || "Direct Payment"}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-black text-[#050505] tnum">
                      {formatUSDC(p.grossAmount)}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#050505] tnum">
                      {formatUSDC(p.spendAmount)}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#050505] tnum">
                      {formatUSDC(p.taxAmount)}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#050505] tnum">
                      {formatUSDC(p.savingsAmount)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#E8FF00] text-black border border-black neo-shadow-sm font-mono">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedPayment(p)}
                        className="p-1 rounded hover:bg-white border border-transparent hover:border-[#050505] text-[#050505] transition-all"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-3 border-t-2 border-[#050505] bg-[#F2F0F7] flex items-center justify-between text-xs font-mono font-bold text-[#050505]">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} entries
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded bg-white border border-[#050505] disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2">{currentPage} / {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 rounded bg-white border border-[#050505] disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <PaymentDetailsDrawer
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
      />
    </>
  );
}
