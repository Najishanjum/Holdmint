"use client";

import React, { useState } from "react";
import { Lock, Unlock, ArrowUpRight, ShieldCheck, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { formatUSDC, parseUSDC, truncateAddress } from "@/lib/utils/format-usdc";
import { useVault } from "@/lib/store/vault-store";

interface VaultCardProps {
  type: "spend" | "tax" | "savings";
  balance: bigint;
  percentage: number;
}

export function VaultCard({ type, balance, percentage }: VaultCardProps) {
  const { profile, withdrawSpend, releaseTax, withdrawSavings } = useVault();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawAmountStr, setWithdrawAmountStr] = useState("");
  const [targetAddress, setTargetAddress] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const configs = {
    spend: {
      title: "Spend Vault",
      color: "text-spend",
      bgColor: "bg-spend/10",
      borderColor: "border-spend/30",
      accentBar: "bg-spend",
      description: "Liquid operational capital for daily freelancer business expenses.",
      actionLabel: "Withdraw to Wallet",
      icon: Unlock,
    },
    tax: {
      title: "Tax Vault",
      color: "text-tax",
      bgColor: "bg-tax/10",
      borderColor: "border-tax/30",
      accentBar: "bg-tax",
      description: "Smart contract protected. Release restricted solely to approved tax payee.",
      actionLabel: "Release to Payee",
      icon: Lock,
    },
    savings: {
      title: "Savings Vault",
      color: "text-savings",
      bgColor: "bg-savings/10",
      borderColor: "border-savings/30",
      accentBar: "bg-savings",
      description: "Time-locked treasury for long-term reserves and emergency buffers.",
      actionLabel: "Withdraw Savings",
      icon: Clock,
    },
  };

  const currentConfig = configs[type];
  const Icon = currentConfig.icon;

  const nowSecs = Math.floor(Date.now() / 1000);
  const isSavingsUnlocked = nowSecs >= profile.savingsUnlockTs;

  const handleOpenAction = () => {
    setActionError(null);
    setActionSuccess(null);
    setWithdrawAmountStr("");
    if (type === "tax") {
      setTargetAddress(profile.taxPayee);
    }
    setIsModalOpen(true);
  };

  const handleExecute = () => {
    setActionError(null);
    setActionSuccess(null);
    const amount = parseUSDC(withdrawAmountStr);
    if (amount <= 0n) {
      setActionError("Please enter a valid amount greater than zero");
      return;
    }

    if (type === "spend") {
      const res = withdrawSpend(amount);
      if (!res.success) setActionError(res.error || "Withdrawal failed");
      else {
        setActionSuccess(`Successfully withdrew ${formatUSDC(amount)} from Spend Vault`);
        setTimeout(() => setIsModalOpen(false), 1200);
      }
    } else if (type === "tax") {
      const res = releaseTax(amount, targetAddress);
      if (!res.success) setActionError(res.error || "Release blocked by rule restriction");
      else {
        setActionSuccess(`Successfully released ${formatUSDC(amount)} to approved payee`);
        setTimeout(() => setIsModalOpen(false), 1200);
      }
    } else if (type === "savings") {
      const res = withdrawSavings(amount);
      if (!res.success) setActionError(res.error || "Withdrawal failed");
      else {
        setActionSuccess(`Successfully withdrew ${formatUSDC(amount)} from Savings Vault`);
        setTimeout(() => setIsModalOpen(false), 1200);
      }
    }
  };

  return (
    <>
      <div className="bg-surface rounded-card border border-border p-5 relative overflow-hidden flex flex-col justify-between hover:border-border/80 transition-all shadow-sm">
        {/* Accent Bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${currentConfig.accentBar}`} />

        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl ${currentConfig.bgColor} ${currentConfig.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-primary">{currentConfig.title}</h3>
                <span className="text-[11px] text-muted font-medium">{percentage}% Allocation</span>
              </div>
            </div>

            {type === "tax" && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-tax bg-tax/15 px-2 py-0.5 rounded-full border border-tax/30">
                <Lock className="w-3 h-3" />
                Locked
              </span>
            )}
            {type === "savings" && (
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                isSavingsUnlocked
                  ? "text-spend bg-spend/15 border-spend/30"
                  : "text-savings bg-savings/15 border-savings/30"
              }`}>
                {isSavingsUnlocked ? "Unlocked" : "Locked (90d)"}
              </span>
            )}
          </div>

          {/* Balance */}
          <div className="my-4">
            <div className="text-2xl md:text-3xl font-bold font-mono text-primary tnum">
              {formatUSDC(balance)}
            </div>
            <p className="text-xs text-muted mt-1 leading-relaxed">{currentConfig.description}</p>
          </div>

          {/* Contextual Info */}
          {type === "tax" && (
            <div className="p-2.5 rounded-xl bg-surface-elevated border border-border text-[11px] text-muted space-y-1 mb-4">
              <div className="flex justify-between items-center">
                <span>Approved Payee:</span>
                <span className="font-mono text-primary font-medium">
                  {truncateAddress(profile.taxPayee, 4)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Release Restriction:</span>
                <span className="text-tax font-semibold">Enforced on-chain</span>
              </div>
            </div>
          )}

          {type === "savings" && (
            <div className="p-2.5 rounded-xl bg-surface-elevated border border-border text-[11px] text-muted space-y-1 mb-4">
              <div className="flex justify-between items-center">
                <span>Unlock Date:</span>
                <span className="font-mono text-primary font-medium">
                  {new Date(profile.savingsUnlockTs * 1000).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Status:</span>
                <span className={isSavingsUnlocked ? "text-spend font-semibold" : "text-savings font-semibold"}>
                  {isSavingsUnlocked ? "Eligible to withdraw" : "Time-locked"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleOpenAction}
          className={`w-full py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            type === "spend"
              ? "bg-spend/15 hover:bg-spend/25 text-spend border-spend/30"
              : type === "tax"
              ? "bg-tax/15 hover:bg-tax/25 text-tax border-tax/30"
              : "bg-savings/15 hover:bg-savings/25 text-savings border-savings/30"
          }`}
        >
          <span>{currentConfig.actionLabel}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Action Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-surface border border-border rounded-card p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${currentConfig.bgColor} ${currentConfig.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-primary">{currentConfig.title} Action</h3>
                  <p className="text-xs text-muted">Available: {formatUSDC(balance)}</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted hover:text-primary text-sm px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted uppercase block mb-1">
                  Amount to Transfer (USDC)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted text-sm font-semibold">$</span>
                  <input
                    type="text"
                    value={withdrawAmountStr}
                    onChange={(e) => setWithdrawAmountStr(e.target.value)}
                    placeholder="250.00"
                    className="w-full bg-surface-elevated border border-border rounded-xl pl-8 pr-16 py-2 text-sm font-mono text-primary focus:outline-none focus:border-spend"
                  />
                  <button
                    type="button"
                    onClick={() => setWithdrawAmountStr((Number(balance) / 1000000).toFixed(2))}
                    className="absolute right-2 top-2 px-2 py-1 text-[10px] font-bold bg-surface border border-border text-muted hover:text-primary rounded"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {type === "tax" && (
                <div>
                  <label className="text-xs font-medium text-muted uppercase block mb-1">
                    Destination Payee Address
                  </label>
                  <input
                    type="text"
                    value={targetAddress}
                    onChange={(e) => setTargetAddress(e.target.value)}
                    placeholder="Approved tax payee Solana address..."
                    className="w-full bg-surface-elevated border border-border rounded-xl px-3 py-2 text-xs font-mono text-primary focus:outline-none focus:border-tax"
                  />
                  <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-muted">
                    <ShieldCheck className="w-3.5 h-3.5 text-tax shrink-0 mt-0.5" />
                    <span>
                      Tax funds can only be released to your approved payee:{" "}
                      <span className="font-mono text-primary">{truncateAddress(profile.taxPayee, 4)}</span>. Any other address will be rejected.
                    </span>
                  </div>
                </div>
              )}

              {type === "savings" && !isSavingsUnlocked && (
                <div className="p-3 rounded-xl bg-danger/10 border border-danger/30 text-xs text-danger flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    This vault is time-locked until {new Date(profile.savingsUnlockTs * 1000).toLocaleDateString()}. Withdrawals prior to this date will be rejected by smart contract rules.
                  </span>
                </div>
              )}
            </div>

            {/* Error or Success notification */}
            {actionError && (
              <div className="p-3 rounded-xl bg-danger/10 border border-danger/30 text-xs text-danger flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{actionError}</span>
              </div>
            )}
            {actionSuccess && (
              <div className="p-3 rounded-xl bg-spend/10 border border-spend/30 text-xs text-spend flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-border text-muted hover:text-primary text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecute}
                className="flex-1 py-2.5 px-4 rounded-xl bg-spend text-black font-semibold text-sm hover:opacity-90"
              >
                Confirm Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
