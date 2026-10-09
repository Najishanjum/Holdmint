"use client";

import React, { useState } from "react";
import { ShieldCheck, Copy, Check, Clock, AlertTriangle, ArrowRight, CheckCircle2, KeyRound } from "lucide-react";
import { useVault } from "@/lib/store/vault-store";
import { truncateAddress } from "@/lib/utils/format-usdc";

export default function PayeesPage() {
  const { profile, proposePayee, applyPayee, cancelPendingPayee } = useVault();

  const [newPayeeInput, setNewPayeeInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [proposeMsg, setProposeMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePropose = (e: React.FormEvent) => {
    e.preventDefault();
    setProposeMsg(null);
    const res = proposePayee(newPayeeInput.trim());
    if (res.success) {
      setProposeMsg({
        type: "success",
        text: "New tax payee proposed! 72-hour on-chain timelock delay has commenced before activation.",
      });
      setNewPayeeInput("");
    } else {
      setProposeMsg({ type: "error", text: res.error || "Proposal failed." });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Neo-Brutalist Header */}
      <div className="bg-[#050505] neo-border neo-shadow p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 bg-[#FFBD45] inline-block animate-pulse"></span>
          <span className="font-mono text-xs uppercase tracking-widest text-[#FFBD45]">
            GOVERNANCE & RECIPIENT SECURITY // TIMELOCK ENGINE
          </span>
        </div>
        <h2 className="font-display text-3xl font-black uppercase tracking-tight text-white">
          Approved Tax Payee Management
        </h2>
        <p className="text-xs text-white/60 font-mono mt-0.5">
          Cryptographically enforced destination address for tax disbursements with 72h timelock
        </p>
      </div>

      {/* Active Approved Payee Card */}
      <div className="bg-white neo-border neo-shadow">
        <div className="bg-[#050505] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-black font-mono text-xs">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#21D99B]" />
            <span className="font-bold uppercase tracking-wider">CURRENT ACTIVE PAYEE PDA</span>
          </div>
          <span className="px-2 py-0.5 bg-[#21D99B] text-black font-black uppercase text-[10px]">
            IMMUTABLY BOUND
          </span>
        </div>

        <div className="p-6 space-y-5">
          <div className="p-4 bg-[#F2F0F7] neo-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 overflow-hidden">
              <span className="text-[11px] font-mono uppercase font-bold text-black/60 block">
                Solana Recipient Public Key:
              </span>
              <span className="font-mono text-xs sm:text-sm text-black font-bold break-all block">
                {profile.taxPayee}
              </span>
            </div>

            <button
              onClick={() => handleCopy(profile.taxPayee)}
              className="neo-btn px-4 py-2 bg-white hover:bg-[#E8FF00] neo-border font-mono text-xs font-bold text-black transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
            >
              {copied ? <Check className="w-4 h-4 text-black font-bold" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "COPIED" : "COPY ADDRESS"}</span>
            </button>
          </div>

          <div className="p-4 bg-white neo-border text-xs font-mono text-black/80 space-y-1">
            <div className="font-bold text-black uppercase flex items-center gap-1.5">
              <span>⚠️ SIMULATION NOTICE</span>
            </div>
            <p className="leading-relaxed">
              In this devnet demonstration mode, the address above simulates a designated tax escrow account. Real tax authorities (IRS, Indian Income Tax Department) do not accept direct SPL token deposits; users utilize licensed off-ramps or dedicated state-side conversion partners.
            </p>
          </div>
        </div>
      </div>

      {/* Propose Payee Update Form */}
      <div className="bg-white neo-border neo-shadow">
        <div className="bg-[#050505] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-black font-mono text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FFBD45]" />
            <span className="font-bold uppercase tracking-wider">PROPOSE RECIPIENT MUTATION (72H TIMELOCK)</span>
          </div>
          <span className="text-[#FFBD45] font-mono text-[10px]">ANTI-HIJACK PROTOCOL</span>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-xs font-mono text-black/80 leading-relaxed">
            To prevent malicious smart contract draining or compromised key exploits, payee changes require an immutable 72-hour delay before the update can be ratified on-chain.
          </p>

          <form onSubmit={handlePropose} className="space-y-4">
            <div>
              <label className="text-xs font-mono font-bold text-black uppercase block mb-1">
                New Solana Payee Public Key
              </label>
              <input
                type="text"
                required
                placeholder="Enter 32-44 character Solana base58 public key..."
                value={newPayeeInput}
                onChange={(e) => setNewPayeeInput(e.target.value)}
                className="w-full bg-[#F2F0F7] neo-border px-3.5 py-3 text-xs font-mono text-black focus:outline-none focus:bg-white"
              />
            </div>

            <div className="p-4 bg-[#E8FF00]/20 neo-border text-xs font-mono text-black flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-black shrink-0 mt-0.5" />
              <span>
                Once submitted, your existing tax payee remains strictly locked for 72 hours. After the delay has elapsed, you must sign the on-chain execution transaction to finalize the switch.
              </span>
            </div>

            {proposeMsg && (
              <div
                className={`p-4 neo-border font-mono text-xs flex items-center gap-2 ${
                  proposeMsg.type === "success"
                    ? "bg-[#21D99B]/20 text-black border-black"
                    : "bg-[#F2677A]/20 text-black border-black"
                }`}
              >
                {proposeMsg.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-black" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-black" />
                )}
                <span className="font-bold">{proposeMsg.text}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full neo-btn py-3.5 bg-[#FFBD45] hover:bg-[#e6a635] text-black neo-border neo-shadow font-mono font-black text-xs uppercase tracking-wider transition-colors"
            >
              Submit Payee Proposal (72h Timelock)
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
