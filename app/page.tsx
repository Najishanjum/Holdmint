"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Vault,
  ShieldCheck,
  Lock,
  Unlock,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TaxDisclaimer } from "@/components/TaxDisclaimer";
import { formatUSDC, parseUSDC, calculateSplit } from "@/lib/utils/format-usdc";

export default function LandingPage() {
  const [demoAmountStr, setDemoAmountStr] = useState("1000.00");
  const [taxBps, setTaxBps] = useState(2500); // 25%
  const [savingsBps, setSavingsBps] = useState(500); // 5%
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const parsedBase = parseUSDC(demoAmountStr);
  const liveSplit = calculateSplit(parsedBase, taxBps, savingsBps);

  const faqs = [
    {
      q: "Does Tax Vault calculate or file my government taxes?",
      a: "No. Tax Vault is strictly an on-chain automated routing and custody-separation protocol. It does not calculate statutory tax liability, prepare tax returns, or file with the IRS or Indian Income Tax Department. All percentage allocations are worker-configured estimates.",
    },
    {
      q: "Can I withdraw my tax balance to my personal wallet anytime?",
      a: "No. By smart contract design, the Tax Vault can ONLY release funds to your worker-approved tax payee address. This prevents accidental spending. If you need to change your approved payee, a 72-hour security delay is enforced.",
    },
    {
      q: "Can I change my split percentages?",
      a: "Yes. You have complete authority to change your split rules. To protect your financial security, rule changes are subject to a 24-hour timelock cooldown before taking effect on future payments.",
    },
    {
      q: "What happens if a client transfers USDC directly to my personal wallet?",
      a: "Solana programs cannot intercept ordinary transfers sent directly to a personal wallet. Direct payments should be routed via your Tax Vault Payment Links, or sent to your designated Vault Inbox token account to be swept into the vaults.",
    },
    {
      q: "Are my funds held by Tax Vault as a custodian?",
      a: "Never. Tax Vault is completely non-custodial. Funds are held in Solana Program-Derived Accounts (PDAs) with authority restricted to your worker wallet and your approved rules. Tax Vault has zero custody, zero backdoors, and cannot access your tokens.",
    },
    {
      q: "Is Tax Vault live on Solana mainnet?",
      a: "Tax Vault is currently running on Solana Devnet with Mock USDC for public testing and security evaluation. It is unaudited devnet software.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col justify-between selection:bg-spend selection:text-black">
      {/* Navigation */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary text-background font-bold flex items-center justify-center text-sm shadow-md">
              TV
            </div>
            <div>
              <span className="font-bold text-base tracking-tight">Tax Vault</span>
              <span className="block text-[10px] text-muted font-medium">Solana Fintech</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-muted">
            <Link href="/how-it-works" className="hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link href="/security" className="hover:text-primary transition-colors">
              Security
            </Link>
            <Link href="/faq" className="hover:text-primary transition-colors">
              FAQ
            </Link>
            <Link href="/demo" className="text-tax font-semibold hover:opacity-90 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Demo</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/app"
              className="px-4 py-2 rounded-xl bg-spend hover:bg-spend/90 text-black font-semibold text-xs transition-all shadow-md shadow-spend/10"
            >
              Launch App
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-surface border border-border text-primary shadow-sm">
            <span className="w-2 h-2 rounded-full bg-spend animate-pulse" />
            <span>Solana Devnet Smart Contract Engine · Non-Custodial</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Your income. Three vaults. <br />
            <span className="text-spend">Zero accidental tax spending.</span>
          </h1>

          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Receive USDC from any client. Tax Vault routes your income into Spend, Tax, and Savings vaults according to smart contract rules you control.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link
              href="/app/onboarding"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-spend hover:bg-spend/90 text-black font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-spend/10"
            >
              <span>Start Your Vault</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/demo"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface-elevated hover:bg-border border border-border text-primary font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-tax" />
              <span>Explore Interactive Demo</span>
            </Link>
          </div>
        </div>

        {/* Live Interactive Preview Splitter */}
        <div className="mt-14 max-w-4xl mx-auto bg-surface rounded-card border border-border p-6 md:p-8 shadow-2xl relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-tax" />
                <h3 className="text-base font-bold text-primary">Interactive Split Preview</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-tax/15 text-tax border border-tax/30 uppercase">
                  Mock USDC
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5">
                Adjust incoming payment and see atomic 6-decimal distributions
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">Simulate:</span>
              {["500", "1000", "2500"].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setDemoAmountStr(`${amt}.00`)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    demoAmountStr === `${amt}.00`
                      ? "bg-spend/20 text-spend border-spend"
                      : "bg-surface-elevated text-muted border-border hover:text-primary"
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
          </div>

          {/* Three Vault Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            {/* Spend Card */}
            <div className="p-4 rounded-xl bg-surface-elevated border border-spend/30 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5 text-spend font-semibold">
                  <Unlock className="w-4 h-4" />
                  <span>Spend ({liveSplit.spendBps / 100}%)</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-muted">Liquid</span>
              </div>
              <div className="text-2xl font-bold font-mono text-spend tnum">
                {formatUSDC(liveSplit.spendAmount)}
              </div>
              <p className="text-[11px] text-muted">
                Unrestricted for daily freelancer operational expenses.
              </p>
            </div>

            {/* Tax Vault Card */}
            <div className="p-4 rounded-xl bg-surface-elevated border border-tax/30 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5 text-tax font-semibold">
                  <Lock className="w-4 h-4" />
                  <span>Tax Vault ({liveSplit.taxBps / 100}%)</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-tax bg-tax/15 px-1.5 py-0.5 rounded">
                  Locked
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-tax tnum">
                {formatUSDC(liveSplit.taxAmount)}
              </div>
              <p className="text-[11px] text-muted">
                Smart contract locked. Release only to approved tax payee.
              </p>
            </div>

            {/* Savings Vault Card */}
            <div className="p-4 rounded-xl bg-surface-elevated border border-savings/30 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5 text-savings font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>Savings ({liveSplit.savingsBps / 100}%)</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-savings bg-savings/15 px-1.5 py-0.5 rounded">
                  Time-Locked
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-savings tnum">
                {formatUSDC(liveSplit.savingsAmount)}
              </div>
              <p className="text-[11px] text-muted">
                Automatic reserve buffer with worker configured unlock period.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-border text-xs text-muted gap-2">
            <span>
              Integer math formula: <code className="text-primary font-mono">tax = floor(amt × bps / 10000)</code>. Remainder to Spend.
            </span>
            <Link href="/app" className="text-spend font-semibold flex items-center gap-1 hover:underline">
              <span>Open live dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 border-t border-border bg-surface/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-semibold text-spend uppercase tracking-wider">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl font-bold text-primary">How Tax Vault Works</h2>
            <p className="text-sm text-muted">
              Source-level financial engineering for independent professionals receiving USDC
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-card bg-surface border border-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-spend/15 text-spend font-bold flex items-center justify-center">
                1
              </div>
              <h3 className="text-base font-bold text-primary">Connect & Configure Split</h3>
              <p className="text-xs text-muted leading-relaxed">
                Choose your Spend, Tax, and Savings allocations. Designate your approved tax payee and configure timelocks.
              </p>
            </div>

            <div className="p-6 rounded-card bg-surface border border-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-tax/15 text-tax font-bold flex items-center justify-center">
                2
              </div>
              <h3 className="text-base font-bold text-primary">Share Payment Link or Inbox</h3>
              <p className="text-xs text-muted leading-relaxed">
                Generate clean client invoices with QR codes, or share your designated Program-Derived Inbox token address.
              </p>
            </div>

            <div className="p-6 rounded-card bg-surface border border-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-savings/15 text-savings font-bold flex items-center justify-center">
                3
              </div>
              <h3 className="text-base font-bold text-primary">Automated Atomic Splitting</h3>
              <p className="text-xs text-muted leading-relaxed">
                Incoming payments are split at the moment of payment by the smart contract. Tax funds are immediately protected from accidental spending.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Comparison Section */}
      <section className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="text-3xl font-bold text-primary">Why Tax Vault?</h2>
            <p className="text-sm text-muted">
              Factual comparison against traditional budgeting and manual tools
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-surface rounded-card border border-border overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-elevated text-muted uppercase text-[11px] border-b border-border">
                <tr>
                  <th className="py-3.5 px-4">Feature</th>
                  <th className="py-3.5 px-4 text-center">Spreadsheets</th>
                  <th className="py-3.5 px-4 text-center">Generic Splitters</th>
                  <th className="py-3.5 px-4 text-center text-spend font-bold">Tax Vault</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-primary">Source-Level Split Enforcement</td>
                  <td className="py-3.5 px-4 text-center text-muted">Manual (post-receipt)</td>
                  <td className="py-3.5 px-4 text-center text-muted">Unrestricted</td>
                  <td className="py-3.5 px-4 text-center text-spend font-semibold">Atomic On-Chain</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-primary">Accidental Tax Spending Protection</td>
                  <td className="py-3.5 px-4 text-center text-danger font-medium">None (funds co-mingled)</td>
                  <td className="py-3.5 px-4 text-center text-danger font-medium">None</td>
                  <td className="py-3.5 px-4 text-center text-spend font-semibold">Locked to Payee</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-primary">Approved Payee Restriction</td>
                  <td className="py-3.5 px-4 text-center text-muted">N/A</td>
                  <td className="py-3.5 px-4 text-center text-muted">Arbitrary addresses</td>
                  <td className="py-3.5 px-4 text-center text-spend font-semibold">Program-Enforced</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-primary">Delayed Timelock on Rule Changes</td>
                  <td className="py-3.5 px-4 text-center text-muted">N/A</td>
                  <td className="py-3.5 px-4 text-center text-muted">Instant bypass</td>
                  <td className="py-3.5 px-4 text-center text-spend font-semibold">24h Cooldown</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-primary">Non-Custodial Architecture</td>
                  <td className="py-3.5 px-4 text-center text-spend">Yes</td>
                  <td className="py-3.5 px-4 text-center text-muted">Varies</td>
                  <td className="py-3.5 px-4 text-center text-spend font-semibold">100% Non-Custodial</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 border-t border-border bg-surface/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
            <h2 className="text-3xl font-bold text-primary">Frequently Asked Questions</h2>
            <p className="text-sm text-muted">
              Clear product boundaries, smart contract rules, and demo limitations
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-surface rounded-xl border border-border overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-primary hover:text-spend transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted transition-transform ${
                      activeFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-muted leading-relaxed border-t border-border/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 sm:px-6 bg-surface">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary text-background font-bold flex items-center justify-center text-xs">
              TV
            </div>
            <span className="font-bold text-sm text-primary">Tax Vault</span>
            <span className="text-xs text-muted font-mono ml-2">Solana Devnet</span>
          </div>

          <TaxDisclaimer />

          <div className="flex items-center gap-4 text-xs text-muted">
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
            <Link href="/security" className="hover:text-primary">
              Security Model
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
