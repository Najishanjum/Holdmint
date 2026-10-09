"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Wallet,
  Sliders,
  Lock,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
} from "lucide-react";
import { useVault } from "@/lib/store/vault-store";
import { DEMO_PAYEE_PUBKEY } from "@/lib/demo/seed-data";
import { formatUSDC, parseUSDC, truncateAddress } from "@/lib/utils/format-usdc";

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, proposeRules, applyRules, proposePayee, applyPayee } = useVault();

  const [step, setStep] = useState(1);
  const [spendPercent, setSpendPercent] = useState(70);
  const [taxPercent, setTaxPercent] = useState(25);
  const [savingsPercent, setSavingsPercent] = useState(5);
  const [payeeAddress, setPayeeAddress] = useState(DEMO_PAYEE_PUBKEY);
  const [lockDays, setLockDays] = useState(90);
  const [isActivating, setIsActivating] = useState(false);

  const presets = [
    { name: "Balanced", spend: 70, tax: 25, savings: 5 },
    { name: "Tax First", spend: 60, tax: 35, savings: 5 },
    { name: "Aggressive Savings", spend: 60, tax: 25, savings: 15 },
  ];

  const totalPercent = spendPercent + taxPercent + savingsPercent;
  const isValidSplit = totalPercent === 100 && taxPercent >= 5;

  const handleApplyPreset = (p: { spend: number; tax: number; savings: number }) => {
    setSpendPercent(p.spend);
    setTaxPercent(p.tax);
    setSavingsPercent(p.savings);
  };

  const handleFinish = () => {
    setIsActivating(true);
    setTimeout(() => {
      // Apply configured split and payee
      proposeRules(spendPercent * 100, taxPercent * 100, savingsPercent * 100);
      applyRules();
      if (payeeAddress) {
        proposePayee(payeeAddress);
        applyPayee();
      }
      setIsActivating(false);
      router.push("/app");
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      {/* Progress Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-muted mb-2 font-medium">
          <span>Step {step} of 6</span>
          <span className="font-mono">{Math.round((step / 6) * 100)}% Complete</span>
        </div>
        <div className="w-full h-1.5 bg-surface-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-spend transition-all duration-300 rounded-full"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-surface rounded-card border border-border p-6 md:p-8 shadow-sm">
        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="px-2.5 py-1 rounded text-xs font-semibold bg-spend/15 text-spend border border-spend/30">
                Welcome to Tax Vault
              </span>
              <h2 className="text-2xl font-bold text-primary">
                Automated Solana Income Routing for Freelancers
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                Tax Vault deploys a set of program-derived token accounts (PDAs) on Solana that automatically separate incoming USDC into three dedicated vaults: Spend, Tax, and Savings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-spend/15 text-spend flex items-center justify-center font-bold">
                  1
                </div>
                <div className="text-sm font-semibold text-primary">Earn Freely</div>
                <p className="text-xs text-muted">
                  Spend vault funds remain liquid for operational business cashflow.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-tax/15 text-tax flex items-center justify-center font-bold">
                  2
                </div>
                <div className="text-sm font-semibold text-primary">Protect Taxes</div>
                <p className="text-xs text-muted">
                  Tax vault can only be released to your approved tax payee.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-savings/15 text-savings flex items-center justify-center font-bold">
                  3
                </div>
                <div className="text-sm font-semibold text-primary">Save Automatically</div>
                <p className="text-xs text-muted">
                  Time-lock savings to build treasury reserves effortlessly.
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-spend hover:bg-spend/90 text-black font-semibold text-sm flex items-center gap-2 transition-all shadow-md shadow-spend/10"
              >
                <span>Create My Vault</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Connect Wallet */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-primary">Connect Worker Wallet</h2>
              <p className="text-xs text-muted mt-1">
                Your wallet controls vault authority and permission configurations. Non-custodial.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Network:</span>
                <span className="text-spend font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-spend" />
                  Solana Devnet
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Connected Authority:</span>
                <span className="font-mono text-primary font-medium">
                  {truncateAddress(profile.owner, 6)}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-tax/10 border border-tax/30 text-xs text-tax flex items-start gap-2.5">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Devnet simulated mode is active. In production, connect any Wallet Standard Solana wallet (Phantom, Solflare, Backpack).
              </span>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl border border-border text-muted hover:text-primary text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-spend text-black font-semibold text-xs flex items-center gap-1.5"
              >
                <span>Continue to Split Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Choose Your Split */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-primary">Configure Income Split</h2>
              <p className="text-xs text-muted mt-1">
                Choose how future incoming USDC payments are distributed. Must total 100%.
              </p>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-2">
              {presets.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="p-3 rounded-xl bg-surface-elevated hover:bg-border border border-border text-left transition-all"
                >
                  <div className="text-xs font-semibold text-primary">{p.name}</div>
                  <div className="text-[11px] text-muted font-mono mt-0.5">
                    {p.spend}% / {p.tax}% / {p.savings}%
                  </div>
                </button>
              ))}
            </div>

            {/* Percentage Sliders */}
            <div className="space-y-4 pt-2">
              {/* Spend */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-spend">Spend Vault (Liquid)</span>
                  <span className="font-mono font-bold text-primary">{spendPercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={spendPercent}
                  onChange={(e) => setSpendPercent(Number(e.target.value))}
                  className="w-full accent-spend h-1.5 rounded-lg bg-surface-elevated"
                />
              </div>

              {/* Tax */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-tax">Tax Vault (Locked to Payee)</span>
                  <span className="font-mono font-bold text-primary">{taxPercent}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value))}
                  className="w-full accent-tax h-1.5 rounded-lg bg-surface-elevated"
                />
              </div>

              {/* Savings */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-savings">Savings Vault (Time-locked)</span>
                  <span className="font-mono font-bold text-primary">{savingsPercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={savingsPercent}
                  onChange={(e) => setSavingsPercent(Number(e.target.value))}
                  className="w-full accent-savings h-1.5 rounded-lg bg-surface-elevated"
                />
              </div>
            </div>

            {/* Calculation Projections Table */}
            <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-2">
              <span className="text-xs font-semibold text-primary block">
                Sample Calculations (Estimate, not tax advice)
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded bg-surface border border-border">
                  <span className="text-muted block text-[10px]">$100 Payment</span>
                  <div className="text-[11px] font-mono mt-1">
                    <span className="text-spend">${(100 * spendPercent) / 100}</span> /{" "}
                    <span className="text-tax">${(100 * taxPercent) / 100}</span> /{" "}
                    <span className="text-savings">${(100 * savingsPercent) / 100}</span>
                  </div>
                </div>

                <div className="p-2 rounded bg-surface border border-border">
                  <span className="text-muted block text-[10px]">$1,000 Payment</span>
                  <div className="text-[11px] font-mono mt-1">
                    <span className="text-spend">${(1000 * spendPercent) / 100}</span> /{" "}
                    <span className="text-tax">${(1000 * taxPercent) / 100}</span> /{" "}
                    <span className="text-savings">${(1000 * savingsPercent) / 100}</span>
                  </div>
                </div>

                <div className="p-2 rounded bg-surface border border-border">
                  <span className="text-muted block text-[10px]">$5,000 Payment</span>
                  <div className="text-[11px] font-mono mt-1">
                    <span className="text-spend">${(5000 * spendPercent) / 100}</span> /{" "}
                    <span className="text-tax">${(5000 * taxPercent) / 100}</span> /{" "}
                    <span className="text-savings">${(5000 * savingsPercent) / 100}</span>
                  </div>
                </div>
              </div>
            </div>

            {!isValidSplit && (
              <p className="text-xs text-danger">
                Allocations must sum to 100% (currently {totalPercent}%) and Tax must be at least 5%.
              </p>
            )}

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl border border-border text-muted hover:text-primary text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                disabled={!isValidSplit}
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-xl bg-spend text-black font-semibold text-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>Continue to Payee Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Approve Tax Payee */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-primary">Approve Tax Payee Address</h2>
              <p className="text-xs text-muted mt-1">
                Tax vault funds can only be released to this destination address. Any other withdrawal is rejected on-chain.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted uppercase block">
                Solana Public Key (Approved Payee)
              </label>
              <input
                type="text"
                value={payeeAddress}
                onChange={(e) => setPayeeAddress(e.target.value)}
                placeholder="Solana address for tax accountant / escrow / designated payee..."
                className="w-full bg-surface-elevated border border-border rounded-xl px-3 py-2.5 text-xs font-mono text-primary focus:outline-none focus:border-tax"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-surface-elevated border border-border text-xs text-muted space-y-1.5">
              <div className="flex items-center gap-1.5 text-tax font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Security Delay Safeguard</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Changes to the approved tax payee require a 72-hour timelock delay before becoming active, preventing sudden redirection of tax funds.
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2.5 rounded-xl border border-border text-muted hover:text-primary text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                disabled={!payeeAddress}
                onClick={() => setStep(5)}
                className="px-6 py-2.5 rounded-xl bg-spend text-black font-semibold text-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>Continue to Savings Lock</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Savings Lock */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-primary">Savings Vault Time-Lock</h2>
              <p className="text-xs text-muted mt-1">
                Choose the lock period for funds routed into your Savings vault.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[30, 90, 180].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setLockDays(days)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    lockDays === days
                      ? "bg-savings/15 text-savings border-savings font-bold"
                      : "bg-surface-elevated text-muted border-border hover:text-primary"
                  }`}
                >
                  <Clock className="w-5 h-5 mx-auto mb-1.5 opacity-80" />
                  <div className="text-sm font-semibold">{days} Days</div>
                  <div className="text-[11px] opacity-70">
                    {days === 90 ? "Recommended" : `${days / 30} months`}
                  </div>
                </button>
              ))}
            </div>

            <p className="text-xs text-muted">
              Withdrawals from the Savings Vault prior to the unlock timestamp are prohibited by smart contract rules.
            </p>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(4)}
                className="px-4 py-2.5 rounded-xl border border-border text-muted hover:text-primary text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(6)}
                className="px-6 py-2.5 rounded-xl bg-spend text-black font-semibold text-xs flex items-center gap-1.5"
              >
                <span>Review & Activate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Review and Activate */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-primary">Review & Activate Tax Vault</h2>
              <p className="text-xs text-muted mt-1">
                Review your configuration before activating your non-custodial Solana vault profile.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted">Network:</span>
                <span className="text-primary font-semibold">Solana Devnet</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted">Active Split Ratio:</span>
                <span className="font-mono font-bold text-spend">
                  {spendPercent}% Spend / {taxPercent}% Tax / {savingsPercent}% Savings
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted">Approved Tax Payee:</span>
                <span className="font-mono text-primary">{truncateAddress(payeeAddress, 6)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted">Savings Lock Duration:</span>
                <span className="font-semibold text-savings">{lockDays} Days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted">Token Currency:</span>
                <span className="font-semibold text-primary">USDC (6 Decimals)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-elevated border border-border text-xs text-muted leading-relaxed">
              Estimate, not tax advice · Non-custodial · Unaudited devnet program. You maintain complete wallet ownership.
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(5)}
                className="px-4 py-2.5 rounded-xl border border-border text-muted hover:text-primary text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                disabled={isActivating}
                onClick={handleFinish}
                className="px-8 py-3 rounded-xl bg-spend hover:bg-spend/90 text-black font-semibold text-sm flex items-center gap-2 transition-all shadow-md shadow-spend/10"
              >
                {isActivating ? (
                  <span>Activating on Devnet...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Activate My Vault Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
