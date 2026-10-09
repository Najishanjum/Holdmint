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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface border-l border-border shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-tax/15 text-tax">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-primary">Live Split Simulator</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-tax/20 text-tax border border-tax/30">
                    Mock USDC
                  </span>
                  <span className="text-xs text-muted">Devnet Simulation</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsDemoDrawerOpen(false)}
              className="p-1.5 rounded-lg hover:bg-surface-elevated text-muted hover:text-primary transition-colors"
              aria-label="Close demo drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Split Presets notice */}
            <div className="p-3.5 rounded-xl bg-surface-elevated border border-border text-xs text-muted flex items-center justify-between">
              <div>
                <span className="text-primary font-medium">Active Worker Split: </span>
                <span>
                  {profile.spendBps / 100}% Spend · {profile.taxBps / 100}% Tax · {profile.savingsBps / 100}% Savings
                </span>
              </div>
            </div>

            {/* Quick Amounts */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted uppercase tracking-wider">
                Simulated Payment Amount
              </label>
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmountStr(amt)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      amountStr === amt
                        ? "bg-spend/15 text-spend border-spend"
                        : "bg-surface-elevated text-muted border-border hover:text-primary"
                    }`}
                  >
                    ${amt.split(".")[0]}
                  </button>
                ))}
              </div>
              <div className="relative mt-2">
                <span className="absolute left-3 top-2.5 text-muted text-sm font-semibold">$</span>
                <input
                  type="text"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  placeholder="1000.00"
                  className="w-full bg-surface-elevated border border-border rounded-xl pl-8 pr-4 py-2 text-sm font-mono text-primary focus:outline-none focus:border-spend"
                />
              </div>
            </div>

            {/* Payer Details */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted uppercase tracking-wider block mb-1">
                  Demo Client Payer
                </label>
                <select
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  className="w-full bg-surface-elevated border border-border rounded-xl px-3 py-2 text-sm text-primary focus:outline-none focus:border-spend"
                >
                  <option value="Acme Studio">Acme Studio (Design Agency)</option>
                  <option value="Northstar Labs">Northstar Labs (Web3 Studio)</option>
                  <option value="Pixel Works">Pixel Works (Product Team)</option>
                  <option value="DevCraft Inc.">DevCraft Inc. (Enterprise Client)</option>
                  <option value="Custom Payer">Custom Client</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted uppercase tracking-wider block mb-1">
                  Invoice Memo
                </label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full bg-surface-elevated border border-border rounded-xl px-3 py-2 text-sm text-primary focus:outline-none focus:border-spend"
                />
              </div>
            </div>

            {/* Live Split Preview Box */}
            <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-primary">
                <span>Split Projection</span>
                <span className="text-muted font-normal">Integer Base Units (6 decimals)</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-spend" />
                    <span className="text-muted">Spend ({previewSplit.spendBps / 100}%)</span>
                  </div>
                  <span className="font-mono font-semibold text-spend">
                    {formatUSDC(previewSplit.spendAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-tax" />
                    <span className="text-muted">Tax Vault ({previewSplit.taxBps / 100}%)</span>
                  </div>
                  <span className="font-mono font-semibold text-tax">
                    {formatUSDC(previewSplit.taxAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-savings" />
                    <span className="text-muted">Savings Vault ({previewSplit.savingsBps / 100}%)</span>
                  </div>
                  <span className="font-mono font-semibold text-savings">
                    {formatUSDC(previewSplit.savingsAmount)}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted font-mono">
                <span>Total Gross:</span>
                <span className="font-semibold text-primary">{formatUSDC(previewSplit.grossAmount)}</span>
              </div>
            </div>

            {/* Success state if payment just triggered */}
            {lastSplit && (
              <div className="p-3.5 rounded-xl bg-spend/10 border border-spend/30 flex items-start gap-2.5 text-xs text-spend animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Simulated Payment Recorded!</div>
                  <div className="text-[11px] text-spend/80 mt-0.5">
                    Updated dashboard balances, income timeline, and recent transaction history.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t border-border bg-surface-elevated/50 space-y-3">
            <button
              onClick={handleExecute}
              disabled={isProcessing || parsedBaseUnits <= 0n}
              className="w-full py-3 px-4 rounded-xl bg-spend hover:bg-spend/90 text-black font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-spend/10 disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Routing to Vaults...</span>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Execute Split Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-1">
              {showConfirmReset ? (
                <div className="flex items-center gap-2 w-full justify-between">
                  <span className="text-xs text-danger font-medium">Reset all demo state?</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowConfirmReset(false)}
                      className="text-xs px-2.5 py-1 rounded bg-surface border border-border text-muted hover:text-primary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReset}
                      className="text-xs px-2.5 py-1 rounded bg-danger text-white font-medium hover:bg-danger/90"
                    >
                      Confirm Reset
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="flex items-center gap-1.5 text-xs text-muted hover:text-danger transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Data to Initial Seeds</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
