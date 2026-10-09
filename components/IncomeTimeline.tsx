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

  const now = Date.now();
  const cutoff = now - rangeDays * 86400 * 1000;
  const recentPayments = payments.filter((p) => p.timestamp >= cutoff);

  const dateMap: { [key: string]: { date: string; gross: number; spend: number; tax: number; savings: number } } = {};
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
    <div className="bg-white text-[#050505] rounded-[6px] border-2 border-[#050505] neo-shadow overflow-hidden">
      {/* Title Bar */}
      <div className="bg-[#050505] text-white px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#050505] gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#5919F6] border border-white inline-block" />
          <h3 className="font-display font-black text-xs uppercase tracking-wider text-white">
            INCOME & SPLIT INFLOW TIMELINE
          </h3>
        </div>

        {/* Range switcher */}
        <div className="flex rounded bg-[#1C1917] p-0.5 border border-[#333] text-[10px] font-mono">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setRangeDays(days)}
              className={`px-2.5 py-0.5 rounded font-bold transition-all ${
                rangeDays === days
                  ? "bg-[#E8FF00] text-black"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {days}D
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        <div className="h-64 w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-[#696574] font-mono">
              No payments recorded in the last {rangeDays} days.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#21D99B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#21D99B" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="taxGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFBD45" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FFBD45" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8790FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8790FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke="#E5E3ED" vertical={false} />
                <XAxis dataKey="date" stroke="#696574" fontSize={10} tickLine={false} fontFamily="monospace" />
                <YAxis
                  stroke="#696574"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  fontFamily="monospace"
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-3 rounded bg-[#050505] text-white border-2 border-[#050505] neo-shadow-sm text-xs font-mono space-y-1">
                          <div className="font-bold text-[#E8FF00]">{label}</div>
                          <div>Spend: ${(payload[0].value as number)?.toFixed(2)}</div>
                          <div>Tax: ${(payload[1].value as number)?.toFixed(2)}</div>
                          <div>Savings: ${(payload[2].value as number)?.toFixed(2)}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="spend" stroke="#21D99B" fillOpacity={1} fill="url(#spendGrad)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="tax" stroke="#FFBD45" fillOpacity={1} fill="url(#taxGrad)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="savings" stroke="#8790FF" fillOpacity={1} fill="url(#savingsGrad)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t-2 border-[#050505] text-xs font-display font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#21D99B] border border-black" />
            <span className="tracking-wider uppercase">SPEND INFLOW (70%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FFBD45] border border-black" />
            <span className="tracking-wider uppercase">TAX RESERVE (25%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#8790FF] border border-black" />
            <span className="tracking-wider uppercase">SAVINGS (5%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
