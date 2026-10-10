"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, Lock, Unlock, Clock, Sparkles, Layers } from "lucide-react";
import { TaxDisclaimer } from "@/components/TaxDisclaimer";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-white flex flex-col justify-between">
      <header className="border-b-2 border-black bg-[#050505] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-mono text-xs uppercase font-bold text-white hover:text-[#E8FF00] transition-colors">
            <ArrowLeft className="w-4 h-4 text-[#E8FF00]" />
            <span>HOLDMINT HOME</span>
          </Link>
          <Link
            href="/app"
            className="neo-btn px-4 py-2 bg-[#E8FF00] text-black font-mono font-black text-xs uppercase tracking-wider neo-border neo-shadow hover:bg-[#d8ed00]"
          >
            Launch App
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-[#E8FF00] inline-block animate-pulse"></span>
            <span className="font-mono text-xs uppercase tracking-widest text-[#E8FF00]">
              SYSTEM ARCHITECTURE // PDA PROTOCOL SPEC
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-white">
            How HoldMint Works
          </h1>
          <p className="font-mono text-xs text-white/60 leading-relaxed">
            A comprehensive explanation of how non-custodial Program-Derived Accounts (PDAs), atomic payment splitting, and approved payee safeguards protect freelancer capital.
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white neo-border neo-shadow">
            <div className="bg-[#050505] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-black font-mono text-xs font-bold uppercase">
              <span>PROBLEM DOMAIN 01</span>
              <span className="text-[#F2677A]">CAPITAL CO-MINGLING</span>
            </div>
            <div className="p-6 space-y-3">
              <h2 className="font-display text-2xl font-black uppercase tracking-tight text-black flex items-center gap-2">
                <span className="w-7 h-7 bg-black text-[#E8FF00] font-mono text-xs font-bold flex items-center justify-center neo-border">1</span>
                <span>The Accidental Tax Spending Dilemma</span>
              </h2>
              <p className="font-mono text-xs text-black/80 leading-relaxed">
                Freelancers, indie developers, and consultants who receive crypto payments directly into personal hot wallets inevitably co-mingle operational cash with tax reserves. When quarterly estimated tax payments arrive, funds have often been accidentally spent on living or business expenses. HoldMint eliminates this failure mode at the source of payment.
              </p>
            </div>
          </div>

          <div className="bg-white neo-border neo-shadow">
            <div className="bg-[#050505] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-black font-mono text-xs font-bold uppercase">
              <span>MECHANICS 02</span>
              <span className="text-[#21D99B]">ATOMIC 3-WAY PDA ROUTING</span>
            </div>
            <div className="p-6 space-y-3">
              <h2 className="font-display text-2xl font-black uppercase tracking-tight text-black flex items-center gap-2">
                <span className="w-7 h-7 bg-black text-[#21D99B] font-mono text-xs font-bold flex items-center justify-center neo-border">2</span>
                <span>Program-Derived Accounts & Three Vaults</span>
              </h2>
              <p className="font-mono text-xs text-black/80 leading-relaxed">
                When a worker initializes their HoldMint profile, the Anchor program creates three isolated token accounts owned by a Program-Derived Authority:
              </p>
              <ul className="space-y-2.5 font-mono text-xs text-black/80 pl-2">
                <li className="p-3 bg-[#F2F0F7] neo-border">
                  <strong className="text-black uppercase">Spend Vault:</strong> Available for unrestricted withdrawal to the worker's primary wallet at any time.
                </li>
                <li className="p-3 bg-[#FFBD45]/20 neo-border">
                  <strong className="text-black uppercase">Tax Vault:</strong> Smart-contract locked. Withdrawals can ONLY be released to the worker's pre-approved tax payee address.
                </li>
                <li className="p-3 bg-[#5919F6]/20 neo-border">
                  <strong className="text-black uppercase">Savings Vault:</strong> Time-locked treasury reserves with configurable lock durations (30, 90, 180 days).
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white neo-border neo-shadow">
            <div className="bg-[#050505] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-black font-mono text-xs font-bold uppercase">
              <span>SECURITY 03</span>
              <span className="text-[#E8FF00]">ANTI-IMPULSE TIMELOCKS</span>
            </div>
            <div className="p-6 space-y-3">
              <h2 className="font-display text-2xl font-black uppercase tracking-tight text-black flex items-center gap-2">
                <span className="w-7 h-7 bg-black text-[#5919F6] font-mono text-xs font-bold flex items-center justify-center neo-border">3</span>
                <span>Timelock Cooldown Safeguards</span>
              </h2>
              <p className="font-mono text-xs text-black/80 leading-relaxed">
                To prevent an impulsive user from reducing their tax allocation right before a payment arrives, rule changes are subjected to a mandatory 24-hour cooldown. Likewise, proposing a new tax payee requires a 72-hour timelock delay before becoming active.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-center">
          <Link
            href="/app/onboarding"
            className="neo-btn px-8 py-4 bg-[#E8FF00] hover:bg-[#d8ed00] text-black font-mono font-black text-sm uppercase tracking-wider neo-border neo-shadow flex items-center gap-2"
          >
            <span>Get Started with HoldMint</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <footer className="border-t-2 border-black py-6 px-4 text-center bg-[#050505]">
        <TaxDisclaimer className="justify-center" />
      </footer>
    </div>
  );
}
