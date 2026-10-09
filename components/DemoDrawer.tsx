"use client";

import React, { useState } from "react";
import { X, Play, RotateCcw, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { useVault } from "@/lib/store/vault-store";
import { parseUSDC, formatUSDC, calculateSplit } from "@/lib/utils/format-usdc";

export function DemoDrawer() {
  const {
    isDemoDrawerOpen,
    setIsDemoDrawerOpen,
    profile,
    processPayment,
    resetDemoData,
  } = useVault();

  const [amountStr, setAmountStr] = useState<string>("1000.00");
  const [payerName, setPayerName] = useState<string>("Acme Studio");
  const [memo, setMemo] = useState<string>("Brand Identity Milestone 1");
  const [lastSplit, setLastSplit] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);

  if (!isDemoDrawerOpen) return null;

  const quickAmounts = ["100.00", "500.00", "1000.00", "2500.00"];
  const parsedBaseUnits = parseUSDC(amountStr);
  const previewSplit = calculateSplit(parsedBaseUnits, profile.taxBps, profile.savingsBps);

  const handleExecute = () => {
    if (parsedBaseUnits <= 0n) return;
    setIsProcessing(true);
    setTimeout(() => {
      const result = processPayment(parsedBaseUnits, payerName, memo);
      setLastSplit(result.split);
      setIsProcessing(false);
    }, 400);
  };

  const handleReset = () => {
    resetDemoData();
    setShowConfirmReset(false);
    setLastSplit(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white text-[#050505] border-l-2 border-[#050505] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="bg-[#050505] text-white p-4 border-b-2 border-[#050505] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E8FF00] inline-block" />
              <div>
                <h2 className="font-display font-black text-sm uppercase tracking-wider text-white">
                  SPLIT SIMULATOR CONSOLE
                </h2>
                <div className="flex items-center gap-2 mt-0.5 font-mono text-[10px] text-[#A1A1AA]">
                  <span className="text-[#E8FF00] font-bold">MOCK USDC</span>
                  <span>· SOLANA DEVNET</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsDemoDrawerOpen(false)}
              className="w-6 h-6 rounded bg-white text-black font-bold flex items-center justify-center text-xs"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* Active Ratio Callout */}
            <div className="p-3 rounded-[6px] bg-[#F2F0F7] border border-[#050505] text-xs font-mono flex items-center justify-between font-bold">
              <span>ACTIVE RATIO:</span>
              <span className="text-[#5919F6]">
                {profile.spendBps / 100}% SPEND · {profile.taxBps / 100}% TAX · {profile.savingsBps / 100}% SAVINGS
              </span>
            </div>

            {/* Quick Amounts */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono font-bold text-[#696574] uppercase tracking-wider">
                SIMULATE PAYMENT AMOUNT
              </label>
              <div className="grid grid-cols-4 gap-2 font-mono">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmountStr(amt)}
                    className={`py-2 text-xs font-bold rounded-[4px] border-2 border-[#050505] transition-all ${
                      amountStr === amt
                        ? "bg-[#E8FF00] text-black neo-shadow-sm font-black"
                        : "bg-white text-black hover:bg-[#F2F0F7]"
                    }`}
                  >
                    ${amt.split(".")[0]}
                  </button>
                ))}
              </div>
              <div className="relative mt-2">
                <span className="absolute left-3 top-2.5 text-[#050505] text-sm font-bold font-mono">$</span>
                <input
                  type="text"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  placeholder="1000.00"
                  className="w-full bg-[#F2F0F7] border-2 border-[#050505] rounded-[4px] pl-8 pr-4 py-2 text-sm font-mono font-bold text-[#050505] focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            {/* Payer Details */}
            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[11px] font-bold text-[#696574] uppercase block mb-1">
                  DEMO CLIENT PAYER
                </label>
                <select
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  className="w-full bg-[#F2F0F7] border-2 border-[#050505] rounded-[4px] px-3 py-2 text-xs font-bold text-[#050505] focus:outline-none"
                >
                  <option value="Acme Studio">Acme Studio (Design Agency)</option>
                  <option value="Northstar Labs">Northstar Labs (Web3 Studio)</option>
                  <option value="Pixel Works">Pixel Works (Product Team)</option>
                  <option value="DevCraft Inc.">DevCraft Inc. (Enterprise Client)</option>
                  <option value="Custom Payer">Custom Client</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#696574] uppercase block mb-1">
                  INVOICE MEMO
                </label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full bg-[#F2F0F7] border-2 border-[#050505] rounded-[4px] px-3 py-2 text-xs font-bold text-[#050505] focus:outline-none"
                />
              </div>
            </div>

            {/* Split Breakdown */}
            <div className="p-4 rounded-[6px] bg-white border-2 border-[#050505] neo-shadow space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b-2 border-[#050505]">
                <span className="font-display font-black text-xs uppercase tracking-wider">
                  SPLIT PROJECTION
                </span>
                <span className="text-[10px] text-[#696574]">6-DECIMAL INTEGER</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#21D99B] border border-black" />
                    <span>Spend ({previewSplit.spendBps / 100}%)</span>
                  </div>
                  <span className="font-bold text-[#050505]">
                    {formatUSDC(previewSplit.spendAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD45] border border-black" />
                    <span>Tax Vault ({previewSplit.taxBps / 100}%)</span>
                  </div>
                  <span className="font-bold text-[#050505]">
                    {formatUSDC(previewSplit.taxAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8790FF] border border-black" />
                    <span>Savings ({previewSplit.savingsBps / 100}%)</span>
                  </div>
                  <span className="font-bold text-[#050505]">
                    {formatUSDC(previewSplit.savingsAmount)}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t-2 border-[#050505] flex items-center justify-between font-bold">
                <span>TOTAL GROSS:</span>
                <span className="text-sm font-black">{formatUSDC(previewSplit.grossAmount)}</span>
              </div>
            </div>

            {lastSplit && (
              <div className="p-3 rounded-[4px] bg-[#21D99B]/15 border-2 border-[#21D99B] flex items-start gap-2 text-xs font-mono text-[#050505]">
                <CheckCircle2 className="w-4 h-4 text-[#21D99B] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Simulated Payment Recorded!</div>
                  <div className="text-[11px] text-[#696574]">
                    Updated dashboard balances, charts, and payment table.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t-2 border-[#050505] bg-[#F2F0F7] space-y-2">
            <button
              onClick={handleExecute}
              disabled={isProcessing || parsedBaseUnits <= 0n}
              className="w-full py-3 px-4 rounded-[4px] bg-[#E8FF00] text-[#050505] font-display font-black text-sm uppercase flex items-center justify-center gap-2 neo-btn tracking-wider hover:bg-yellow-300 disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Routing to Vaults...</span>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>EXECUTE SPLIT PAYMENT</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-1 font-mono text-xs">
              {showConfirmReset ? (
                <div className="flex items-center gap-2 w-full justify-between">
                  <span className="text-[11px] text-[#F2677A] font-bold">Reset state?</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowConfirmReset(false)}
                      className="text-[11px] px-2 py-0.5 rounded bg-white border border-[#050505]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReset}
                      className="text-[11px] px-2 py-0.5 rounded bg-[#F2677A] text-white font-bold"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="flex items-center gap-1 text-[11px] text-[#696574] hover:text-[#050505] transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Seed Data</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
