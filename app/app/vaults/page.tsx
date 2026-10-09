"use client";

import React, { useState } from "react";
import {
  Vault,
  Inbox,
  RefreshCw,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useVault } from "@/lib/store/vault-store";
import { formatUSDC, parseUSDC, truncateAddress } from "@/lib/utils/format-usdc";
import { VaultCard } from "@/components/VaultCard";

export default function VaultsPage() {
  const { balances, profile, sweepInbox, setIsDemoDrawerOpen } = useVault();
  const [isSweeping, setIsSweeping] = useState(false);
  const [sweepMsg, setSweepMsg] = useState<string | null>(null);

  const handleSweep = () => {
    setIsSweeping(true);
    setSweepMsg(null);
    setTimeout(() => {
      const res = sweepInbox();
      if (res.success) {
        setSweepMsg("Inbox swept successfully! Tokens split into Spend, Tax, and Savings.");
      } else {
        setSweepMsg(res.error || "Nothing to sweep.");
      }
      setIsSweeping(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary">Vault Treasury Accounts</h2>
          <p className="text-xs text-muted mt-0.5">
            Non-custodial Program-Derived Token Accounts (PDAs) on Solana Devnet
          </p>
        </div>

        <button
          onClick={() => setIsDemoDrawerOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-spend text-black font-semibold text-xs flex items-center gap-1.5 self-start sm:self-auto hover:opacity-90 transition-opacity"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simulate Payment Inflow</span>
        </button>
      </div>

      {/* The Three Core Vault Cards */}
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

      {/* Inbox Sweeper Card & Architectural Notice */}
      <div className="bg-surface rounded-card border border-border p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-surface-elevated text-spend">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-primary">Worker Vault Inbox</h3>
              <p className="text-xs text-muted">Permissionless balance sweeper</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-muted block">Unswept Inbox Balance</span>
              <span className="font-mono font-bold text-primary text-sm tnum">
                {formatUSDC(balances.inbox)}
              </span>
            </div>
            <button
              onClick={handleSweep}
              disabled={isSweeping || balances.inbox <= 0n}
              className="px-4 py-2 rounded-xl bg-surface-elevated hover:bg-border border border-border text-xs font-semibold text-primary flex items-center gap-1.5 transition-colors disabled:opacity-40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSweeping ? "animate-spin" : ""}`} />
              <span>Sweep to Vaults</span>
            </button>
          </div>
        </div>

        {sweepMsg && (
          <div className="p-3 rounded-xl bg-surface-elevated border border-border text-xs flex items-center gap-2 text-primary">
            <CheckCircle2 className="w-4 h-4 text-spend shrink-0" />
            <span>{sweepMsg}</span>
          </div>
        )}

        {/* Technical Callout */}
        <div className="p-4 rounded-xl bg-surface-elevated border border-border text-xs text-muted space-y-2">
          <div className="flex items-center gap-2 text-tax font-semibold">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Solana Direct Transfer Interception Boundary</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            Solana programs cannot intercept ordinary token transfers sent directly to a worker's personal wallet. Clients should pay via your designated Tax Vault Payment Links, or transfer directly to your designated Vault Inbox token account, which can then be swept permissionlessly under active split rules.
          </p>
        </div>
      </div>
    </div>
  );
}
