"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Play,
  CheckCircle2,
  Lock,
  Unlock,
  Clock,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  Terminal,
} from "lucide-react";
import { useVault } from "@/lib/store/vault-store";
import { formatUSDC, parseUSDC } from "@/lib/utils/format-usdc";
import { TaxDisclaimer } from "@/components/TaxDisclaimer";

export default function DemoPage() {
  const {
    profile,
    balances,
    processPayment,
    withdrawSpend,
    releaseTax,
    resetDemoData,
  } = useVault();

  const [activeStep, setActiveStep] = useState(1);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [blockedAlert, setBlockedAlert] = useState<string | null>(null);
  const [successAlert, setSuccessAlert] = useState<string | null>(null);

  const addLog = (msg: string) => {
    setSimulationLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  const handleStep1Payment = () => {
    const res = processPayment(500_000_000n, "Acme Studio", "Demo $500 Payment");
    addLog("Processed $500.00 USDC payment from Acme Studio");
    addLog(`-> Spend: ${formatUSDC(res.split.spendAmount)} (70%)`);
    addLog(`-> Tax Vault: ${formatUSDC(res.split.taxAmount)} (25%) [LOCKED]`);
    addLog(`-> Savings Vault: ${formatUSDC(res.split.savingsAmount)} (5%)`);
    setSuccessAlert("Payment split completed! Notice balances updated.");
    setActiveStep(2);
  };

  const handleStep2Spend = () => {
    const res = withdrawSpend(200_000_000n); // Withdraw $200
    if (res.success) {
      addLog("Successfully withdrew $200.00 USDC from Spend Vault to worker wallet.");
      setSuccessAlert("Spend withdrawal succeeded without restriction.");
      setActiveStep(3);
    }
  };

  const handleStep3TaxAttack = () => {
    setBlockedAlert(null);
    setSuccessAlert(null);
    const fakePersonalWallet = "PersonalWalletAttack11111111111111111111111";
    const res = releaseTax(100_000_000n, fakePersonalWallet);
    if (!res.success) {
      setBlockedAlert(res.error || "Blocked!");
      addLog("ATTACK REJECTED: Program instruction prevented tax withdrawal to unapproved address!");
    }
  };

  const handleStep3TaxLegitimate = () => {
    setBlockedAlert(null);
    const res = releaseTax(100_000_000n, profile.taxPayee);
    if (res.success) {
      addLog(`SUCCESS: Released $100.00 USDC to approved payee: ${profile.taxPayee.slice(0, 4)}...`);
      setSuccessAlert("Tax release approved solely because destination matches approved payee!");
      setActiveStep(4);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex flex-col justify-between">
      {/* Header */}
      <header className="border-b-2 border-black bg-[#050505] px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:text-[#E8FF00] font-mono text-xs uppercase font-bold transition-colors">
          <ArrowLeft className="w-4 h-4 text-[#E8FF00]" />
          <span>BACK TO HOME</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 bg-[#E8FF00] text-black font-mono text-[10px] font-black uppercase neo-border">
            2-MIN PROTOCOL SANDBOX
          </span>
          <Link
            href="/app"
            className="neo-btn px-4 py-2 bg-[#5919F6] text-white font-mono font-black text-xs uppercase tracking-wider neo-border neo-shadow hover:bg-[#4d13dd]"
          >
            Launch Full App
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 flex-1 w-full">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-[#E8FF00] inline-block animate-pulse"></span>
            <span className="font-mono text-xs uppercase tracking-widest text-[#E8FF00]">
              INTERACTIVE DEVNET SANDBOX
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Protocol Live Sandbox
          </h1>
          <p className="font-mono text-xs text-white/60">
            Experience the three core principles of HoldMint: automatic splitting, liquid spend, and smart-contract protected tax release.
          </p>
        </div>

        {/* Live Vault Balance Ribbon */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white neo-border neo-shadow p-4 text-center border-t-4 border-t-[#21D99B]">
            <span className="font-mono text-[11px] text-black/60 uppercase font-bold block">Spend Vault</span>
            <span className="font-mono font-black text-xl sm:text-2xl text-black tnum">
              {formatUSDC(balances.spend)}
            </span>
          </div>
          <div className="bg-white neo-border neo-shadow p-4 text-center border-t-4 border-t-[#FFBD45]">
            <span className="font-mono text-[11px] text-[#FFBD45] uppercase font-bold block">Tax Vault (Locked)</span>
            <span className="font-mono font-black text-xl sm:text-2xl text-[#FFBD45] tnum">
              {formatUSDC(balances.tax)}
            </span>
          </div>
          <div className="bg-white neo-border neo-shadow p-4 text-center border-t-4 border-t-[#5919F6]">
            <span className="font-mono text-[11px] text-[#5919F6] uppercase font-bold block">Savings Vault</span>
            <span className="font-mono font-black text-xl sm:text-2xl text-[#5919F6] tnum">
              {formatUSDC(balances.savings)}
            </span>
          </div>
        </div>

        {/* Stepper Steps Card */}
        <div className="bg-white neo-border neo-shadow">
          <div className="bg-[#050505] text-white px-5 py-3 flex items-center justify-between border-b-2 border-black font-mono text-xs font-bold uppercase">
            <span>STEP-BY-STEP VERIFICATION CRON</span>
            <span className="text-[#E8FF00]">3 EXECUTABLE STAGES</span>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Step 1: Simulate $1,000 Inflow */}
            <div className="space-y-3 pb-6 border-b-2 border-black">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 bg-[#E8FF00] text-black font-mono font-black text-xs flex items-center justify-center neo-border">
                    1
                  </span>
                  <h3 className="font-display text-xl font-black uppercase tracking-tight text-black">
                    Simulate $500.00 USDC Payment Inflow
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-black/60 uppercase">Split: 70% / 25% / 5%</span>
              </div>
              <p className="text-xs font-mono text-black/80">
                Trigger a payment and watch the atomic math divide funds into Spend ($350), Tax ($125), and Savings ($25).
              </p>
              <button
                onClick={handleStep1Payment}
                className="neo-btn px-5 py-2.5 bg-[#E8FF00] hover:bg-[#d8ed00] text-black font-mono font-black text-xs uppercase tracking-wider neo-border neo-shadow flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate $500 Payment</span>
              </button>
            </div>

            {/* Step 2: Withdraw Liquid Spend */}
            <div className="space-y-3 pb-6 border-b-2 border-black">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 bg-black text-[#21D99B] font-mono font-black text-xs flex items-center justify-center neo-border">
                    2
                  </span>
                  <h3 className="font-display text-xl font-black uppercase tracking-tight text-black">
                    Withdraw Spend to Personal Wallet
                  </h3>
                </div>
                <span className="font-mono text-xs font-black text-[#21D99B] bg-black px-2 py-0.5 uppercase">
                  UNRESTRICTED
                </span>
              </div>
              <p className="text-xs font-mono text-black/80">
                Spend vault is completely liquid. Withdraw $200.00 USDC to worker wallet without delays.
              </p>
              <button
                onClick={handleStep2Spend}
                className="neo-btn px-5 py-2.5 bg-[#F2F0F7] hover:bg-neutral-200 text-black font-mono font-black text-xs uppercase tracking-wider neo-border neo-shadow flex items-center gap-2"
              >
                <Unlock className="w-3.5 h-3.5 text-black" />
                <span>Withdraw $200 from Spend</span>
              </button>
            </div>

            {/* Step 3: Tax Protection Enforcement */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 bg-[#FFBD45] text-black font-mono font-black text-xs flex items-center justify-center neo-border">
                    3
                  </span>
                  <h3 className="font-display text-xl font-black uppercase tracking-tight text-black">
                    Test Tax Protection Enforcement
                  </h3>
                </div>
                <span className="font-mono text-xs font-black text-[#FFBD45] bg-black px-2 py-0.5 uppercase">
                  LOCKED TO PAYEE ONLY
                </span>
              </div>
              <p className="text-xs font-mono text-black/80">
                First, attempt to release tax funds to an unauthorized personal hot wallet. Then, release to the approved payee.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  onClick={handleStep3TaxAttack}
                  className="neo-btn px-4 py-2.5 bg-[#F2677A] text-white font-mono font-black text-xs uppercase tracking-wider neo-border neo-shadow flex items-center gap-2 hover:bg-[#e05367]"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Attempt Unauthorized Personal Withdrawal</span>
                </button>

                <button
                  onClick={handleStep3TaxLegitimate}
                  className="neo-btn px-4 py-2.5 bg-[#FFBD45] text-black font-mono font-black text-xs uppercase tracking-wider neo-border neo-shadow flex items-center gap-2 hover:bg-[#e6a635]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Release $100 to Approved Payee</span>
                </button>
              </div>

              {blockedAlert && (
                <div className="p-4 bg-[#F2677A]/20 neo-border font-mono text-xs text-black font-bold flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[#F2677A]" />
                  <span>{blockedAlert}</span>
                </div>
              )}

              {successAlert && (
                <div className="p-4 bg-[#21D99B]/20 neo-border font-mono text-xs text-black font-bold flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#21D99B]" />
                  <span>{successAlert}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Simulation Log */}
        <div className="bg-[#050505] neo-border neo-shadow">
          <div className="text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-black font-mono text-xs font-bold uppercase">
            <span className="flex items-center gap-2 text-[#E8FF00]">
              <Terminal className="w-4 h-4" />
              <span>SIMULATION CONSOLE AUDIT LOG</span>
            </span>
            <button
              onClick={() => {
                resetDemoData();
                setSimulationLog([]);
                setBlockedAlert(null);
                setSuccessAlert(null);
              }}
              className="flex items-center gap-1 text-white/60 hover:text-[#E8FF00] font-mono text-[11px] uppercase transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET STATE</span>
            </button>
          </div>
          <div className="p-4 font-mono text-xs text-[#21D99B] space-y-1.5 max-h-48 overflow-y-auto">
            {simulationLog.length === 0 ? (
              <span className="text-white/40">No actions executed yet. Click Step 1 above to begin.</span>
            ) : (
              simulationLog.map((log, idx) => <div key={idx}>{log}</div>)
            )}
          </div>
        </div>

        {/* Next Step Banner */}
        <div className="p-6 bg-white neo-border neo-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-display text-2xl font-black uppercase tracking-tight text-black">
              Explore Complete Application
            </h4>
            <p className="text-xs font-mono text-black/70">
              View deadlines calendar, client invoices, CSV exports, and full analytics.
            </p>
          </div>
          <Link
            href="/app"
            className="neo-btn px-6 py-3 bg-[#5919F6] text-white font-mono font-black text-xs uppercase tracking-wider neo-border neo-shadow flex items-center gap-2 hover:bg-[#4d13dd] self-start sm:self-auto"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <footer className="border-t-2 border-black py-4 px-4 text-center bg-[#050505]">
        <TaxDisclaimer className="justify-center" />
      </footer>
    </div>
  );
}
