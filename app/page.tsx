"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Unlock,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Layers,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TaxDisclaimer } from "@/components/TaxDisclaimer";
import { TickerBar } from "@/components/TickerBar";
import { formatUSDC, parseUSDC, calculateSplit } from "@/lib/utils/format-usdc";

export default function LandingPage() {
  const [demoAmountStr, setDemoAmountStr] = useState("1000.00");
  const [taxBps, setTaxBps] = useState(2500); // 25%
  const [savingsBps, setSavingsBps] = useState(500); // 5%
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const parsedBase = parseUSDC(demoAmountStr);
  const liveSplit = calculateSplit(parsedBase, taxBps, savingsBps);

  const faqs = [
    {
      q: "DOES HOLDMINT CALCULATE OR FILE MY GOVERNMENT TAXES?",
      a: "No. HoldMint is strictly an on-chain automated routing and custody-separation protocol. It does not calculate statutory tax liability, prepare tax returns, or file with the IRS or Indian Income Tax Department. All percentage allocations are worker-configured planning estimates.",
    },
    {
      q: "CAN I WITHDRAW MY TAX BALANCE TO MY PERSONAL WALLET?",
      a: "No. By smart contract design, the Tax Vault can ONLY release funds to your worker-approved tax payee address. This prevents accidental spending. If you need to change your approved payee, a 72-hour security delay is enforced.",
    },
    {
      q: "CAN I CHANGE MY SPLIT PERCENTAGES?",
      a: "Yes. You have complete authority to change your split rules. To protect your financial security, rule changes are subject to a 24-hour timelock cooldown before taking effect on future payments.",
    },
    {
      q: "WHAT HAPPENS IF A CLIENT TRANSFERS DIRECTLY TO MY NORMAL WALLET?",
      a: "Solana programs cannot intercept ordinary transfers sent directly to a personal wallet. Direct payments must be routed via your HoldMint Payment Links, or sent to your designated Vault Inbox token account to be swept into the vaults.",
    },
    {
      q: "ARE MY FUNDS HELD BY HOLDMINT AS A CUSTODIAN?",
      a: "Never. HoldMint is completely non-custodial. Funds are held in Solana Program-Derived Accounts (PDAs) with authority restricted to your worker wallet and your approved rules. HoldMint has zero custody, zero backdoors, and cannot access your tokens.",
    },
    {
      q: "IS HOLDMINT LIVE ON SOLANA MAINNET?",
      a: "HoldMint is currently running on Solana Devnet with Mock USDC for public testing and security evaluation. It is unaudited devnet software.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex flex-col justify-between selection:bg-[#E8FF00] selection:text-[#050505]">
      {/* Top Announcement Ticker */}
      <TickerBar />

      {/* Main Navigation Bar */}
      <header className="border-b-2 border-[#050505] bg-[#09090B] sticky top-0 z-50 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[4px] bg-[#5919F6] border-2 border-[#050505] text-white font-display font-black text-lg flex items-center justify-center neo-shadow-sm">
              HM
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-tight uppercase block leading-none text-white">
                HOLDMINT
              </span>
              <span className="text-[10px] text-[#A1A1AA] font-mono tracking-wider">
                SOLANA FINTECH
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 font-display font-bold text-xs tracking-wider text-[#B8B5C5]">
            <Link href="/how-it-works" className="hover:text-white transition-colors">
              HOW IT WORKS
            </Link>
            <Link href="/security" className="hover:text-white transition-colors">
              SECURITY
            </Link>
            <Link href="/faq" className="hover:text-white transition-colors">
              FAQ
            </Link>
            <Link href="/demo" className="text-[#E8FF00] font-black hover:underline flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>INTERACTIVE DEMO</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/app"
              className="px-4 py-2 rounded-[4px] bg-[#E8FF00] text-[#050505] font-display font-black text-xs uppercase neo-btn tracking-wider hover:bg-yellow-300"
            >
              LAUNCH APP
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section: Bold Electric Purple Background with Two Columns */}
      <section className="bg-[#5919F6] border-b-2 border-[#050505] py-14 md:py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Bold Editorial Headline */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#050505] text-white border-2 border-[#050505] neo-shadow-sm font-mono text-[11px] font-bold uppercase">
              <span className="w-2 h-2 rounded-full bg-[#E8FF00] animate-pulse" />
              <span>SOLANA DEVNET · NON-CUSTODIAL VAULT PROTOCOL</span>
            </div>

            <div className="space-y-1">
              <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.9] text-white uppercase">
                YOUR MONEY. <br />
                YOUR RULES. <br />
                <span className="inline-block bg-[#E8FF00] text-[#050505] px-2 mt-1">
                  ZERO ACCIDENTS.
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-[#F2F0F7] max-w-xl leading-relaxed font-sans font-medium">
              Every incoming USDC payment is automatically divided into Spend, Tax, and Savings vaults at the source of payment. Tax funds are smart-contract protected and released only to your approved payee.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 font-display">
              <Link
                href="/app/onboarding"
                className="px-8 py-4 rounded-[4px] bg-[#E8FF00] text-[#050505] font-black text-sm uppercase flex items-center justify-center gap-2 neo-btn tracking-wider hover:bg-yellow-300"
              >
                <span>CREATE YOUR VAULT</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>

              <Link
                href="/demo"
                className="px-7 py-4 rounded-[4px] bg-white text-[#050505] font-black text-sm uppercase flex items-center justify-center gap-2 neo-btn tracking-wider hover:bg-[#F2F0F7]"
              >
                <Sparkles className="w-4 h-4 text-[#5919F6]" />
                <span>EXPLORE DEMO</span>
              </Link>
            </div>

            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-[#F2F0F7]/90 uppercase font-semibold">
              <span className="flex items-center gap-1">✓ Non-Custodial</span>
              <span className="flex items-center gap-1">✓ Approved Payee Locked</span>
              <span className="flex items-center gap-1">✓ 24h Timelocks</span>
            </div>
          </div>

          {/* Right Column: Neo-Brutalist Desktop Terminal Card */}
          <div className="lg:col-span-5">
            <div className="bg-white text-[#050505] rounded-[6px] border-2 border-[#050505] neo-shadow-lg overflow-hidden">
              {/* Terminal Window Header Bar */}
              <div className="bg-[#050505] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-[#050505]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#E8FF00] border border-black inline-block" />
                  <span className="font-display font-black text-xs uppercase tracking-wider text-white">
                    SPLIT SIMULATOR · MOCK USDC
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#E8FF00] text-black font-mono font-bold text-[10px] uppercase">
                  SIMULATED
                </span>
              </div>

              {/* Terminal Body */}
              <div className="p-5 space-y-4 font-mono">
                {/* Incoming Simulation Trigger */}
                <div className="p-3 bg-[#F2F0F7] rounded-[4px] border border-[#050505] space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-[#696574] uppercase">INCOMING PAYMENT:</span>
                    <span className="text-xl font-display font-black text-[#050505]">
                      ${demoAmountStr}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {["500.00", "1000.00", "2500.00"].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setDemoAmountStr(amt)}
                        className={`py-1.5 text-xs font-black rounded border transition-all ${
                          demoAmountStr === amt
                            ? "bg-[#050505] text-white"
                            : "bg-white text-black hover:bg-[#E8FF00]"
                        }`}
                      >
                        ${amt.split(".")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3 Resulting Vault Allocations */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded bg-white border border-[#050505] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#21D99B] border border-black" />
                      <span className="font-display font-bold uppercase">SPEND VAULT (70%)</span>
                    </div>
                    <span className="font-bold text-[#050505]">{formatUSDC(liveSplit.spendAmount)}</span>
                  </div>

                  <div className="p-2.5 rounded bg-white border border-[#050505] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD45] border border-black" />
                      <span className="font-display font-bold uppercase text-[#050505]">
                        TAX VAULT (25% - LOCKED)
                      </span>
                    </div>
                    <span className="font-black text-[#050505]">{formatUSDC(liveSplit.taxAmount)}</span>
                  </div>

                  <div className="p-2.5 rounded bg-white border border-[#050505] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8790FF] border border-black" />
                      <span className="font-display font-bold uppercase">SAVINGS VAULT (5%)</span>
                    </div>
                    <span className="font-bold text-[#050505]">{formatUSDC(liveSplit.savingsAmount)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t-2 border-[#050505] flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#696574]">RESTRICTION RULE:</span>
                  <span className="text-[#050505] uppercase">APPROVED PAYEE ONLY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works: Editorial 3-Card Grid */}
      <section className="py-20 border-b-2 border-[#050505] bg-[#09090B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-14">
            <span className="text-xs font-mono font-bold text-[#E8FF00] uppercase tracking-wider">
              HOW IT WORKS
            </span>
            <h2 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-white">
              THREE STEPS. ENFORCED AT THE SOURCE.
            </h2>
            <p className="text-sm text-[#B8B5C5] font-sans">
              Non-custodial Solana engineering protecting your quarterly tax liability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            <div className="bg-white text-[#050505] p-6 rounded-[6px] border-2 border-[#050505] neo-shadow space-y-3">
              <div className="w-10 h-10 rounded-[4px] bg-[#050505] text-white font-display font-black text-xl flex items-center justify-center">
                01
              </div>
              <h3 className="font-display font-black text-xl uppercase tracking-tight">
                CONNECT & CHOOSE SPLIT
              </h3>
              <p className="text-xs text-[#696574] leading-relaxed">
                Connect your Solana wallet and configure your Spend, Tax, and Savings percentages. Designate your worker-approved tax payee address.
              </p>
            </div>

            <div className="bg-white text-[#050505] p-6 rounded-[6px] border-2 border-[#050505] neo-shadow space-y-3">
              <div className="w-10 h-10 rounded-[4px] bg-[#E8FF00] text-[#050505] font-display font-black text-xl flex items-center justify-center border-2 border-[#050505]">
                02
              </div>
              <h3 className="font-display font-black text-xl uppercase tracking-tight">
                SHARE INVOICE LINK OR INBOX
              </h3>
              <p className="text-xs text-[#696574] leading-relaxed">
                Send clients a clean payment link with QR code, or share your designated Program-Derived Inbox token account for direct transfers.
              </p>
            </div>

            <div className="bg-white text-[#050505] p-6 rounded-[6px] border-2 border-[#050505] neo-shadow space-y-3">
              <div className="w-10 h-10 rounded-[4px] bg-[#5919F6] text-white font-display font-black text-xl flex items-center justify-center">
                03
              </div>
              <h3 className="font-display font-black text-xl uppercase tracking-tight">
                AUTOMATED ATOMIC ROUTING
              </h3>
              <p className="text-xs text-[#696574] leading-relaxed">
                Incoming USDC is automatically separated into Spend, locked Tax, and time-locked Savings vaults before you even have a chance to spend it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 border-b-2 border-[#050505] bg-[#F2F0F7] text-[#050505]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-[#5919F6]">
              PROTOCOL COMPARISON
            </span>
            <h2 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight">
              WHY HOLDMINT BEATS SPREADSHEETS
            </h2>
          </div>

          <div className="bg-white rounded-[6px] border-2 border-[#050505] neo-shadow-lg overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#050505] text-white uppercase text-[11px] font-display font-black tracking-wider">
                <tr>
                  <th className="py-4 px-5">CAPABILITY</th>
                  <th className="py-4 px-5 text-center">SPREADSHEETS</th>
                  <th className="py-4 px-5 text-center">GENERIC TOOLS</th>
                  <th className="py-4 px-5 text-center bg-[#E8FF00] text-black">HOLDMINT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E3ED]">
                <tr>
                  <td className="py-3.5 px-5 font-bold font-sans">Source-Level Split Enforcement</td>
                  <td className="py-3.5 px-5 text-center text-[#696574]">Manual</td>
                  <td className="py-3.5 px-5 text-center text-[#696574]">Unrestricted</td>
                  <td className="py-3.5 px-5 text-center font-black text-[#050505] bg-[#E8FF00]/20">
                    ATOMIC ON-CHAIN
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-bold font-sans">Accidental Spending Protection</td>
                  <td className="py-3.5 px-5 text-center text-[#F2677A]">None</td>
                  <td className="py-3.5 px-5 text-center text-[#F2677A]">None</td>
                  <td className="py-3.5 px-5 text-center font-black text-[#050505] bg-[#E8FF00]/20">
                    LOCKED TO PAYEE
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-bold font-sans">Approved Payee Restriction</td>
                  <td className="py-3.5 px-5 text-center text-[#696574]">N/A</td>
                  <td className="py-3.5 px-5 text-center text-[#696574]">Arbitrary</td>
                  <td className="py-3.5 px-5 text-center font-black text-[#050505] bg-[#E8FF00]/20">
                    PROGRAM ENFORCED
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-bold font-sans">Delayed Timelock on Rule Changes</td>
                  <td className="py-3.5 px-5 text-center text-[#696574]">N/A</td>
                  <td className="py-3.5 px-5 text-center text-[#696574]">Instant Bypass</td>
                  <td className="py-3.5 px-5 text-center font-black text-[#050505] bg-[#E8FF00]/20">
                    24H COOLDOWN
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-bold font-sans">Non-Custodial Architecture</td>
                  <td className="py-3.5 px-5 text-center">Yes</td>
                  <td className="py-3.5 px-5 text-center text-[#696574]">Varies</td>
                  <td className="py-3.5 px-5 text-center font-black text-[#050505] bg-[#E8FF00]/20">
                    100% NON-CUSTODIAL
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 border-b-2 border-[#050505] bg-[#09090B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-[#E8FF00] uppercase tracking-wider">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-white">
              CLEAR RULES. NO SURPRISES.
            </h2>
          </div>

          <div className="space-y-3 font-sans">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white text-[#050505] rounded-[6px] border-2 border-[#050505] neo-shadow overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-display font-black text-base uppercase tracking-wider hover:bg-[#F2F0F7] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#050505] transition-transform shrink-0 ml-4 stroke-[3] ${
                      activeFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-[#696574] leading-relaxed border-t-2 border-[#050505] pt-3 font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 bg-[#09090B] border-t-2 border-[#050505] text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[4px] bg-[#5919F6] border-2 border-[#050505] text-white font-display font-black flex items-center justify-center text-sm neo-shadow-sm">
              HM
            </div>
            <div>
              <span className="font-display font-black text-base uppercase tracking-tight block leading-none">
                HOLDMINT
              </span>
              <span className="text-[10px] text-[#A1A1AA] font-mono">
                NON-CUSTODIAL · SOLANA DEVNET
              </span>
            </div>
          </div>

          <TaxDisclaimer />

          <div className="flex items-center gap-4 text-xs font-display font-bold uppercase tracking-wider text-[#B8B5C5]">
            <Link href="/privacy" className="hover:text-white">
              PRIVACY
            </Link>
            <Link href="/terms" className="hover:text-white">
              TERMS
            </Link>
            <Link href="/security" className="hover:text-white">
              SECURITY
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
