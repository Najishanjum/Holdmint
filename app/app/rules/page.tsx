"use client";

import React, { useState } from "react";
import { Sliders, Clock, AlertTriangle, CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { useVault } from "@/lib/store/vault-store";
import { calculateSplit, formatUSDC, parseUSDC } from "@/lib/utils/format-usdc";
import { PendingRuleBanner } from "@/components/PendingRuleBanner";

export default function RulesPage() {
  const { profile, proposeRules, applyRules } = useVault();

  const [spendPercent, setSpendPercent] = useState(profile.spendBps / 100);
  const [taxPercent, setTaxPercent] = useState(profile.taxBps / 100);
  const [savingsPercent, setSavingsPercent] = useState(profile.savingsBps / 100);
  const [testAmountStr, setTestAmountStr] = useState("1000.00");
  const [proposeMsg, setProposeMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const presets = [
    { name: "Balanced (Recommended)", spend: 70, tax: 25, savings: 5 },
    { name: "Tax First Safeguard", spend: 60, tax: 35, savings: 5 },
    { name: "Aggressive Savings", spend: 60, tax: 25, savings: 15 },
  ];

  const totalPercent = spendPercent + taxPercent + savingsPercent;
  const isValid = totalPercent === 100 && taxPercent >= 5;

  const testBaseUnits = parseUSDC(testAmountStr);
  const testSplit = calculateSplit(testBaseUnits, taxPercent * 100, savingsPercent * 100);

  const handlePropose = () => {
    setProposeMsg(null);
    if (!isValid) return;
    const res = proposeRules(spendPercent * 100, taxPercent * 100, savingsPercent * 100);
    if (res.success) {
      setProposeMsg({
        type: "success",
        text: "Rule proposal submitted! 24-hour cooldown timelock is now running before activation.",
      });
    } else {
      setProposeMsg({ type: "error", text: res.error || "Proposal failed." });
    }
  };

  return (
    <div className="space-y-6">
      <PendingRuleBanner />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
        <div>
          <h2 className="text-xl font-bold text-primary">Split Rules & Timelock Governance</h2>
          <p className="text-xs text-muted mt-0.5">
            Worker-controlled income distribution formulas with timelock protection
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sliders & Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-card border border-border p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-primary">Configure Split Percentages</h3>
              <p className="text-xs text-muted mt-0.5">
                All values must sum to 100.00%. Tax must meet the minimum 5% safeguard.
              </p>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {presets.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setSpendPercent(p.spend);
                    setTaxPercent(p.tax);
                    setSavingsPercent(p.savings);
                  }}
                  className="p-3 rounded-xl bg-surface-elevated hover:bg-border border border-border text-left transition-all text-xs"
                >
                  <div className="font-semibold text-primary">{p.name}</div>
                  <div className="font-mono text-muted text-[11px] mt-0.5">
                    {p.spend}% / {p.tax}% / {p.savings}%
                  </div>
                </button>
              ))}
            </div>

            {/* Sliders */}
            <div className="space-y-5 pt-2">
              {/* Spend */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-spend">Spend Allocation</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={spendPercent}
                      onChange={(e) => setSpendPercent(Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded bg-surface-elevated border border-border text-xs font-mono text-primary text-right"
                    />
                    <span className="text-muted">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={spendPercent}
                  onChange={(e) => setSpendPercent(Number(e.target.value))}
                  className="w-full accent-spend h-2 rounded bg-surface-elevated cursor-pointer"
                />
              </div>

              {/* Tax */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-tax">Tax Allocation (Locked)</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={taxPercent}
                      onChange={(e) => setTaxPercent(Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded bg-surface-elevated border border-border text-xs font-mono text-primary text-right"
                    />
                    <span className="text-muted">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value))}
                  className="w-full accent-tax h-2 rounded bg-surface-elevated cursor-pointer"
                />
              </div>

              {/* Savings */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-savings">Savings Allocation</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={savingsPercent}
                      onChange={(e) => setSavingsPercent(Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded bg-surface-elevated border border-border text-xs font-mono text-primary text-right"
                    />
                    <span className="text-muted">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={savingsPercent}
                  onChange={(e) => setSavingsPercent(Number(e.target.value))}
                  className="w-full accent-savings h-2 rounded bg-surface-elevated cursor-pointer"
                />
              </div>
            </div>

            {/* Sum validation status */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated border border-border text-xs">
              <span className="text-muted">Total Basis Points Sum:</span>
              <span
                className={`font-mono font-bold ${
                  isValid ? "text-spend" : "text-danger"
                }`}
              >
                {totalPercent}% {isValid ? "(Valid: 10,000 bps)" : "(Must equal 100%)"}
              </span>
            </div>

            {/* Notice about delayed cooldown */}
            <div className="p-3.5 rounded-xl bg-surface-elevated border border-border text-xs text-muted flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-tax shrink-0 mt-0.5" />
              <span>
                To prevent accidental or impulsive reductions of tax reserves, rule changes are subjected to a 24-hour smart-contract cooldown. Active rules remain in effect until the cooldown passes and you confirm application.
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
              disabled={!isValid}
              onClick={handlePropose}
              className="w-full py-3 rounded-xl bg-spend hover:bg-spend/90 text-black font-semibold text-xs transition-all disabled:opacity-40"
            >
              Propose Rule Split Update (24h Cooldown)
            </button>
          </div>
        </div>

        {/* Right Col: Live Base-Unit Split Calculator */}
        <div className="space-y-6">
          <div className="bg-surface rounded-card border border-border p-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-primary">Precision Split Tester</h3>
              <p className="text-xs text-muted mt-0.5">
                Simulate rounding and 6-decimal integer base units
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-muted uppercase block mb-1">
                Test Payment Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted text-sm font-semibold">$</span>
                <input
                  type="text"
                  value={testAmountStr}
                  onChange={(e) => setTestAmountStr(e.target.value)}
                  className="w-full bg-surface-elevated border border-border rounded-xl pl-8 pr-3 py-2 text-sm font-mono text-primary focus:outline-none focus:border-spend"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted">Spend Allocation:</span>
                <span className="font-mono font-bold text-spend">
                  {formatUSDC(testSplit.spendAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted">Tax Vault (Locked):</span>
                <span className="font-mono font-bold text-tax">
                  {formatUSDC(testSplit.taxAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted">Savings Vault:</span>
                <span className="font-mono font-bold text-savings">
                  {formatUSDC(testSplit.savingsAmount)}
                </span>
              </div>
              <div className="pt-2 border-t border-border flex justify-between items-center text-[11px] text-muted font-mono">
                <span>Base Units:</span>
                <span>{testSplit.grossAmount.toString()} units</span>
              </div>
            </div>

            <div className="text-[11px] text-muted leading-relaxed">
              Rounding Invariant: Any integer remainder is strictly allocated to the Spend vault so that{" "}
              <code className="text-primary font-mono">spend + tax + savings == amount</code> is always satisfied.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
