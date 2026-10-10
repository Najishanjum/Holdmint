"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, Lock, CheckCircle2, AlertTriangle, FileCode } from "lucide-react";
import { TaxDisclaimer } from "@/components/TaxDisclaimer";

export default function SecurityPage() {
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
            <span className="w-2.5 h-2.5 bg-[#FFBD45] inline-block animate-pulse"></span>
            <span className="font-mono text-xs uppercase tracking-widest text-[#FFBD45]">
              TRUST & PROTOCOL BOUNDARIES
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Security Model & Boundaries
          </h1>
          <p className="font-mono text-xs text-white/60 leading-relaxed">
            HoldMint is engineered with conservative non-custodial principles, explicit account constraints, and persistent disclaimers.
          </p>
        </div>

        {/* Warning Banner */}
        <div className="p-5 bg-[#FFBD45]/20 neo-border flex items-start gap-3.5 text-xs font-mono text-white leading-relaxed">
          <ShieldAlert className="w-5 h-5 text-[#FFBD45] shrink-0 mt-0.5" />
          <div>
            <strong className="block uppercase text-[#FFBD45] font-black text-sm mb-1">
              Devnet Demonstration · Unaudited Software
            </strong>
            Tax Vault is currently deployed on Solana Devnet for security demonstrations and protocol evaluation. It has not undergone formal independent smart contract auditing. Do not use real mainnet production funds.
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white neo-border neo-shadow">
            <div className="bg-[#050505] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-black font-mono text-xs font-bold uppercase">
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#21D99B]" />
                <span>NON-CUSTODIAL ACCOUNT ISOLATION</span>
              </span>
              <span className="text-[#21D99B]">PDA SEEDS ENFORCED</span>
            </div>
            <div className="p-6 space-y-3">
              <p className="font-mono text-xs text-black/80 leading-relaxed">
                Worker vaults are derived deterministically using Program-Derived Addresses (PDAs) with seeds <code className="bg-[#050505] text-[#E8FF00] px-1.5 py-0.5 text-[11px] font-mono">[b"profile", owner.key()]</code> and <code className="bg-[#050505] text-[#E8FF00] px-1.5 py-0.5 text-[11px] font-mono">[b"vault_auth", profile.key()]</code>. Only the signer who holds the private key to the profile owner can trigger configuration updates or withdrawals. HoldMint maintains zero administrator keys and cannot freeze or redirect worker funds.
              </p>
            </div>
          </div>

          <div className="bg-white neo-border neo-shadow">
            <div className="bg-[#050505] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-black font-mono text-xs font-bold uppercase">
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#FFBD45]" />
                <span>APPROVED TAX PAYEE CONSTRAINT</span>
              </span>
              <span className="text-[#FFBD45]">ON-CHAIN ASSERTION</span>
            </div>
            <div className="p-6 space-y-3">
              <p className="font-mono text-xs text-black/80 leading-relaxed">
                When releasing funds from the Tax Vault via <code className="bg-[#050505] text-[#E8FF00] px-1.5 py-0.5 text-[11px] font-mono">release_tax(amount)</code>, the Anchor instruction strictly asserts that <code className="bg-[#050505] text-[#E8FF00] px-1.5 py-0.5 text-[11px] font-mono">ctx.accounts.payee_token_account.owner == profile.tax_payee</code>. Any attempt to supply the worker's own personal hot wallet or an unauthorized third party fails on-chain with <code className="bg-[#050505] text-[#F2677A] px-1.5 py-0.5 text-[11px] font-mono">TaxVaultError::UnauthorizedTaxPayee</code>.
              </p>
            </div>
          </div>

          <div className="bg-white neo-border neo-shadow">
            <div className="bg-[#050505] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-black font-mono text-xs font-bold uppercase">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#5919F6]" />
                <span>DIRECT WALLET TRANSFER BOUNDARY</span>
              </span>
              <span className="text-[#5919F6]">RUNTIME SCOPE</span>
            </div>
            <div className="p-6 space-y-3">
              <p className="font-mono text-xs text-black/80 leading-relaxed">
                Under Solana's runtime architecture, a smart contract cannot intercept or monitor generic token transfers sent directly to a worker's personal keypair. For HoldMint's three-vault split to occur, payments must be initiated via HoldMint payment instructions or transferred to the worker's designated Vault Inbox PDA.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t-2 border-black py-6 px-4 text-center bg-[#050505]">
        <TaxDisclaimer className="justify-center" />
      </footer>
    </div>
  );
}
