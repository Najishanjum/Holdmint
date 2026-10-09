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
      title: "SPEND VAULT",
      color: "text-[#21D99B]",
      bgColor: "bg-[#21D99B]/15",
      badgeColor: "bg-[#21D99B] text-[#050505]",
      accentBar: "bg-[#21D99B]",
      description: "Liquid operational capital for daily freelancer business expenses.",
      actionLabel: "WITHDRAW TO WALLET",
      icon: Unlock,
    },
    tax: {
      title: "TAX VAULT",
      color: "text-[#FFBD45]",
      bgColor: "bg-[#FFBD45]/15",
      badgeColor: "bg-[#FFBD45] text-[#050505]",
      accentBar: "bg-[#FFBD45]",
      description: "Smart contract protected. Release restricted solely to approved tax payee.",
      actionLabel: "RELEASE TO PAYEE",
      icon: Lock,
    },
    savings: {
      title: "SAVINGS VAULT",
      color: "text-[#8790FF]",
      bgColor: "bg-[#8790FF]/15",
      badgeColor: "bg-[#8790FF] text-[#050505]",
      accentBar: "bg-[#8790FF]",
      description: "Time-locked treasury for long-term reserves and emergency buffers.",
      actionLabel: "WITHDRAW SAVINGS",
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
      <div className="bg-white text-[#050505] rounded-[6px] border-2 border-[#050505] neo-shadow flex flex-col justify-between overflow-hidden relative">
        {/* Terminal Window Header Bar */}
        <div className="bg-[#050505] text-white px-4 py-2 flex items-center justify-between border-b-2 border-[#050505]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD45] border border-black inline-block" />
            <h3 className="font-display font-black text-xs uppercase tracking-wider text-white">
              {currentConfig.title}
            </h3>
          </div>
          <span className="font-mono text-[11px] font-bold px-1.5 py-0.2 rounded bg-white text-black">
            {percentage}%
          </span>
        </div>

        {/* Content Area */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase text-[#696574] tracking-wider">
                AVAILABLE BALANCE
              </span>
              {type === "tax" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#FFBD45] text-black border border-black neo-shadow-sm font-mono">
                  <Lock className="w-3 h-3" />
                  LOCKED
                </span>
              )}
              {type === "savings" && (
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-black neo-shadow-sm font-mono ${
                    isSavingsUnlocked ? "bg-[#21D99B] text-black" : "bg-[#8790FF] text-black"
                  }`}
                >
                  {isSavingsUnlocked ? "UNLOCKED" : "90D LOCKED"}
                </span>
              )}
            </div>

            {/* Large Balance Display */}
            <div className="my-3">
              <div className="text-3xl sm:text-4xl font-display font-black tracking-tight text-[#050505] tnum">
                {formatUSDC(balance)}
              </div>
              <p className="text-xs text-[#696574] mt-1.5 leading-relaxed font-sans">
                {currentConfig.description}
              </p>
            </div>

            {/* Contextual Details */}
            {type === "tax" && (
              <div className="p-2.5 rounded-[4px] bg-[#F2F0F7] border border-[#050505] text-[11px] font-mono space-y-1 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#696574]">Approved Payee:</span>
                  <span className="font-bold text-[#050505]">
                    {truncateAddress(profile.taxPayee, 4)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#696574]">On-Chain Restriction:</span>
                  <span className="text-[#050505] font-black uppercase">Active</span>
                </div>
              </div>
            )}

            {type === "savings" && (
              <div className="p-2.5 rounded-[4px] bg-[#F2F0F7] border border-[#050505] text-[11px] font-mono space-y-1 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#696574]">Unlock Date:</span>
                  <span className="font-bold text-[#050505]">
                    {new Date(profile.savingsUnlockTs * 1000).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#696574]">Withdrawal Status:</span>
                  <span className={`font-black uppercase ${isSavingsUnlocked ? "text-[#21D99B]" : "text-[#8790FF]"}`}>
                    {isSavingsUnlocked ? "Eligible" : "Time-Locked"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleOpenAction}
            className={`w-full py-2.5 px-3 rounded-[4px] border-2 border-[#050505] font-display font-black text-xs uppercase flex items-center justify-center gap-1.5 neo-btn tracking-wider mt-2 ${
              type === "spend"
                ? "bg-[#21D99B] text-black hover:bg-emerald-400"
                : type === "tax"
                ? "bg-[#FFBD45] text-black hover:bg-amber-300"
                : "bg-[#8790FF] text-black hover:bg-indigo-300"
            }`}
          >
            <span>{currentConfig.actionLabel}</span>
            <ArrowUpRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Action Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white border-2 border-[#050505] rounded-[8px] p-6 neo-shadow-lg text-[#050505] relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#050505]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-[4px] bg-[#050505] text-white">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-black text-base uppercase text-[#050505]">
                    {currentConfig.title} ACTION
                  </h3>
                  <p className="text-xs text-[#696574] font-mono">Available: {formatUSDC(balance)}</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded border border-[#050505] flex items-center justify-center font-bold text-xs hover:bg-[#F2F0F7]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-mono font-bold uppercase text-[#696574] block mb-1">
                  Amount to Transfer (USDC)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[#050505] text-sm font-bold">$</span>
                  <input
                    type="text"
                    value={withdrawAmountStr}
                    onChange={(e) => setWithdrawAmountStr(e.target.value)}
                    placeholder="250.00"
                    className="w-full bg-[#F2F0F7] border-2 border-[#050505] rounded-[4px] pl-8 pr-16 py-2 text-sm font-mono font-bold text-[#050505] focus:outline-none focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setWithdrawAmountStr((Number(balance) / 1000000).toFixed(2))}
                    className="absolute right-2 top-2 px-2 py-0.5 text-[10px] font-black font-mono bg-[#E8FF00] border border-[#050505] text-black rounded"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {type === "tax" && (
                <div>
                  <label className="text-[11px] font-mono font-bold uppercase text-[#696574] block mb-1">
                    Destination Payee Address
                  </label>
                  <input
                    type="text"
                    value={targetAddress}
                    onChange={(e) => setTargetAddress(e.target.value)}
                    placeholder="Approved tax payee Solana address..."
                    className="w-full bg-[#F2F0F7] border-2 border-[#050505] rounded-[4px] px-3 py-2 text-xs font-mono font-bold text-[#050505] focus:outline-none focus:bg-white"
                  />
                  <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-[#696574]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#FFBD45] shrink-0 mt-0.5" />
                    <span>
                      Tax funds can only be released to your approved payee:{" "}
                      <span className="font-mono text-[#050505] font-bold">
                        {truncateAddress(profile.taxPayee, 4)}
                      </span>.
                    </span>
                  </div>
                </div>
              )}

              {type === "savings" && !isSavingsUnlocked && (
                <div className="p-3 rounded-[4px] bg-[#F2677A]/15 border-2 border-[#F2677A] text-xs text-[#050505] flex items-start gap-2 font-mono">
                  <AlertCircle className="w-4 h-4 text-[#F2677A] shrink-0 mt-0.5" />
                  <span>
                    Time-locked until {new Date(profile.savingsUnlockTs * 1000).toLocaleDateString()}. Withdrawals prior to this date will be rejected on-chain.
                  </span>
                </div>
              )}
            </div>

            {actionError && (
              <div className="p-3 rounded-[4px] bg-[#F2677A]/15 border-2 border-[#F2677A] text-xs text-[#050505] flex items-start gap-2 font-mono">
                <AlertCircle className="w-4 h-4 text-[#F2677A] shrink-0 mt-0.5" />
                <span>{actionError}</span>
              </div>
            )}
            {actionSuccess && (
              <div className="p-3 rounded-[4px] bg-[#21D99B]/15 border-2 border-[#21D99B] text-xs text-[#050505] flex items-start gap-2 font-mono">
                <CheckCircle2 className="w-4 h-4 text-[#21D99B] shrink-0 mt-0.5" />
                <span>{actionSuccess}</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-[4px] border-2 border-[#050505] text-[#050505] hover:bg-[#F2F0F7] text-xs font-display font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecute}
                className="flex-1 py-2.5 px-4 rounded-[4px] bg-[#E8FF00] text-[#050505] font-display font-black text-xs uppercase neo-btn tracking-wider hover:bg-yellow-300"
              >
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
