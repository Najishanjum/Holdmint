"use client";

import React, { useState } from "react";
import { Settings, Shield, Globe, RotateCcw, Check, Sparkles } from "lucide-react";
import { useVault } from "@/lib/store/vault-store";
import { truncateAddress } from "@/lib/utils/format-usdc";

export default function SettingsPage() {
  const { profile, resetDemoData } = useVault();
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    resetDemoData();
    setShowConfirmReset(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="pb-4 border-b border-border">
        <h2 className="text-xl font-bold text-primary">Settings & Preferences</h2>
        <p className="text-xs text-muted mt-0.5">
          Configure profile details, network connectivity, and session parameters
        </p>
      </div>

      {/* Profile & Wallet */}
      <div className="bg-surface rounded-card border border-border p-6 space-y-4">
        <h3 className="text-sm font-semibold text-primary">Worker Identity</h3>

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-muted block mb-1">Display Name</label>
            <input
              type="text"
              readOnly
              value={profile.displayName}
              className="w-full bg-surface-elevated border border-border rounded-xl px-3 py-2 text-primary font-medium focus:outline-none"
            />
          </div>

          <div>
            <label className="text-muted block mb-1">Primary Solana Wallet</label>
            <input
              type="text"
              readOnly
              value={profile.owner}
              className="w-full bg-surface-elevated border border-border rounded-xl px-3 py-2 font-mono text-primary text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="text-muted block mb-1">Approved Tax Payee</label>
            <input
              type="text"
              readOnly
              value={profile.taxPayee}
              className="w-full bg-surface-elevated border border-border rounded-xl px-3 py-2 font-mono text-primary text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Network Configuration */}
      <div className="bg-surface rounded-card border border-border p-6 space-y-4">
        <h3 className="text-sm font-semibold text-primary">Network & Cluster</h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated border border-border">
            <div>
              <span className="font-semibold text-primary block">Active Cluster</span>
              <span className="text-muted text-[11px]">Devnet sandbox for demonstration</span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-spend/15 text-spend border border-spend/30">
              Solana Devnet
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated border border-border">
            <div>
              <span className="font-semibold text-primary block">USDC Token Mint</span>
              <span className="text-muted text-[11px] font-mono">{truncateAddress(profile.mint, 6)}</span>
            </div>
            <span className="text-[11px] font-mono text-muted">6 Decimals</span>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset Demo State */}
      <div className="bg-surface rounded-card border border-danger/30 p-6 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-danger">Reset Simulation State</h3>
          <p className="text-xs text-muted mt-0.5">
            Reset all vault balances, recorded simulated payments, and pending proposals back to the initial demo seed data.
          </p>
        </div>

        {resetDone ? (
          <div className="p-3 rounded-xl bg-spend/10 border border-spend/30 text-xs text-spend flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Simulation data restored to initial state!</span>
          </div>
        ) : showConfirmReset ? (
          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-3">
            <p className="text-xs text-danger font-medium">
              Are you sure? This will wipe your local simulation changes and restore the 14 seeded demo transactions.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted hover:text-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg bg-danger text-white text-xs font-semibold hover:bg-danger/90"
              >
                Yes, Reset All Demo Data
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="px-4 py-2 rounded-xl border border-danger/40 text-danger hover:bg-danger/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        )}
      </div>
    </div>
  );
}
