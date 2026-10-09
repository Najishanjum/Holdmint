"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import {
  Receipt,
  CheckCircle2,
  Copy,
  Check,
  Wallet,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useVault } from "@/lib/store/vault-store";
import { parseUSDC, formatUSDC, truncateAddress } from "@/lib/utils/format-usdc";
import { TaxDisclaimer } from "@/components/TaxDisclaimer";

export default function ClientPayPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const workerPubkey = (params?.workerPubkey as string) || "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU";
  const refParam = searchParams.get("ref") || "INV-2026-FLEX";

  const { processPayment } = useVault();

  const [amountInput, setAmountInput] = useState("500.00");
  const [payerName, setPayerName] = useState("");
  const [memo, setMemo] = useState("Contract deliverables");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paidTx, setPaidTx] = useState<{ txId: string; amount: bigint } | null>(null);

  // Generate QR code for payment
  useEffect(() => {
    const payUri = `solana:${workerPubkey}?amount=${amountInput}&memo=${encodeURIComponent(refParam)}`;
    QRCode.toDataURL(payUri, { width: 200, margin: 1 })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Code generation error", err));
  }, [workerPubkey, amountInput, refParam]);

  const handleCopy = () => {
    navigator.clipboard.writeText(workerPubkey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    const baseUnits = parseUSDC(amountInput);
    if (baseUnits <= 0n) return;

    setIsPaying(true);
    setTimeout(() => {
      processPayment(baseUnits, payerName || "External Client", memo);
      setPaidTx({
        txId: `SIM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        amount: baseUnits,
      });
      setIsPaying(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 md:p-8">
      <header className="max-w-xl mx-auto w-full flex items-center justify-between pb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary text-background font-bold flex items-center justify-center text-sm">
            TV
          </div>
          <span className="font-bold text-base text-primary">Tax Vault</span>
        </div>
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-tax/15 text-tax border border-tax/30">
          Solana Devnet
        </span>
      </header>

      <main className="max-w-xl mx-auto w-full">
        <div className="bg-surface rounded-card border border-border p-6 md:p-8 shadow-xl space-y-6">
          {/* Invoice Header */}
          <div className="flex justify-between items-start pb-4 border-b border-border">
            <div>
              <span className="text-xs font-semibold uppercase text-muted block mb-1">
                USDC Client Invoice
              </span>
              <h1 className="text-xl font-bold text-primary">Alex Morgan</h1>
              <span className="text-xs text-muted font-mono">Reference: {refParam}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-spend px-2 py-0.5 rounded bg-spend/15 border border-spend/30">
                Awaiting Payment
              </span>
            </div>
          </div>

          {paidTx ? (
            /* Confirmed Payment Receipt */
            <div className="p-6 rounded-2xl bg-spend/10 border border-spend/30 text-center space-y-4 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-spend/20 text-spend flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary">Payment Successfully Confirmed</h3>
                <p className="text-xs text-muted mt-1">
                  Transferred {formatUSDC(paidTx.amount)} to worker vault inbox on Solana Devnet.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-border text-xs font-mono space-y-1">
                <div className="text-muted">Transaction ID:</div>
                <div className="text-primary font-semibold">{paidTx.txId}</div>
              </div>

              <div className="text-[11px] text-muted">
                Receipt generated · Non-custodial worker vault settlement complete.
              </div>
            </div>
          ) : (
            /* Payment Input & Form */
            <form onSubmit={handlePay} className="space-y-5">
              {/* Amount Input */}
              <div>
                <label className="text-xs font-medium text-muted uppercase block mb-1">
                  Invoice Amount (USDC)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-muted text-lg font-bold">$</span>
                  <input
                    type="text"
                    required
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="w-full bg-surface-elevated border border-border rounded-xl pl-9 pr-4 py-3 text-xl font-mono font-bold text-primary focus:outline-none focus:border-spend"
                  />
                  <span className="absolute right-4 top-3.5 text-xs font-semibold text-muted font-mono">
                    USDC
                  </span>
                </div>
              </div>

              {/* Payer Name & Memo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-muted block mb-1">Your Name / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Studio"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    className="w-full bg-surface-elevated border border-border rounded-xl px-3 py-2 text-primary focus:outline-none focus:border-spend"
                  />
                </div>
                <div>
                  <label className="text-muted block mb-1">Memo / Invoice Notes</label>
                  <input
                    type="text"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    className="w-full bg-surface-elevated border border-border rounded-xl px-3 py-2 text-primary focus:outline-none focus:border-spend"
                  />
                </div>
              </div>

              {/* Worker Inbox & QR Code */}
              <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {qrDataUrl && (
                    <div className="bg-white p-2 rounded-xl shrink-0">
                      <img src={qrDataUrl} alt="Payment QR Code" className="w-28 h-28" />
                    </div>
                  )}

                  <div className="space-y-2 text-xs flex-1">
                    <div>
                      <span className="text-muted block text-[11px]">Worker Destination Address:</span>
                      <span className="font-mono text-primary font-medium break-all">
                        {workerPubkey}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-3 py-1.5 rounded-lg bg-surface hover:bg-border border border-border text-xs text-muted hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-spend" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied" : "Copy Address"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Pay Action Button */}
              <button
                type="submit"
                disabled={isPaying || parseUSDC(amountInput) <= 0n}
                className="w-full py-3.5 px-4 rounded-xl bg-spend hover:bg-spend/90 text-black font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-spend/10 disabled:opacity-50"
              >
                <Wallet className="w-4 h-4" />
                <span>{isPaying ? "Authorizing Solana Payment..." : `Pay ${formatUSDC(parseUSDC(amountInput))} with Solana Wallet`}</span>
              </button>
            </form>
          )}

          {/* Privacy Notice */}
          <div className="pt-2 border-t border-border flex items-start gap-2 text-xs text-muted">
            <ShieldCheck className="w-4 h-4 text-tax shrink-0 mt-0.5" />
            <span className="text-[11px] leading-relaxed">
              Confidential payment link. The recipient freelancer's private vault allocation rules, internal balances, and tax reserve parameters are never disclosed on public client invoices.
            </span>
          </div>
        </div>
      </main>

      <footer className="max-w-xl mx-auto w-full pt-6 text-center">
        <TaxDisclaimer className="justify-center" />
      </footer>
    </div>
  );
}
