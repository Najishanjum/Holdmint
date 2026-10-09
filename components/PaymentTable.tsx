"use client";

import React, { useState } from "react";
import { Search, Download, ChevronLeft, ChevronRight, Eye, ArrowUpDown } from "lucide-react";
import { PaymentRecordItem } from "@/lib/services/types";
import { formatUSDC, truncateAddress } from "@/lib/utils/format-usdc";
import { PaymentDetailsDrawer } from "./PaymentDetailsDrawer";

interface PaymentTableProps {
  payments: PaymentRecordItem[];
  title?: string;
  showExport?: boolean;
}

export function PaymentTable({
  payments,
  title = "Recent Incoming Payments",
  showExport = true,
}: PaymentTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecordItem | null>(null);
  const pageSize = 8;

  // Filter
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
    link.setAttribute("download", `tax-vault-payments-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="bg-surface rounded-card border border-border overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-primary">{title}</h3>
            <span className="text-xs text-muted">Atomic three-vault distributions</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search payer, invoice..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-xs text-primary placeholder-muted focus:outline-none focus:border-spend w-48 sm:w-60"
              />
            </div>

            {showExport && (
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-border border border-border text-xs font-medium text-muted hover:text-primary transition-colors"
                title="Download CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">CSV</span>
              </button>
            )}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-elevated/60 text-muted uppercase font-medium border-b border-border text-[11px]">
              <tr>
                <th className="py-3 px-4">Date & Client</th>
                <th className="py-3 px-4 font-mono">Gross</th>
                <th className="py-3 px-4 font-mono text-spend">Spend (70%)</th>
                <th className="py-3 px-4 font-mono text-tax">Tax (25%)</th>
                <th className="py-3 px-4 font-mono text-savings">Savings (5%)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted">
                    No transactions found matching your search.
                  </td>
                </tr>
              ) : (
                paginated.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-elevated/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-primary">{p.payerName}</div>
                      <div className="text-[11px] text-muted font-mono">
                        {new Date(p.timestamp).toLocaleDateString()} · {p.invoiceRef || "Direct Payment"}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-primary tnum">
                      {formatUSDC(p.grossAmount)}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-spend tnum">
                      {formatUSDC(p.spendAmount)}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-tax tnum">
                      {formatUSDC(p.taxAmount)}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-savings tnum">
                      {formatUSDC(p.savingsAmount)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-tax/15 text-tax border border-tax/30 uppercase">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedPayment(p)}
                        className="p-1 rounded hover:bg-surface-elevated text-muted hover:text-primary transition-colors"
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
          <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} entries
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded bg-surface-elevated border border-border disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-mono text-primary">{currentPage} / {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 rounded bg-surface-elevated border border-border disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Drawer */}
      <PaymentDetailsDrawer
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
      />
    </>
  );
}
