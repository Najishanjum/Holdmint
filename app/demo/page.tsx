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
    const res = processPayment(1_000_000_000n, "Acme Studio", "Demo $1,000 Payment");
    addLog("Processed $1,000.00 USDC payment from Acme Studio");
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
    // Attempt withdrawal to unauthorized personal wallet
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
    <div className="min-h-screen bg-background text-primary flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-border bg-surface/80 px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4 text-muted" />
          <span className="font-bold text-sm">Back to Home</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-tax/20 text-tax uppercase">
            2-Minute Guided Demo
          </span>
          <Link
            href="/app"
            className="px-3.5 py-1.5 rounded-xl bg-spend text-black font-semibold text-xs"
          >
            Launch Full App
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 flex-1 w-full">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">
            Interactive Protocol Sandbox
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Experience the three core principles of Tax Vault: automatic splitting, liquid spend, and smart-contract protected tax release.
          </p>
        </div>

        {/* Live Vault Balance Ribbon */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-surface border border-border">
          <div className="text-center">
            <span className="text-[11px] text-spend font-semibold block">Spend Vault</span>
            <span className="font-mono font-bold text-base sm:text-lg text-primary tnum">
              {formatUSDC(balances.spend)}
            </span>
          </div>
          <div className="text-center border-x border-border">
            <span className="text-[11px] text-tax font-semibold block">Tax Vault (Locked)</span>
            <span className="font-mono font-bold text-base sm:text-lg text-tax tnum">
              {formatUSDC(balances.tax)}
            </span>
          </div>
          <div className="text-center">
            <span className="text-[11px] text-savings font-semibold block">Savings Vault</span>
            <span className="font-mono font-bold text-base sm:text-lg text-savings tnum">
              {formatUSDC(balances.savings)}
            </span>
          </div>
        </div>

        {/* Stepper Steps Card */}
        <div className="bg-surface rounded-card border border-border p-6 space-y-6">
          {/* Step 1: Simulate $1,000 Inflow */}
          <div className="space-y-3 pb-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-spend/20 text-spend text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="text-sm font-bold text-primary">Simulate $1,000.00 USDC Payment</h3>
              </div>
              <span className="text-xs text-muted">Split: 70% / 25% / 5%</span>
            </div>
            <p className="text-xs text-muted">
              Trigger a payment and watch the atomic math divide funds into Spend ($700), Tax ($250), and Savings ($50).
            </p>
            <button
              onClick={handleStep1Payment}
              className="px-4 py-2.5 rounded-xl bg-spend text-black font-semibold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate $1,000 Payment</span>
            </button>
          </div>

          {/* Step 2: Withdraw Liquid Spend */}
          <div className="space-y-3 pb-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-spend/20 text-spend text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="text-sm font-bold text-primary">Withdraw Spend to Personal Wallet</h3>
              </div>
              <span className="text-xs text-spend font-semibold">Unrestricted</span>
            </div>
            <p className="text-xs text-muted">
              Spend vault is completely liquid. Withdraw $200.00 USDC to worker wallet without delays.
            </p>
            <button
              onClick={handleStep2Spend}
              className="px-4 py-2.5 rounded-xl bg-surface-elevated hover:bg-border border border-border text-primary font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Unlock className="w-3.5 h-3.5 text-spend" />
              <span>Withdraw $200 from Spend</span>
            </button>
          </div>

          {/* Step 3: Tax Protection Enforcement */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-tax/20 text-tax text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="text-sm font-bold text-primary">Test Tax Protection Enforcement</h3>
              </div>
              <span className="text-xs text-tax font-semibold">Locked to Payee Only</span>
            </div>
            <p className="text-xs text-muted">
              First, attempt to release tax funds to an unauthorized personal hot wallet. Then, release to the approved payee.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={handleStep3TaxAttack}
                className="px-4 py-2.5 rounded-xl bg-danger/15 hover:bg-danger/25 text-danger border border-danger/30 font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Attempt Unauthorized Personal Withdrawal</span>
              </button>

              <button
                onClick={handleStep3TaxLegitimate}
                className="px-4 py-2.5 rounded-xl bg-tax/15 hover:bg-tax/25 text-tax border border-tax/30 font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Release $100 to Approved Payee</span>
              </button>
            </div>

            {blockedAlert && (
              <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/30 text-xs text-danger flex items-start gap-2 animate-in fade-in">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{blockedAlert}</span>
              </div>
            )}

            {successAlert && (
              <div className="p-3.5 rounded-xl bg-spend/10 border border-spend/30 text-xs text-spend flex items-start gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successAlert}</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Simulation Log */}
        <div className="bg-surface rounded-card border border-border p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted">
            <span>Simulation Event Log</span>
            <button
              onClick={() => {
                resetDemoData();
                setSimulationLog([]);
                setBlockedAlert(null);
                setSuccessAlert(null);
              }}
              className="flex items-center gap-1 text-muted hover:text-primary transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset State</span>
            </button>
          </div>
          <div className="p-3 rounded-xl bg-background border border-border font-mono text-[11px] text-muted space-y-1 max-h-40 overflow-y-auto">
            {simulationLog.length === 0 ? (
              <span className="text-muted/60">No actions executed yet. Click Step 1 above.</span>
            ) : (
              simulationLog.map((log, idx) => <div key={idx}>{log}</div>)
            )}
          </div>
        </div>

        {/* Next Step Banner */}
        <div className="p-5 rounded-xl bg-surface-elevated border border-border flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-primary">Explore Full Dashboard</h4>
            <p className="text-xs text-muted">
              View deadlines calendar, client invoices, CSV exports, and full analytics.
            </p>
          </div>
          <Link
            href="/app"
            className="px-4 py-2.5 rounded-xl bg-spend text-black font-semibold text-xs flex items-center gap-1.5"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>

      <footer className="border-t border-border py-4 px-4 text-center bg-surface">
        <TaxDisclaimer className="justify-center" />
      </footer>
    </div>
  );
}
