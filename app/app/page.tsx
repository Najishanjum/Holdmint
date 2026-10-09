"use client";

import React from "react";
import {
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lock,
  Unlock,
  Clock,
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
      {/* Pending Timelock Rule / Payee Notifications */}
      <PendingRuleBanner />

      {/* Top Banner & Quick Simulation */}
      <div className="bg-[#050505] text-white p-5 rounded-[6px] border-2 border-[#050505] neo-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E8FF00] animate-pulse" />
            <h2 className="font-display font-black text-lg uppercase tracking-tight text-white">
              SOLANA VAULT ENGINE ACTIVE
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black tracking-wider bg-[#E8FF00] text-[#050505] border border-black uppercase">
              DEVNET SIMULATED
            </span>
          </div>
          <p className="text-xs text-[#B8B5C5] mt-1 font-sans">
            Payments to your designated inbox are split at the source into Spend ({profile.spendBps / 100}%), Tax ({profile.taxBps / 100}%), and Savings ({profile.savingsBps / 100}%).
          </p>
        </div>

        <button
          onClick={() => setIsDemoDrawerOpen(true)}
          className="self-start md:self-auto px-4 py-2.5 rounded-[4px] bg-[#E8FF00] text-[#050505] font-display font-black text-xs uppercase flex items-center gap-2 neo-btn tracking-wider hover:bg-yellow-300"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>OPEN SPLIT SIMULATOR</span>
        </button>
      </div>

      {/* 4 Primary Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Received */}
        <div className="bg-white text-[#050505] rounded-[6px] border-2 border-[#050505] neo-shadow p-4 space-y-1">
          <div className="flex items-center justify-between text-[#696574] text-[11px] font-mono font-bold uppercase">
            <span>TOTAL RECEIPTS</span>
            <span className="w-2 h-2 rounded-full bg-[#5919F6]" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-[#050505] tnum">
            {formatUSDC(profile.totalReceived)}
          </div>
          <span className="text-[10px] font-mono font-bold text-[#21D99B] flex items-center gap-1 uppercase">
            <TrendingUp className="w-3 h-3" />
            {profile.paymentCount} payments recorded
          </span>
        </div>

        {/* Spend Available */}
        <div className="bg-white text-[#050505] rounded-[6px] border-2 border-[#050505] neo-shadow p-4 space-y-1">
          <div className="flex items-center justify-between text-[#696574] text-[11px] font-mono font-bold uppercase">
            <span>SPEND AVAILABLE</span>
            <span className="w-2 h-2 rounded-full bg-[#21D99B]" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-[#050505] tnum">
            {formatUSDC(balances.spend)}
          </div>
          <span className="text-[10px] font-mono font-bold text-[#696574] uppercase">
            LIQUID OPERATING BALANCE
          </span>
        </div>

        {/* Locked Tax Balance */}
        <div className="bg-white text-[#050505] rounded-[6px] border-2 border-[#050505] neo-shadow p-4 space-y-1">
          <div className="flex items-center justify-between text-[#696574] text-[11px] font-mono font-bold uppercase">
            <span>TAX LOCKED BALANCE</span>
            <Lock className="w-3 h-3 text-[#FFBD45]" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-[#050505] tnum">
            {formatUSDC(balances.tax)}
          </div>
          <span className="text-[10px] font-mono font-bold text-[#FFBD45] uppercase">
            RESTRICTED TO APPROVED PAYEE
          </span>
        </div>

        {/* Savings Balance */}
        <div className="bg-white text-[#050505] rounded-[6px] border-2 border-[#050505] neo-shadow p-4 space-y-1">
          <div className="flex items-center justify-between text-[#696574] text-[11px] font-mono font-bold uppercase">
            <span>SAVINGS BALANCE</span>
            <Clock className="w-3 h-3 text-[#8790FF]" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black text-[#050505] tnum">
            {formatUSDC(balances.savings)}
          </div>
          <span className="text-[10px] font-mono font-bold text-[#696574] uppercase">
            90-DAY TIME LOCK ACTIVE
          </span>
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
