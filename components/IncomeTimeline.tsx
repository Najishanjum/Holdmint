"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useVault } from "@/lib/store/vault-store";
import { formatUSDC } from "@/lib/utils/format-usdc";

export function IncomeTimeline() {
  const { payments } = useVault();
  const [rangeDays, setRangeDays] = useState<number>(30);

  // Group payments by date bucket
  const now = Date.now();
  const cutoff = now - rangeDays * 86400 * 1000;
  const recentPayments = payments.filter((p) => p.timestamp >= cutoff);

  // Bucket by day or week
  const dateMap: { [key: string]: { date: string; gross: number; spend: number; tax: number; savings: number } } = {};

  // Sort chronological
  const sorted = [...recentPayments].sort((a, b) => a.timestamp - b.timestamp);

  sorted.forEach((p) => {
    const d = new Date(p.timestamp);
    const key = `${d.getMonth() + 1}/${d.getDate()}`;
    if (!dateMap[key]) {
      dateMap[key] = { date: key, gross: 0, spend: 0, tax: 0, savings: 0 };
    }
    dateMap[key].gross += Number(p.grossAmount) / 1000000;
    dateMap[key].spend += Number(p.spendAmount) / 1000000;
    dateMap[key].tax += Number(p.taxAmount) / 1000000;
    dateMap[key].savings += Number(p.savingsAmount) / 1000000;
  });

  const chartData = Object.values(dateMap);

  return (
    <div className="bg-surface rounded-card border border-border p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
        <div>
          <h3 className="text-sm font-semibold text-primary">Income & Split Inflow History</h3>
          <span className="text-xs text-muted">Chronological allocation timeline</span>
        </div>

        {/* Date range filter */}
        <div className="flex rounded-lg bg-surface-elevated p-0.5 border border-border text-xs">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setRangeDays(days)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                rangeDays === days
                  ? "bg-spend/20 text-spend font-semibold"
                  : "text-muted hover:text-primary"
              }`}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full mt-4">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-muted">
            No payments recorded in the last {rangeDays} days.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34D399" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#34D399" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="taxGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F5B44A" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F5B44A" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C8CFF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7C8CFF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} vertical={false} />
              <XAxis dataKey="date" stroke="var(--muted-text)" fontSize={11} tickLine={false} />
              <YAxis
                stroke="var(--muted-text)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="p-3 rounded-xl bg-surface-elevated border border-border shadow-xl text-xs space-y-1">
                        <div className="font-semibold text-primary">{label}</div>
                        <div className="font-mono text-spend">Spend: ${(payload[0].value as number)?.toFixed(2)}</div>
                        <div className="font-mono text-tax">Tax: ${(payload[1].value as number)?.toFixed(2)}</div>
                        <div className="font-mono text-savings">Savings: ${(payload[2].value as number)?.toFixed(2)}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="spend" stroke="#34D399" fillOpacity={1} fill="url(#spendGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="tax" stroke="#F5B44A" fillOpacity={1} fill="url(#taxGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="savings" stroke="#7C8CFF" fillOpacity={1} fill="url(#savingsGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex items-center justify-center gap-6 pt-3 border-t border-border text-xs text-muted">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-spend" />
          <span>Spend Vault Inflow</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-tax" />
          <span>Tax Reserve Inflow</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-savings" />
          <span>Savings Inflow</span>
        </div>
      </div>
    </div>
  );
}
