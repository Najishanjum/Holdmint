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
    { name: "BALANCED (RECOMMENDED)", spend: 70, tax: 25, savings: 5 },
    { name: "TAX FIRST SAFEGUARD", spend: 60, tax: 35, savings: 5 },
    { name: "AGGRESSIVE SAVINGS", spend: 60, tax: 25, savings: 15 },
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
        text: "Rule proposal submitted! 24-hour cooldown timelock is running before activation.",
      });
    } else {
      setProposeMsg({ type: "error", text: res.error || "Proposal failed." });
    }
  };

  return (
    <div className="space-y-6">
      <PendingRuleBanner />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-[#050505] gap-2">
        <div>
          <h2 className="font-display font-black text-2xl uppercase tracking-tight text-white">
            SPLIT RULES & TIMELOCK GOVERNANCE
          </h2>
          <p className="text-xs text-[#B8B5C5] font-sans">
            Worker-controlled income distribution formulas with timelock protection
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Technical Settings Console */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white text-[#050505] rounded-[6px] border-2 border-[#050505] neo-shadow overflow-hidden">
            <div className="bg-[#050505] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-[#050505]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E8FF00] inline-block" />
                <h3 className="font-display font-black text-xs uppercase tracking-wider text-white">
                  RATIO CONFIGURATION CONSOLE
                </h3>
              </div>
              <span className="font-mono text-[10px] text-[#E8FF00] font-bold">10,000 BPS SUM</span>
            </div>

            <div className="p-6 space-y-6 font-mono text-xs">
              {/* Presets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-display">
                {presets.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setSpendPercent(p.spend);
                      setTaxPercent(p.tax);
                      setSavingsPercent(p.savings);
                    }}
                    className="p-3 rounded-[4px] bg-[#F2F0F7] hover:bg-[#E8FF00] border-2 border-[#050505] text-left transition-all text-xs font-bold"
                  >
                    <div className="font-black text-[#050505]">{p.name}</div>
                    <div className="font-mono text-[#696574] text-[10px] mt-0.5">
                      {p.spend}% / {p.tax}% / {p.savings}%
                    </div>
                  </button>
                ))}
              </div>

              {/* Sliders */}
              <div className="space-y-5 pt-2">
                {/* Spend */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-[#050505] font-display font-black text-sm uppercase">
                      Spend Allocation (Liquid)
                    </span>
                    <div className="flex items-center gap-1 font-mono">
                      <input
                        type="number"
                        value={spendPercent}
                        onChange={(e) => setSpendPercent(Number(e.target.value))}
                        className="w-16 px-2 py-1 rounded bg-[#F2F0F7] border border-[#050505] text-xs font-bold text-[#050505] text-right"
                      />
                      <span>%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={spendPercent}
                    onChange={(e) => setSpendPercent(Number(e.target.value))}
                    className="w-full accent-[#21D99B] h-2 rounded bg-[#F2F0F7] cursor-pointer border border-[#050505]"
                  />
                </div>

                {/* Tax */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-[#050505] font-display font-black text-sm uppercase">
                      Tax Allocation (Locked to Payee)
                    </span>
                    <div className="flex items-center gap-1 font-mono">
                      <input
                        type="number"
                        value={taxPercent}
                        onChange={(e) => setTaxPercent(Number(e.target.value))}
                        className="w-16 px-2 py-1 rounded bg-[#F2F0F7] border border-[#050505] text-xs font-bold text-[#050505] text-right"
                      />
                      <span>%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(Number(e.target.value))}
                    className="w-full accent-[#FFBD45] h-2 rounded bg-[#F2F0F7] cursor-pointer border border-[#050505]"
                  />
                </div>

                {/* Savings */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-[#050505] font-display font-black text-sm uppercase">
                      Savings Allocation (Time-Locked)
                    </span>
                    <div className="flex items-center gap-1 font-mono">
                      <input
                        type="number"
                        value={savingsPercent}
                        onChange={(e) => setSavingsPercent(Number(e.target.value))}
                        className="w-16 px-2 py-1 rounded bg-[#F2F0F7] border border-[#050505] text-xs font-bold text-[#050505] text-right"
                      />
                      <span>%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={savingsPercent}
                    onChange={(e) => setSavingsPercent(Number(e.target.value))}
                    className="w-full accent-[#8790FF] h-2 rounded bg-[#F2F0F7] cursor-pointer border border-[#050505]"
                  />
                </div>
              </div>

              {/* Sum Status */}
              <div className="flex items-center justify-between p-3 rounded-[4px] bg-[#F2F0F7] border border-[#050505]">
                <span className="text-[#696574] font-bold">Total Basis Points Sum:</span>
                <span
                  className={`font-black ${
                    isValid ? "text-[#050505]" : "text-[#F2677A]"
                  }`}
                >
                  {totalPercent}% {isValid ? "(Valid: 10,000 bps)" : "(Must equal 100%)"}
                </span>
              </div>

              <div className="p-3 rounded-[4px] bg-[#E8FF00] border-2 border-[#050505] text-[#050505] flex items-start gap-2 leading-relaxed">
                <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Rule changes require a 24-hour timelock cooldown. Active percentages remain in effect until the cooldown has elapsed.
                </span>
              </div>

              {proposeMsg && (
                <div
                  className={`p-3.5 rounded-[4px] border-2 border-[#050505] flex items-center gap-2 ${
                    proposeMsg.type === "success"
                      ? "bg-[#21D99B]/20 text-[#050505]"
                      : "bg-[#F2677A]/20 text-[#F2677A]"
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
                className="w-full py-3 rounded-[4px] bg-[#5919F6] text-white font-display font-black text-xs uppercase neo-btn tracking-wider hover:bg-[#6C2BFF] disabled:opacity-40"
              >
                PROPOSE RULE SPLIT UPDATE (24H COOLDOWN)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Precision Calculator */}
        <div className="space-y-6 font-mono">
          <div className="bg-white text-[#050505] rounded-[6px] border-2 border-[#050505] neo-shadow overflow-hidden">
            <div className="bg-[#050505] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-[#050505]">
              <span className="font-display font-black text-xs uppercase tracking-wider text-white">
                PRECISION SPLIT TESTER
              </span>
              <span className="text-[10px] text-[#A1A1AA]">6-DECIMAL INTEGER</span>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-bold text-[#696574] uppercase block mb-1">
                  Test Payment Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-[#050505] text-sm font-bold">$</span>
                  <input
                    type="text"
                    value={testAmountStr}
                    onChange={(e) => setTestAmountStr(e.target.value)}
                    className="w-full bg-[#F2F0F7] border-2 border-[#050505] rounded-[4px] pl-8 pr-3 py-2 text-sm font-bold text-[#050505] focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-[4px] bg-[#F2F0F7] border border-[#050505] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#696574]">Spend Allocation:</span>
                  <span className="font-black text-[#050505]">{formatUSDC(testSplit.spendAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#696574]">Tax Vault (Locked):</span>
                  <span className="font-black text-[#050505]">{formatUSDC(testSplit.taxAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#696574]">Savings Vault:</span>
                  <span className="font-black text-[#050505]">{formatUSDC(testSplit.savingsAmount)}</span>
                </div>
                <div className="pt-2 border-t border-[#050505] flex justify-between items-center text-[10px] text-[#696574]">
                  <span>Base Units:</span>
                  <span>{testSplit.grossAmount.toString()} units</span>
                </div>
              </div>

              <div className="text-[11px] text-[#696574] leading-relaxed">
                Rounding Invariant: Division remainders are awarded to Spend so that{" "}
                <code className="text-[#050505] font-bold">spend + tax + savings == gross</code> is preserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
