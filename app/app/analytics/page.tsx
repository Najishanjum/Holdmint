"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, DollarSign, Calendar, BarChart2 } from "lucide-react";
import { useVault } from "@/lib/store/vault-store";
import { formatUSDC } from "@/lib/utils/format-usdc";

export default function AnalyticsPage() {
  const { payments, profile } = useVault();
  const [filterRange, setFilterRange] = useState<number>(30);

  // Reconciled analytics calculations
  const totalAmount = profile.totalReceived;
  const count = payments.length;
  const avgPayment = count > 0 ? Number(totalAmount) / 1000000 / count : 0;

  let largestPayment = 0;
  payments.forEach((p) => {
    const val = Number(p.grossAmount) / 1000000;
    if (val > largestPayment) largestPayment = val;
  });

  // Prepare chart data
  const chartData = [...payments]
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((p) => ({
      date: new Date(p.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      gross: Number(p.grossAmount) / 1000000,
      tax: Number(p.taxAmount) / 1000000,
      spend: Number(p.spendAmount) / 1000000,
      savings: Number(p.savingsAmount) / 1000000,
      client: p.payerName,
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-3">
        <div>
          <h2 className="text-xl font-bold text-primary">Income & Reserve Analytics</h2>
          <p className="text-xs text-muted mt-0.5">
            Statistical breakdown of incoming client income and automated allocations
          </p>
        </div>

        <div className="flex rounded-lg bg-surface-elevated p-0.5 border border-border text-xs">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setFilterRange(d)}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                filterRange === d
                  ? "bg-spend/20 text-spend font-semibold"
                  : "text-muted hover:text-primary"
              }`}
            >
              Last {d} Days
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
          <span className="text-xs text-muted">Total Receipts</span>
          <div className="text-xl md:text-2xl font-bold font-mono text-primary tnum">
            {formatUSDC(totalAmount)}
          </div>
          <span className="text-[11px] text-spend font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {count} completed splits
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
          <span className="text-xs text-muted">Average Payment</span>
          <div className="text-xl md:text-2xl font-bold font-mono text-primary tnum">
            ${avgPayment.toFixed(2)}
          </div>
          <span className="text-[11px] text-muted">Across all clients</span>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
          <span className="text-xs text-muted">Largest Single Payment</span>
          <div className="text-xl md:text-2xl font-bold font-mono text-spend tnum">
            ${largestPayment.toFixed(2)}
          </div>
          <span className="text-[11px] text-muted">Hyperion Tech</span>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
          <span className="text-xs text-muted">Total Tax Protected</span>
          <div className="text-xl md:text-2xl font-bold font-mono text-tax tnum">
            {formatUSDC(profile.totalTaxReserved)}
          </div>
          <span className="text-[11px] text-tax font-medium">Safe in Tax Vault</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gross Income by Payment */}
        <div className="p-5 rounded-card bg-surface border border-border space-y-3">
          <h3 className="text-sm font-semibold text-primary">Payment Distribution (USDC)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} vertical={false} />
                <XAxis dataKey="date" stroke="var(--muted-text)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--muted-text)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded-lg bg-surface-elevated border border-border shadow-lg text-xs">
                          <div className="font-semibold text-primary">{d.client}</div>
                          <div className="text-muted">{d.date}</div>
                          <div className="font-mono text-spend mt-1">Gross: ${d.gross.toFixed(2)}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="gross" fill="#34D399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tax Reserve Growth Cumulative */}
        <div className="p-5 rounded-card bg-surface border border-border space-y-3">
          <h3 className="text-sm font-semibold text-primary">Tax Reserve Accumulation (USDC)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} vertical={false} />
                <XAxis dataKey="date" stroke="var(--muted-text)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--muted-text)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded-lg bg-surface-elevated border border-border shadow-lg text-xs">
                          <div className="font-semibold text-primary">{d.client}</div>
                          <div className="font-mono text-tax">Tax Reserved: ${d.tax.toFixed(2)}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line type="monotone" dataKey="tax" stroke="#F5B44A" strokeWidth={2.5} dot={{ fill: "#F5B44A", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
