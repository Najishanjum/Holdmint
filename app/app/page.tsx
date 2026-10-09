"use client";

import React from "react";
import {
  DollarSign,
  TrendingUp,
  Receipt,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import { useVault } from "@/lib/store/vault-store";
import { formatUSDC } from "@/lib/utils/format-usdc";
import { VaultCard } from "@/components/VaultCard";
import { SplitDonut } from "@/components/SplitDonut";
import { ReadinessRing } from "@/components/ReadinessRing";
import { DeadlineCard } from "@/components/DeadlineCard";
import { PendingRuleBanner } from "@/components/PendingRuleBanner";
import { IncomeTimeline } from "@/components/IncomeTimeline";
import { PaymentTable } from "@/components/PaymentTable";

export default function DashboardPage() {
  const { profile, balances, payments, setIsDemoDrawerOpen } = useVault();

  return (
    <div className="space-y-6">
      {/* Pending Rule / Payee Notifications */}
      <PendingRuleBanner />

      {/* Top Banner & Quick Simulation */}
      <div className="p-4 rounded-card bg-surface border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-spend animate-pulse" />
            <h2 className="text-base font-bold text-primary">Solana Vault Engine Active</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider bg-tax/15 text-tax border border-tax/30 uppercase">
              Simulated Devnet
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            All client payments to your designated inbox are split at the source into Spend ({profile.spendBps / 100}%), Tax ({profile.taxBps / 100}%), and Savings ({profile.savingsBps / 100}%).
          </p>
        </div>

        <button
          onClick={() => setIsDemoDrawerOpen(true)}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-spend hover:bg-spend/90 text-black font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-spend/10"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Split Simulator</span>
        </button>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Received */}
        <div className="bg-surface rounded-card border border-border p-4 space-y-1">
          <div className="flex items-center justify-between text-muted text-xs">
            <span>Total Gross Receipts</span>
            <DollarSign className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl md:text-2xl font-bold font-mono text-primary tnum">
            {formatUSDC(profile.totalReceived)}
          </div>
          <span className="text-[11px] text-spend font-medium flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" />
            {profile.paymentCount} payments processed
          </span>
        </div>

        {/* Spend Vault Balance */}
        <div className="bg-surface rounded-card border border-border p-4 space-y-1">
          <div className="flex items-center justify-between text-muted text-xs">
            <span>Spend Available</span>
            <span className="w-2 h-2 rounded-full bg-spend" />
          </div>
          <div className="text-xl md:text-2xl font-bold font-mono text-spend tnum">
            {formatUSDC(balances.spend)}
          </div>
          <span className="text-[11px] text-muted">Liquid operating balance</span>
        </div>

        {/* Locked Tax Balance */}
        <div className="bg-surface rounded-card border border-border p-4 space-y-1">
          <div className="flex items-center justify-between text-muted text-xs">
            <span>Tax Locked Balance</span>
            <span className="w-2 h-2 rounded-full bg-tax" />
          </div>
          <div className="text-xl md:text-2xl font-bold font-mono text-tax tnum">
            {formatUSDC(balances.tax)}
          </div>
          <span className="text-[11px] text-tax font-medium">Restricted to approved payee</span>
        </div>

        {/* Savings Balance */}
        <div className="bg-surface rounded-card border border-border p-4 space-y-1">
          <div className="flex items-center justify-between text-muted text-xs">
            <span>Savings Balance</span>
            <span className="w-2 h-2 rounded-full bg-savings" />
          </div>
          <div className="text-xl md:text-2xl font-bold font-mono text-savings tnum">
            {formatUSDC(balances.savings)}
          </div>
          <span className="text-[11px] text-muted">90-day time lock active</span>
        </div>
      </div>

      {/* The 3 Core Vault Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <VaultCard
          type="spend"
          balance={balances.spend}
          percentage={profile.spendBps / 100}
        />
        <VaultCard
          type="tax"
          balance={balances.tax}
          percentage={profile.taxBps / 100}
        />
        <VaultCard
          type="savings"
          balance={balances.savings}
          percentage={profile.savingsBps / 100}
        />
      </div>

      {/* Analytics & Planning Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <SplitDonut />
        <ReadinessRing />
        <DeadlineCard />
      </div>

      {/* Income Timeline Chart */}
      <IncomeTimeline />

      {/* Recent Payments Table */}
      <PaymentTable payments={payments} />
    </div>
  );
}
