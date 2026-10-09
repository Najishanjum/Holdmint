import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TaxDisclaimer } from "@/components/TaxDisclaimer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-primary flex flex-col justify-between">
      <header className="border-b border-border bg-surface/80 px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold">
          <ArrowLeft className="w-4 h-4 text-muted" />
          <span>Tax Vault</span>
        </Link>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12 space-y-6 flex-1">
        <h1 className="text-2xl font-bold">Terms of Service</h1>
        <div className="p-4 rounded-xl bg-tax/10 border border-tax/30 text-xs text-tax">
          Placeholder terms for Devnet demonstration. Requires legal review prior to mainnet production.
        </div>
        <p className="text-xs text-muted leading-relaxed">
          Tax Vault is non-custodial software provided on an "as is" and "as available" basis without warranties of any kind. Tax Vault does not provide tax, legal, or accounting advice. Users are solely responsible for determining, withholding, and remitting any taxes due to applicable government tax authorities.
        </p>
      </main>
      <footer className="border-t border-border py-4 px-6 text-center">
        <TaxDisclaimer className="justify-center" />
      </footer>
    </div>
  );
}
