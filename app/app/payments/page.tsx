"use client";

import React, { useState } from "react";
import { Receipt, Download, Search, Filter, Sparkles } from "lucide-react";
import { useVault } from "@/lib/store/vault-store";
import { PaymentTable } from "@/components/PaymentTable";
import { formatUSDC } from "@/lib/utils/format-usdc";

export default function PaymentsPage() {
  const { payments, profile, setIsDemoDrawerOpen } = useVault();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = payments.filter((p) => {
    if (statusFilter === "all") return true;
    return p.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-3">
        <div>
          <h2 className="text-xl font-bold text-primary">Payment Activity & Transaction Center</h2>
          <p className="text-xs text-muted mt-0.5">
            Audit trail of all incoming client payments and automated split executions
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Status filter dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-surface-elevated border border-border text-xs text-primary focus:outline-none"
          >
            <option value="all">All Statuses ({payments.length})</option>
            <option value="simulated">Simulated ({payments.filter((p) => p.status === "simulated").length})</option>
            <option value="confirmed">Confirmed Devnet</option>
          </select>

          <button
            onClick={() => setIsDemoDrawerOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-spend text-black font-semibold text-xs flex items-center gap-1.5 hover:opacity-90"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Payment</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-surface border border-border">
          <span className="text-xs text-muted block">Total Payments</span>
          <span className="text-xl font-bold font-mono text-primary tnum">{payments.length}</span>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-border">
          <span className="text-xs text-muted block">Gross Processed</span>
          <span className="text-xl font-bold font-mono text-primary tnum">{formatUSDC(profile.totalReceived)}</span>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-border">
          <span className="text-xs text-muted block">Tax Reserved</span>
          <span className="text-xl font-bold font-mono text-tax tnum">{formatUSDC(profile.totalTaxReserved)}</span>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-border">
          <span className="text-xs text-muted block">Mode</span>
          <span className="text-xs font-semibold text-tax mt-1 inline-block uppercase tracking-wider">
            Devnet Simulated
          </span>
        </div>
      </div>

      {/* Table */}
      <PaymentTable payments={filtered} title="Recorded USDC Transactions" />
    </div>
  );
}
