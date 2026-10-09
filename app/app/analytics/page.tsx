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
import { TrendingUp, DollarSign, Calendar, BarChart2, Activity, Zap } from "lucide-react";
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
      {/* Neo-Brutalist Header */}
      <div className="bg-[#050505] neo-border neo-shadow p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-[#E8FF00] inline-block animate-pulse"></span>
            <span className="font-mono text-xs uppercase tracking-widest text-[#E8FF00]">
              METRICS & TREASURY INTELLIGENCE
            </span>
          </div>
          <h2 className="font-display text-3xl font-black uppercase tracking-tight text-white">
            Income & Reserve Analytics
          </h2>
          <p className="text-xs text-white/60 font-mono mt-0.5">
            Statistical breakdown of incoming client income and automated PDA splits
          </p>
        </div>

        {/* Range Filter */}
        <div className="flex bg-[#121216] neo-border p-1 gap-1 self-start sm:self-auto">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setFilterRange(d)}
              className={`px-3 py-1.5 font-mono text-xs font-black uppercase transition-all ${
                filterRange === d
                  ? "bg-[#E8FF00] text-black"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Last {d}D
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white neo-border neo-shadow p-5 space-y-2 border-t-4 border-t-[#21D99B]">
          <span className="font-mono text-xs uppercase text-black/60 font-bold block">
            Total Gross Receipts
          </span>
          <div className="text-2xl md:text-3xl font-mono font-black text-black tnum">
            {formatUSDC(totalAmount)}
          </div>
          <span className="font-mono text-[11px] text-[#050505] font-black flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#21D99B]"></span>
            {count} completed splits
          </span>
        </div>

        <div className="bg-white neo-border neo-shadow p-5 space-y-2 border-t-4 border-t-[#5919F6]">
          <span className="font-mono text-xs uppercase text-black/60 font-bold block">
            Average Inflow / Tx
          </span>
          <div className="text-2xl md:text-3xl font-mono font-black text-black tnum">
            ${avgPayment.toFixed(2)}
          </div>
          <span className="font-mono text-[11px] text-black/60 font-bold">
            Across active clients
          </span>
        </div>

        <div className="bg-white neo-border neo-shadow p-5 space-y-2 border-t-4 border-t-[#E8FF00]">
          <span className="font-mono text-xs uppercase text-black/60 font-bold block">
            Largest Single Inflow
          </span>
          <div className="text-2xl md:text-3xl font-mono font-black text-[#5919F6] tnum">
            ${largestPayment.toFixed(2)}
          </div>
          <span className="font-mono text-[11px] text-black/60 font-bold">
            Hyperion Tech DAO
          </span>
        </div>

        <div className="bg-white neo-border neo-shadow p-5 space-y-2 border-t-4 border-t-[#FFBD45]">
          <span className="font-mono text-xs uppercase text-black/60 font-bold block">
            Total Tax Shielded
          </span>
          <div className="text-2xl md:text-3xl font-mono font-black text-[#FFBD45] tnum">
            {formatUSDC(profile.totalTaxReserved)}
          </div>
          <span className="font-mono text-[11px] text-black font-black flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#FFBD45]"></span>
            Locked in Tax PDA
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gross Income by Payment */}
        <div className="bg-white neo-border neo-shadow overflow-hidden">
          <div className="bg-[#050505] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-black font-mono text-xs font-bold uppercase">
            <span>PAYMENT DISTRIBUTION (USDC)</span>
            <span className="text-[#21D99B] font-mono">SPLIT ENFORCED</span>
          </div>

          <div className="p-5">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                  <XAxis dataKey="date" stroke="#050505" fontSize={11} fontFamily="monospace" tickLine={false} />
                  <YAxis stroke="#050505" fontSize={11} fontFamily="monospace" tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="p-3 bg-[#050505] text-white neo-border border-[#E8FF00] font-mono text-xs space-y-1">
                            <div className="font-bold text-[#E8FF00]">{d.client}</div>
                            <div className="text-white/70">{d.date}</div>
                            <div className="font-black text-[#21D99B]">Gross: ${d.gross.toFixed(2)}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="gross" fill="#21D99B" stroke="#050505" strokeWidth={1.5} radius={[0, 0, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tax Reserve Growth Cumulative */}
        <div className="bg-white neo-border neo-shadow overflow-hidden">
          <div className="bg-[#050505] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-black font-mono text-xs font-bold uppercase">
            <span>TAX RESERVE ACCUMULATION (USDC)</span>
            <span className="text-[#FFBD45] font-mono">NON-CUSTODIAL</span>
          </div>

          <div className="p-5">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                  <XAxis dataKey="date" stroke="#050505" fontSize={11} fontFamily="monospace" tickLine={false} />
                  <YAxis stroke="#050505" fontSize={11} fontFamily="monospace" tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="p-3 bg-[#050505] text-white neo-border border-[#FFBD45] font-mono text-xs space-y-1">
                            <div className="font-bold text-white">{d.client}</div>
                            <div className="font-black text-[#FFBD45]">Tax Reserved: ${d.tax.toFixed(2)}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line type="stepAfter" dataKey="tax" stroke="#5919F6" strokeWidth={3} dot={{ fill: "#FFBD45", stroke: "#050505", strokeWidth: 2, r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
