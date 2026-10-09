"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, Lock, CheckCircle2, AlertTriangle, FileCode } from "lucide-react";
import { TaxDisclaimer } from "@/components/TaxDisclaimer";

export default function SecurityPage() {
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
          <span className="text-xs font-semibold uppercase text-tax tracking-wider">
            Trust & Security Architecture
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary">
            Security Model & Boundaries
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            Tax Vault is engineered with conservative non-custodial principles, explicit account constraints, and persistent disclaimers.
          </p>
        </div>

        {/* Warning Banner */}
        <div className="p-4 rounded-xl bg-tax/10 border border-tax/30 flex items-start gap-3 text-xs text-tax leading-relaxed">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">Devnet Demonstration · Unaudited Software</strong>
            Tax Vault is currently deployed on Solana Devnet for security demonstrations and protocol evaluation. It has not undergone formal independent smart contract auditing. Do not use real mainnet production funds.
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-card bg-surface border border-border space-y-3">
            <h2 className="text-base font-bold text-primary flex items-center gap-2">
              <Lock className="w-4 h-4 text-spend" />
              <span>Non-Custodial Account Isolation</span>
            </h2>
            <p className="text-xs text-muted leading-relaxed">
              Worker vaults are derived deterministically using Program-Derived Addresses (PDAs) with seeds <code className="font-mono text-primary">[b"profile", owner.key()]</code> and <code className="font-mono text-primary">[b"vault_auth", profile.key()]</code>. Only the signer who holds the private key to the profile owner can trigger configuration updates or withdrawals. Tax Vault maintains zero administrator keys and cannot freeze or redirect worker funds.
            </p>
          </div>

          <div className="p-6 rounded-card bg-surface border border-border space-y-3">
            <h2 className="text-base font-bold text-primary flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-tax" />
              <span>Approved Tax Payee Constraint</span>
            </h2>
            <p className="text-xs text-muted leading-relaxed">
              When releasing funds from the Tax Vault via <code className="font-mono text-primary">release_tax(amount)</code>, the Anchor instruction strictly asserts that <code className="font-mono text-primary">ctx.accounts.payee_token_account.owner == profile.tax_payee</code>. Any attempt to supply the worker's own personal hot wallet or an unauthorized third party fails on-chain with <code className="font-mono text-primary">TaxVaultError::UnauthorizedTaxPayee</code>.
            </p>
          </div>

          <div className="p-6 rounded-card bg-surface border border-border space-y-3">
            <h2 className="text-base font-bold text-primary flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-savings" />
              <span>Direct Wallet Transfer Boundary</span>
            </h2>
            <p className="text-xs text-muted leading-relaxed">
              Under Solana's runtime architecture, a smart contract cannot intercept or monitor generic token transfers sent directly to a worker's personal keypair. For Tax Vault's three-vault split to occur, payments must be initiated via Tax Vault payment instructions or transferred to the worker's designated Vault Inbox PDA.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6 px-4 text-center bg-surface">
        <TaxDisclaimer className="justify-center" />
      </footer>
    </div>
  );
}
