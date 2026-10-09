"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, HelpCircle, ArrowRight } from "lucide-react";
import { TaxDisclaimer } from "@/components/TaxDisclaimer";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Does Tax Vault calculate or file my government taxes?",
      a: "No. Tax Vault is strictly an on-chain automated routing and custody-separation protocol. It does not calculate statutory tax liability, prepare tax returns, or file with the IRS or Indian Income Tax Department. All percentage allocations are worker-configured planning estimates.",
    },
    {
      q: "Can I withdraw my tax balance to my personal wallet?",
      a: "No. By smart contract design, the Tax Vault can ONLY release funds to your worker-approved tax payee address. This prevents accidental spending. If you need to change your approved payee, a 72-hour security delay is enforced.",
    },
    {
      q: "Can I change my split percentages?",
      a: "Yes. You have complete authority to change your split rules. To protect your financial security, rule changes are subject to a 24-hour timelock cooldown before taking effect on future payments.",
    },
    {
      q: "What if I enter the wrong approved tax payee address?",
      a: "You can propose a replacement payee at any time. The replacement is subjected to a 72-hour timelock delay to protect against compromised credentials. Once the delay passes, you confirm and activate the new address.",
    },
    {
      q: "Can any client pay me in USDC?",
      a: "Yes. Any client with a Solana-compatible wallet or exchange that supports SPL USDC transfers can pay via your payment links or your Vault Inbox address.",
    },
    {
      q: "What happens if a client transfers directly to my normal wallet?",
      a: "Solana programs cannot intercept ordinary transfers sent directly to a personal wallet. Direct payments must be routed via your Tax Vault Payment Links, or sent to your designated Vault Inbox token account to be swept into the vaults.",
    },
    {
      q: "Are my funds held by Tax Vault as a custodian?",
      a: "Never. Tax Vault is completely non-custodial. Funds are held in Solana Program-Derived Accounts (PDAs) with authority restricted to your worker wallet and your approved rules. Tax Vault has zero custody, zero backdoors, and cannot access your tokens.",
    },
    {
      q: "Is Tax Vault live on mainnet?",
      a: "Tax Vault is currently running on Solana Devnet with Mock USDC for public testing and security evaluation. It is unaudited devnet software.",
    },
    {
      q: "Does the tax-readiness indicator mean my tax liability is covered?",
      a: "No. The tax-readiness ring is a personal budgeting tool comparing your reserved tax balance to your own self-estimated target. It is not an assessment of legal tax compliance.",
    },
  ];

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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10 flex-1">
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase text-spend tracking-wider">
            Clear Answers & Guidance
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            Everything you need to know about non-custodial vault mechanics, smart-contract safeguards, and product boundaries.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-surface rounded-card border border-border overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between text-sm font-semibold text-primary hover:text-spend transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-muted transition-transform shrink-0 ml-4 ${
                    openIndex === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === idx && (
                <div className="px-5 pb-5 text-xs text-muted leading-relaxed border-t border-border/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-6 rounded-card bg-surface border border-border text-center space-y-3">
          <h3 className="text-sm font-bold text-primary">Ready to test the split simulator?</h3>
          <p className="text-xs text-muted">
            Experience atomic 3-vault distributions in our interactive sandbox.
          </p>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-spend text-black font-semibold text-xs"
          >
            <span>Launch Interactive Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>

      <footer className="border-t border-border py-6 px-4 text-center bg-surface">
        <TaxDisclaimer className="justify-center" />
      </footer>
    </div>
  );
}
