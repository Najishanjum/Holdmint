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
  Terminal,
  Activity,
  Layers,
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
      {/* Neo-Brutalist Header Bar */}
      <div className="bg-[#050505] neo-border neo-shadow p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-[#E8FF00] inline-block animate-pulse"></span>
            <span className="font-mono text-xs uppercase tracking-widest text-[#E8FF00]">
              TREASURY ENGINE // DEVNET PDA ACCOUNTS
            </span>
          </div>
          <h2 className="font-display text-3xl font-black uppercase tracking-tight text-white">
            Vault Treasury Accounts
          </h2>
          <p className="text-xs text-white/60 font-mono mt-0.5">
            Non-custodial Program-Derived Token Accounts (PDAs) with atomic routing
          </p>
        </div>

        <button
          onClick={() => setIsDemoDrawerOpen(true)}
          className="neo-btn bg-[#E8FF00] text-black font-mono font-black text-xs uppercase tracking-wider px-5 py-3 neo-border neo-shadow flex items-center gap-2 hover:bg-[#d8ed00] self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Simulate Payment Inflow</span>
        </button>
      </div>

      {/* The Three Core Vault Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      <div className="bg-white neo-border neo-shadow">
        {/* Terminal Header */}
        <div className="bg-[#050505] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-[#E8FF00]" />
            <span className="font-mono text-xs font-black uppercase tracking-wider">
              WORKER VAULT INBOX // PERMISSIONLESS CRON & ON-DEMAND SWEEPER
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/70">
            <span className="w-2 h-2 rounded-full bg-[#21D99B]"></span>
            <span>AUTO-SWEEP READY</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#F2F0F7] neo-border">
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase text-black/60 font-bold block">
                Unswept Inbox Token PDA Balance
              </span>
              <div className="font-mono font-black text-3xl text-black tnum">
                {formatUSDC(balances.inbox)}
              </div>
              <p className="text-xs text-black/70 font-mono">
                Tokens deposited directly to Inbox PDA before instruction split
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleSweep}
                disabled={isSweeping || balances.inbox <= 0n}
                className="neo-btn bg-[#5919F6] text-white font-mono font-black text-xs uppercase tracking-wider px-5 py-3 neo-border neo-shadow flex items-center justify-center gap-2 hover:bg-[#4d13dd] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${isSweeping ? "animate-spin" : ""}`} />
                <span>{isSweeping ? "Sweeping PDA..." : "Sweep To Split Vaults"}</span>
              </button>
            </div>
          </div>

          {sweepMsg && (
            <div className="p-4 bg-[#E8FF00] neo-border text-xs font-mono font-bold flex items-center gap-2 text-black">
              <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
              <span>{sweepMsg}</span>
            </div>
          )}

          {/* Technical Protocol Architecture Specification */}
          <div className="p-5 bg-white neo-border space-y-3">
            <div className="flex items-center gap-2 text-black font-display text-lg font-black uppercase tracking-tight">
              <ShieldAlert className="w-5 h-5 text-[#FFBD45] shrink-0" />
              <span>SOLANA DIRECT TRANSFER INTERCEPTION BOUNDARY</span>
            </div>
            <p className="text-xs text-black/80 font-mono leading-relaxed">
              Solana runtime programs cannot retroactively intercept arbitrary SPL-token transfers directed to your personal wallet public key. To guarantee automated withholding, always distribute your generated <strong className="text-black bg-[#E8FF00] px-1 font-bold">Tax Vault Payment Links</strong> or direct enterprise clients to your unique PDA Vault Inbox token account. Once deposited, anyone or any automated crank service can trigger <code className="bg-[#050505] text-[#E8FF00] px-1.5 py-0.5 rounded text-[11px] font-mono">sweep_inbox</code> to atomically enforce your split ratios.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono font-bold">
              <span className="bg-[#050505] text-white px-2.5 py-1">SEED: b"vault_inbox"</span>
              <span className="bg-[#050505] text-white px-2.5 py-1">PROGRAM: TaxVault111111111111111111111111111111111</span>
              <span className="bg-[#E8FF00] text-black px-2.5 py-1 neo-border">STATUS: DEVNET ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
