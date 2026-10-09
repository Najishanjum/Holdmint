"use client";

import React, { useState } from "react";
import { Settings, Shield, Globe, RotateCcw, Check, Sparkles, User, Cpu, AlertTriangle } from "lucide-react";
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
      {/* Neo-Brutalist Header */}
      <div className="bg-[#050505] neo-border neo-shadow p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 bg-[#E8FF00] inline-block animate-pulse"></span>
          <span className="font-mono text-xs uppercase tracking-widest text-[#E8FF00]">
            CLIENT & PROTOCOL CONFIGURATION
          </span>
        </div>
        <h2 className="font-display text-3xl font-black uppercase tracking-tight text-white">
          Settings & Environment
        </h2>
        <p className="text-xs text-white/60 font-mono mt-0.5">
          Configure worker identity profiles, network cluster parameters, and local state
        </p>
      </div>

      {/* Profile & Wallet */}
      <div className="bg-white neo-border neo-shadow">
        <div className="bg-[#050505] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-black font-mono text-xs">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#E8FF00]" />
            <span className="font-bold uppercase tracking-wider">WORKER IDENTITY (ON-CHAIN ATTESTATION)</span>
          </div>
          <span className="text-[#21D99B] font-mono font-bold text-[10px]">PDA CONNECTED</span>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-black font-bold uppercase block mb-1">Display Name</label>
              <input
                type="text"
                readOnly
                value={profile.displayName}
                className="w-full bg-[#F2F0F7] neo-border px-3.5 py-2.5 text-black font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-black font-bold uppercase block mb-1">Primary Solana Signer Wallet</label>
              <input
                type="text"
                readOnly
                value={profile.owner}
                className="w-full bg-[#F2F0F7] neo-border px-3.5 py-2.5 font-mono text-black font-bold text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="text-black font-bold uppercase block mb-1">Approved Tax Payee Recipient PDA</label>
              <input
                type="text"
                readOnly
                value={profile.taxPayee}
                className="w-full bg-[#F2F0F7] neo-border px-3.5 py-2.5 font-mono text-black font-bold text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Network Configuration */}
      <div className="bg-white neo-border neo-shadow">
        <div className="bg-[#050505] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-black font-mono text-xs">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#5919F6]" />
            <span className="font-bold uppercase tracking-wider">NETWORK CLUSTER & MINT SPEC</span>
          </div>
          <span className="text-[#E8FF00] font-mono text-[10px]">ACTIVE RPC</span>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between p-4 bg-[#F2F0F7] neo-border">
              <div>
                <span className="font-bold text-black uppercase block">Active Cluster</span>
                <span className="text-black/60 text-[11px]">Public Solana Devnet endpoint</span>
              </div>
              <span className="px-3 py-1 bg-[#21D99B] text-black font-black uppercase text-xs neo-border">
                Solana Devnet
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F2F0F7] neo-border">
              <div>
                <span className="font-bold text-black uppercase block">USDC Token Mint</span>
                <span className="text-black/60 text-[11px] font-mono">{truncateAddress(profile.mint, 8)}</span>
              </div>
              <span className="font-mono font-bold text-black bg-white px-2.5 py-1 neo-border text-[11px]">
                6 DECIMALS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset Demo State */}
      <div className="bg-white neo-border neo-shadow border-t-4 border-t-[#F2677A]">
        <div className="bg-[#050505] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-black font-mono text-xs">
          <div className="flex items-center gap-2 text-[#F2677A]">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider">SIMULATION RESEED // LOCAL ENVIRONMENT</span>
          </div>
          <span className="text-[#F2677A] font-mono text-[10px]">STATE RESET</span>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs font-mono text-black/80 leading-relaxed">
            Reset all vault balances, recorded simulated payments, and pending proposals back to the initial demo seed data.
          </p>

          {resetDone ? (
            <div className="p-4 bg-[#21D99B]/20 neo-border text-xs font-mono font-bold text-black flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Simulation data restored to initial state!</span>
            </div>
          ) : showConfirmReset ? (
            <div className="p-4 bg-[#F2F0F7] neo-border space-y-3 font-mono">
              <p className="text-xs text-[#F2677A] font-bold uppercase">
                ⚠️ Confirm Reset: This wipes your local session state and restores the original 14 mock transactions.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="px-4 py-2 bg-white neo-border text-xs font-bold text-black uppercase hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="neo-btn px-4 py-2 bg-[#F2677A] text-white neo-border neo-shadow text-xs font-black uppercase hover:bg-[#e05367]"
                >
                  Confirm Reset All Data
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="neo-btn px-5 py-2.5 bg-white hover:bg-[#F2677A] hover:text-white neo-border font-mono text-xs font-bold text-black flex items-center gap-2 transition-colors uppercase"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Demo State</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
