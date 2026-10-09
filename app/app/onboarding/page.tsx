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
  Layers,
  Terminal,
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
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      {/* Progress Stepper */}
      <div className="bg-[#050505] neo-border neo-shadow p-4">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-white font-bold uppercase tracking-wider">
            ONBOARDING PROTOCOL // STEP {step} OF 6
          </span>
          <span className="text-[#E8FF00] font-black">{Math.round((step / 6) * 100)}% COMPLETE</span>
        </div>
        <div className="w-full h-3 bg-white/20 neo-border overflow-hidden">
          <div
            className="h-full bg-[#E8FF00] transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white neo-border neo-shadow">
        {/* Step 1: Welcome */}
        {step === 1 && (
          <div>
            <div className="bg-[#050505] text-white px-5 py-3 flex items-center justify-between border-b-2 border-black font-mono text-xs">
              <span className="text-[#E8FF00] font-bold uppercase tracking-wider">INIT 01 // WELCOME</span>
              <span className="text-white/60">NON-CUSTODIAL ENGINE</span>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <span className="px-2.5 py-1 bg-[#E8FF00] text-black font-mono text-xs font-black uppercase neo-border inline-block">
                  TAX VAULT PROTOCOL
                </span>
                <h2 className="font-display text-3xl font-black uppercase tracking-tight text-black">
                  Automated Solana Income Routing for Freelancers
                </h2>
                <p className="text-xs font-mono text-black/80 leading-relaxed">
                  Tax Vault deploys a set of program-derived token accounts (PDAs) on Solana that automatically separate incoming USDC into three dedicated vaults: Spend, Tax, and Savings.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-[#F2F0F7] neo-border space-y-2">
                  <div className="w-8 h-8 bg-black text-[#21D99B] font-mono font-black text-sm flex items-center justify-center neo-border">
                    01
                  </div>
                  <div className="font-display text-lg font-black uppercase text-black">Earn Freely</div>
                  <p className="text-xs font-mono text-black/70">
                    Spend vault funds remain liquid for operational business cashflow.
                  </p>
                </div>

                <div className="p-4 bg-[#F2F0F7] neo-border space-y-2">
                  <div className="w-8 h-8 bg-black text-[#FFBD45] font-mono font-black text-sm flex items-center justify-center neo-border">
                    02
                  </div>
                  <div className="font-display text-lg font-black uppercase text-black">Protect Taxes</div>
                  <p className="text-xs font-mono text-black/70">
                    Tax vault can only be released to your approved tax payee PDA.
                  </p>
                </div>

                <div className="p-4 bg-[#F2F0F7] neo-border space-y-2">
                  <div className="w-8 h-8 bg-black text-[#5919F6] font-mono font-black text-sm flex items-center justify-center neo-border">
                    03
                  </div>
                  <div className="font-display text-lg font-black uppercase text-black">Save Automatically</div>
                  <p className="text-xs font-mono text-black/70">
                    Time-lock savings to build treasury reserves effortlessly.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="neo-btn px-6 py-3 bg-[#E8FF00] hover:bg-[#d8ed00] text-black font-mono font-black text-xs uppercase tracking-wider neo-border neo-shadow flex items-center gap-2"
                >
                  <span>Create My Vault</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Connect Wallet */}
        {step === 2 && (
          <div>
            <div className="bg-[#050505] text-white px-5 py-3 flex items-center justify-between border-b-2 border-black font-mono text-xs">
              <span className="text-[#E8FF00] font-bold uppercase tracking-wider">INIT 02 // SIGNER AUTHORITY</span>
              <span className="text-white/60">PDA OWNER</span>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-black uppercase tracking-tight text-black">
                  Connect Worker Wallet
                </h2>
                <p className="text-xs font-mono text-black/70 mt-1">
                  Your wallet controls vault authority and permission configurations. Non-custodial.
                </p>
              </div>

              <div className="p-4 bg-[#F2F0F7] neo-border space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-black/60 font-bold uppercase">Network:</span>
                  <span className="text-black font-black flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#21D99B]" />
                    Solana Devnet
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-black/60 font-bold uppercase">Connected Authority:</span>
                  <span className="font-mono text-black font-black">
                    {truncateAddress(profile.owner, 8)}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[#E8FF00]/20 neo-border text-xs font-mono text-black flex items-start gap-2.5">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-black" />
                <span>
                  Devnet simulated mode is active. In production, connect any Wallet Standard Solana wallet (Phantom, Solflare, Backpack).
                </span>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 bg-[#F2F0F7] neo-border text-black font-mono font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-neutral-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="neo-btn px-6 py-2.5 bg-[#5919F6] text-white font-mono font-black text-xs uppercase tracking-wider neo-border neo-shadow flex items-center gap-1.5 hover:bg-[#4d13dd]"
                >
                  <span>Continue to Split Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Choose Your Split */}
        {step === 3 && (
          <div>
            <div className="bg-[#050505] text-white px-5 py-3 flex items-center justify-between border-b-2 border-black font-mono text-xs">
              <span className="text-[#E8FF00] font-bold uppercase tracking-wider">INIT 03 // SPLIT ALLOCATION</span>
              <span className="text-white/60">6-DECIMAL PRECISION</span>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-black uppercase tracking-tight text-black">
                  Configure Income Split Ratios
                </h2>
                <p className="text-xs font-mono text-black/70 mt-1">
                  Choose how future incoming USDC payments are distributed. Must total 100%.
                </p>
              </div>

              {/* Presets */}
              <div className="grid grid-cols-3 gap-3">
                {presets.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="p-3 bg-[#F2F0F7] hover:bg-[#E8FF00] neo-border text-left transition-all"
                  >
                    <div className="text-xs font-mono font-black uppercase text-black">{p.name}</div>
                    <div className="text-[11px] text-black/70 font-mono mt-0.5">
                      {p.spend}% / {p.tax}% / {p.savings}%
                    </div>
                  </button>
                ))}
              </div>

              {/* Percentage Sliders */}
              <div className="space-y-4 pt-2 font-mono">
                {/* Spend */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold uppercase text-[#050505]">Spend Vault (Liquid)</span>
                    <span className="font-black text-black">{spendPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={spendPercent}
                    onChange={(e) => setSpendPercent(Number(e.target.value))}
                    className="w-full accent-black h-2 rounded-none bg-neutral-200"
                  />
                </div>

                {/* Tax */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold uppercase text-[#FFBD45]">Tax Vault (Payee Bound)</span>
                    <span className="font-black text-[#FFBD45]">{taxPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(Number(e.target.value))}
                    className="w-full accent-[#FFBD45] h-2 rounded-none bg-neutral-200"
                  />
                </div>

                {/* Savings */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold uppercase text-[#5919F6]">Savings Vault (Timelocked)</span>
                    <span className="font-black text-[#5919F6]">{savingsPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={savingsPercent}
                    onChange={(e) => setSavingsPercent(Number(e.target.value))}
                    className="w-full accent-[#5919F6] h-2 rounded-none bg-neutral-200"
                  />
                </div>
              </div>

              {/* Calculation Projections Table */}
              <div className="p-4 bg-[#F2F0F7] neo-border space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-black block">
                  Simulated Split Projections (USDC)
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2.5 bg-white neo-border">
                    <span className="text-black/60 block text-[10px] font-bold">$100 Inflow</span>
                    <div className="text-[11px] font-black mt-1">
                      <span>${(100 * spendPercent) / 100}</span> /{" "}
                      <span className="text-[#FFBD45]">${(100 * taxPercent) / 100}</span> /{" "}
                      <span className="text-[#5919F6]">${(100 * savingsPercent) / 100}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white neo-border">
                    <span className="text-black/60 block text-[10px] font-bold">$1,000 Inflow</span>
                    <div className="text-[11px] font-black mt-1">
                      <span>${(1000 * spendPercent) / 100}</span> /{" "}
                      <span className="text-[#FFBD45]">${(1000 * taxPercent) / 100}</span> /{" "}
                      <span className="text-[#5919F6]">${(1000 * savingsPercent) / 100}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white neo-border">
                    <span className="text-black/60 block text-[10px] font-bold">$5,000 Inflow</span>
                    <div className="text-[11px] font-black mt-1">
                      <span>${(5000 * spendPercent) / 100}</span> /{" "}
                      <span className="text-[#FFBD45]">${(5000 * taxPercent) / 100}</span> /{" "}
                      <span className="text-[#5919F6]">${(5000 * savingsPercent) / 100}</span>
                    </div>
                  </div>
                </div>
              </div>

              {!isValidSplit && (
                <p className="text-xs font-mono font-bold text-[#F2677A] uppercase">
                  Allocations must sum to 100% (currently {totalPercent}%) and Tax must be at least 5%.
                </p>
              )}

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 bg-[#F2F0F7] neo-border text-black font-mono font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-neutral-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  disabled={!isValidSplit}
                  onClick={() => setStep(4)}
                  className="neo-btn px-6 py-2.5 bg-[#5919F6] text-white font-mono font-black text-xs uppercase tracking-wider neo-border neo-shadow flex items-center gap-1.5 hover:bg-[#4d13dd] disabled:opacity-50"
                >
                  <span>Continue to Payee Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Approve Tax Payee */}
        {step === 4 && (
          <div>
            <div className="bg-[#050505] text-white px-5 py-3 flex items-center justify-between border-b-2 border-black font-mono text-xs">
              <span className="text-[#E8FF00] font-bold uppercase tracking-wider">INIT 04 // TAX PAYEE RECIPIENT</span>
              <span className="text-white/60">PDA DESTINATION</span>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-black uppercase tracking-tight text-black">
                  Approve Tax Payee Address
                </h2>
                <p className="text-xs font-mono text-black/70 mt-1">
                  Tax vault funds can only be released to this destination address. Any other withdrawal is rejected on-chain.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-black uppercase block">
                  Solana Public Key (Approved Payee)
                </label>
                <input
                  type="text"
                  value={payeeAddress}
                  onChange={(e) => setPayeeAddress(e.target.value)}
                  placeholder="Solana address for tax accountant / escrow / designated payee..."
                  className="w-full bg-[#F2F0F7] neo-border px-3.5 py-3 text-xs font-mono text-black focus:outline-none focus:bg-white"
                />
              </div>

              <div className="p-4 bg-[#F2F0F7] neo-border text-xs font-mono text-black space-y-1.5">
                <div className="flex items-center gap-1.5 text-black font-bold uppercase">
                  <ShieldCheck className="w-4 h-4 text-[#21D99B]" />
                  <span>Security Delay Safeguard (72H Timelock)</span>
                </div>
                <p className="text-[11px] leading-relaxed text-black/80">
                  Subsequent changes to the approved tax payee require a 72-hour on-chain delay before becoming active, preventing unauthorized redirection of your tax reserves.
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 bg-[#F2F0F7] neo-border text-black font-mono font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-neutral-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  disabled={!payeeAddress}
                  onClick={() => setStep(5)}
                  className="neo-btn px-6 py-2.5 bg-[#5919F6] text-white font-mono font-black text-xs uppercase tracking-wider neo-border neo-shadow flex items-center gap-1.5 hover:bg-[#4d13dd] disabled:opacity-50"
                >
                  <span>Continue to Savings Lock</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Savings Lock */}
        {step === 5 && (
          <div>
            <div className="bg-[#050505] text-white px-5 py-3 flex items-center justify-between border-b-2 border-black font-mono text-xs">
              <span className="text-[#E8FF00] font-bold uppercase tracking-wider">INIT 05 // SAVINGS TIMELOCK</span>
              <span className="text-white/60">SMART LOCK</span>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-black uppercase tracking-tight text-black">
                  Savings Vault Time-Lock Duration
                </h2>
                <p className="text-xs font-mono text-black/70 mt-1">
                  Choose the lock period for funds routed into your Savings vault.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[30, 90, 180].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setLockDays(days)}
                    className={`p-4 neo-border text-center transition-all ${
                      lockDays === days
                        ? "bg-[#5919F6] text-white font-bold"
                        : "bg-[#F2F0F7] text-black hover:bg-[#E8FF00]"
                    }`}
                  >
                    <Clock className="w-5 h-5 mx-auto mb-1.5" />
                    <div className="font-display text-lg font-black uppercase">{days} Days</div>
                    <div className="text-[11px] font-mono opacity-80">
                      {days === 90 ? "RECOMMENDED" : `${days / 30} MONTHS`}
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-xs font-mono text-black/80">
                Withdrawals from the Savings Vault prior to the unlock timestamp are mathematically prohibited by smart contract instruction guards.
              </p>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(4)}
                  className="px-4 py-2.5 bg-[#F2F0F7] neo-border text-black font-mono font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-neutral-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setStep(6)}
                  className="neo-btn px-6 py-2.5 bg-[#5919F6] text-white font-mono font-black text-xs uppercase tracking-wider neo-border neo-shadow flex items-center gap-1.5 hover:bg-[#4d13dd]"
                >
                  <span>Review & Activate</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Review and Activate */}
        {step === 6 && (
          <div>
            <div className="bg-[#050505] text-white px-5 py-3 flex items-center justify-between border-b-2 border-black font-mono text-xs">
              <span className="text-[#E8FF00] font-bold uppercase tracking-wider">INIT 06 // CONFIRMATION</span>
              <span className="text-white/60">READY FOR ATTESTATION</span>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-black uppercase tracking-tight text-black">
                  Review & Deploy Tax Vault
                </h2>
                <p className="text-xs font-mono text-black/70 mt-1">
                  Review your parameters before activating your non-custodial Solana vault profile.
                </p>
              </div>

              <div className="p-5 bg-[#F2F0F7] neo-border space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-black/60 uppercase font-bold">Network:</span>
                  <span className="text-black font-black">Solana Devnet</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black/60 uppercase font-bold">Active Split Ratio:</span>
                  <span className="font-mono font-black text-black">
                    {spendPercent}% SPEND / {taxPercent}% TAX / {savingsPercent}% SAVINGS
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black/60 uppercase font-bold">Approved Tax Payee:</span>
                  <span className="font-mono font-bold text-black">{truncateAddress(payeeAddress, 8)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black/60 uppercase font-bold">Savings Lock Duration:</span>
                  <span className="font-black text-[#5919F6]">{lockDays} Days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-black/60 uppercase font-bold">Token Standard:</span>
                  <span className="font-black text-black">SPL-USDC (6 Decimals)</span>
                </div>
              </div>

              <div className="p-4 bg-white neo-border text-xs font-mono text-black/80 leading-relaxed">
                Estimate, not tax advice · Non-custodial · Unaudited devnet program. You maintain complete wallet ownership.
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(5)}
                  className="px-4 py-2.5 bg-[#F2F0F7] neo-border text-black font-mono font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-neutral-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  disabled={isActivating}
                  onClick={handleFinish}
                  className="neo-btn px-8 py-3.5 bg-[#E8FF00] hover:bg-[#d8ed00] text-black font-mono font-black text-xs uppercase tracking-wider neo-border neo-shadow flex items-center gap-2"
                >
                  {isActivating ? (
                    <span>Activating On Devnet...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Activate My Vault Profile</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
