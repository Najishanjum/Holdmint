"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, Lock, Unlock, Clock, Sparkles } from "lucide-react";
import { TaxDisclaimer } from "@/components/TaxDisclaimer";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background text-primary flex flex-col justify-between">
      <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 text-muted" />
            <span className="font-bold text-sm">Tax Vault</span>
          </Link>
          <Link
            href="/app"
            className="px-3.5 py-1.5 rounded-xl bg-spend text-black font-semibold text-xs"
          >
            Launch App
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 flex-1">
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase text-spend tracking-wider">
            Architecture & Mechanics
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary">
            How Tax Vault Works
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            A comprehensive explanation of how non-custodial Program-Derived Accounts (PDAs), atomic payment splitting, and approved payee safeguards protect freelancer capital.
          </p>
        </div>

        <div className="space-y-8">
          <div className="p-6 rounded-card bg-surface border border-border space-y-3">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-spend/15 text-spend text-xs font-bold flex items-center justify-center">1</span>
              <span>The Accidental Tax Spending Dilemma</span>
            </h2>
            <p className="text-xs text-muted leading-relaxed">
              Freelancers, indie developers, and consultants who receive crypto payments directly into personal hot wallets inevitably co-mingle operational cash with tax reserves. When quarterly estimated tax payments arrive, funds have often been accidentally spent on living or business expenses. Tax Vault eliminates this failure mode at the source of payment.
            </p>
          </div>

          <div className="p-6 rounded-card bg-surface border border-border space-y-3">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-tax/15 text-tax text-xs font-bold flex items-center justify-center">2</span>
              <span>Program-Derived Accounts & Three Vaults</span>
            </h2>
            <p className="text-xs text-muted leading-relaxed">
              When a worker initializes their Tax Vault profile, the Anchor program creates three isolated token accounts owned by a Program-Derived Authority:
            </p>
            <ul className="space-y-2 text-xs text-muted pl-4 list-disc">
              <li>
                <strong className="text-spend">Spend Vault:</strong> Available for unrestricted withdrawal to the worker's primary wallet at any time.
              </li>
              <li>
                <strong className="text-tax">Tax Vault:</strong> Smart-contract locked. Withdrawals can ONLY be released to the worker's pre-approved tax payee address.
              </li>
              <li>
                <strong className="text-savings">Savings Vault:</strong> Time-locked treasury reserves with configurable lock durations (30, 90, 180 days).
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-card bg-surface border border-border space-y-3">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-savings/15 text-savings text-xs font-bold flex items-center justify-center">3</span>
              <span>Timelock Cooldown Safeguards</span>
            </h2>
            <p className="text-xs text-muted leading-relaxed">
              To prevent an impulsive user from reducing their tax allocation right before a payment arrives, rule changes are subjected to a mandatory 24-hour cooldown. Likewise, proposing a new tax payee requires a 72-hour timelock delay before becoming active.
            </p>
          </div>
        </div>

        <div className="pt-6 flex justify-center">
          <Link
            href="/app/onboarding"
            className="px-6 py-3 rounded-xl bg-spend text-black font-semibold text-xs flex items-center gap-2 shadow-lg shadow-spend/10"
          >
            <span>Get Started with Tax Vault</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <footer className="border-t border-border py-6 px-4 text-center bg-surface">
        <TaxDisclaimer className="justify-center" />
      </footer>
    </div>
  );
}
