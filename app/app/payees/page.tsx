"use client";

import React, { useState } from "react";
import { ShieldCheck, Copy, Check, Clock, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
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
        text: "New tax payee proposed! 72-hour timelock delay has commenced before activation.",
      });
      setNewPayeeInput("");
    } else {
      setProposeMsg({ type: "error", text: res.error || "Proposal failed." });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h2 className="text-xl font-bold text-primary">Approved Tax Payee Management</h2>
        <p className="text-xs text-muted mt-0.5">
          Restricted destination accounts for smart-contract tax releases
        </p>
      </div>

      {/* Active Approved Payee Card */}
      <div className="bg-surface rounded-card border border-border p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-tax/15 text-tax">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-primary">Current Active Payee</h3>
              <p className="text-xs text-muted">Enforced by on-chain worker profile PDA</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded text-xs font-semibold bg-spend/15 text-spend border border-spend/30">
            Active
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface-elevated border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
          <div>
            <span className="text-[11px] text-muted block mb-0.5 font-sans">Payee Public Key:</span>
            <span className="text-xs sm:text-sm text-primary font-medium break-all">
              {profile.taxPayee}
            </span>
          </div>

          <button
            onClick={() => handleCopy(profile.taxPayee)}
            className="px-3 py-1.5 rounded-lg bg-surface hover:bg-border border border-border text-xs text-muted hover:text-primary transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto font-sans"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-spend" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Address"}</span>
          </button>
        </div>

        <div className="text-xs text-muted leading-relaxed">
          Demo payee notice: In this demonstration mode, the address above is a simulated account. Real IRS or Indian tax authorities do not currently accept direct Solana transactions without licensed third-party off-ramp intermediaries.
        </div>
      </div>

      {/* Propose Payee Update Form */}
      <div className="bg-surface rounded-card border border-border p-6 space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-primary">Propose New Tax Payee</h3>
          <p className="text-xs text-muted mt-0.5">
            Subject to an immutable 72-hour security delay to prevent unauthorized redirect attacks
          </p>
        </div>

        <form onSubmit={handlePropose} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted uppercase block mb-1">
              New Solana Public Key
            </label>
            <input
              type="text"
              required
              placeholder="Enter 32-44 character Solana base58 public key..."
              value={newPayeeInput}
              onChange={(e) => setNewPayeeInput(e.target.value)}
              className="w-full bg-surface-elevated border border-border rounded-xl px-3 py-2.5 text-xs font-mono text-primary focus:outline-none focus:border-tax"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-surface-elevated border border-border text-xs text-muted flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-tax shrink-0 mt-0.5" />
            <span>
              Once proposed, your existing approved payee remains active for 72 hours. After the delay has elapsed, you must sign the transaction to finalize the switch.
            </span>
          </div>

          {proposeMsg && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
                proposeMsg.type === "success"
                  ? "bg-spend/10 border-spend/30 text-spend"
                  : "bg-danger/10 border-danger/30 text-danger"
              }`}
            >
              {proposeMsg.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{proposeMsg.text}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-tax/15 hover:bg-tax/25 text-tax border border-tax/30 font-semibold text-xs transition-colors"
          >
            Submit Payee Proposal (72h Timelock)
          </button>
        </form>
      </div>
    </div>
  );
}
