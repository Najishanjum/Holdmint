"use client";

import React, { useState, useEffect, Suspense } from "react";
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
  Terminal,
} from "lucide-react";
import { useVault } from "@/lib/store/vault-store";
import { parseUSDC, formatUSDC, truncateAddress } from "@/lib/utils/format-usdc";
import { TaxDisclaimer } from "@/components/TaxDisclaimer";

function ClientPayContent() {
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
    QRCode.toDataURL(payUri, { width: 220, margin: 1 })
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
    <div className="min-h-screen bg-[#09090B] flex flex-col justify-between p-4 md:p-8">
      <header className="max-w-xl mx-auto w-full flex items-center justify-between pb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#E8FF00] text-black font-mono font-black flex items-center justify-center neo-border text-base">
            TV
          </div>
          <div>
            <span className="font-display font-black text-2xl uppercase tracking-tight text-white block leading-none">
              TAX VAULT
            </span>
            <span className="font-mono text-[9px] text-[#E8FF00] tracking-widest uppercase">
              PAYMENT GATEWAY
            </span>
          </div>
        </div>

        <span className="px-2.5 py-1 bg-[#050505] text-[#E8FF00] neo-border font-mono text-[11px] font-black uppercase">
          SOLANA DEVNET
        </span>
      </header>

      <main className="max-w-xl mx-auto w-full">
        <div className="bg-white neo-border neo-shadow-lg">
          {/* Terminal Window Header */}
          <div className="bg-[#050505] text-white px-5 py-3 flex items-center justify-between border-b-2 border-black font-mono text-xs">
            <span className="text-[#E8FF00] font-bold uppercase tracking-wider">
              CLIENT INVOICE // REFERENCE: {refParam}
            </span>
            <span className="px-2 py-0.5 bg-[#21D99B] text-black font-black uppercase text-[10px]">
              AWAITING PAYMENT
            </span>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Invoice Info */}
            <div className="flex justify-between items-start pb-4 border-b-2 border-black">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-black/60 block mb-0.5">
                  PAYEE FREELANCER
                </span>
                <h1 className="font-display text-3xl font-black uppercase tracking-tight text-black">
                  Alex Morgan
                </h1>
                <span className="text-xs text-black/70 font-mono block mt-0.5">
                  Professional Engineering & Smart Contract Design
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs bg-[#F2F0F7] neo-border px-2.5 py-1 font-bold text-black uppercase block">
                  USDC ONLY
                </span>
              </div>
            </div>

            {paidTx ? (
              /* Confirmed Payment Receipt */
              <div className="p-6 bg-[#E8FF00]/25 neo-border text-center space-y-4 animate-in fade-in">
                <div className="w-14 h-14 bg-black text-[#E8FF00] neo-border flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-black uppercase tracking-tight text-black">
                    Payment Confirmed On Solana
                  </h3>
                  <p className="text-xs font-mono text-black/80 mt-1">
                    Transferred <strong>{formatUSDC(paidTx.amount)}</strong> to worker vault inbox on Devnet.
                  </p>
                </div>

                <div className="p-3.5 bg-white neo-border text-xs font-mono space-y-1 text-left">
                  <div className="text-black/60 uppercase font-bold text-[10px]">Devnet Signature:</div>
                  <div className="text-black font-bold break-all">{paidTx.txId}</div>
                </div>

                <div className="text-[11px] font-mono text-black font-bold uppercase">
                  ✓ Receipt generated · Non-custodial worker vault settlement complete.
                </div>
              </div>
            ) : (
              /* Payment Input & Form */
              <form onSubmit={handlePay} className="space-y-5">
                {/* Amount Input */}
                <div>
                  <label className="text-xs font-mono font-bold text-black uppercase block mb-1">
                    Invoice Amount (USDC)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-black font-mono text-xl font-black">$</span>
                    <input
                      type="text"
                      required
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      className="w-full bg-[#F2F0F7] neo-border pl-9 pr-20 py-3.5 text-2xl font-mono font-black text-black focus:outline-none focus:bg-white"
                    />
                    <span className="absolute right-4 top-4 text-xs font-mono font-black text-black bg-[#E8FF00] px-2 py-0.5 neo-border">
                      USDC
                    </span>
                  </div>
                </div>

                {/* Payer Name & Memo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <label className="text-black font-bold uppercase block mb-1">Payer / Organization</label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Studio LLC"
                      value={payerName}
                      onChange={(e) => setPayerName(e.target.value)}
                      className="w-full bg-[#F2F0F7] neo-border px-3.5 py-2.5 text-black font-mono focus:outline-none focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-black font-bold uppercase block mb-1">Memo / Invoice Description</label>
                    <input
                      type="text"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      className="w-full bg-[#F2F0F7] neo-border px-3.5 py-2.5 text-black font-mono focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                {/* Worker Destination & QR Code */}
                <div className="p-4 bg-[#F2F0F7] neo-border space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {qrDataUrl && (
                      <div className="bg-white p-2 neo-border shrink-0">
                        <img src={qrDataUrl} alt="Payment QR Code" className="w-28 h-28" />
                      </div>
                    )}

                    <div className="space-y-2 text-xs font-mono flex-1">
                      <div>
                        <span className="text-black/60 uppercase font-bold block text-[10px]">
                          Worker Destination PDA:
                        </span>
                        <span className="font-mono text-black font-bold break-all block text-[11px]">
                          {workerPubkey}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopy}
                        className="neo-btn px-3 py-1.5 bg-white hover:bg-[#E8FF00] neo-border text-xs font-bold text-black transition-colors flex items-center gap-1.5 uppercase"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-black font-black" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? "COPIED" : "COPY ADDRESS"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pay Action Button */}
                <button
                  type="submit"
                  disabled={isPaying || parseUSDC(amountInput) <= 0n}
                  className="w-full neo-btn py-4 px-5 bg-[#5919F6] hover:bg-[#4d13dd] text-white font-mono font-black text-sm uppercase tracking-wider neo-border neo-shadow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Wallet className="w-4 h-4" />
                  <span>
                    {isPaying
                      ? "AUTHORIZING DEVNET SETTLEMENT..."
                      : `PAY ${formatUSDC(parseUSDC(amountInput))} WITH SOLANA WALLET`}
                  </span>
                </button>
              </form>
            )}

            {/* Privacy Notice */}
            <div className="pt-3 border-t-2 border-black flex items-start gap-2.5 text-xs font-mono text-black/70">
              <ShieldCheck className="w-4 h-4 text-[#21D99B] shrink-0 mt-0.5" />
              <span className="text-[11px] leading-relaxed">
                <strong>Confidential Routing:</strong> The recipient freelancer's private vault allocation rules, internal tax ratios, and savings balances are cryptographically isolated and never revealed to client invoices.
              </span>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-xl mx-auto w-full pt-6 text-center">
        <TaxDisclaimer className="justify-center" />
      </footer>
    </div>
  );
}

export default function ClientPayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#09090B] text-[#E8FF00] font-mono flex items-center justify-center text-xs">
          INITIALIZING SECURE PAYMENT PORTAL...
        </div>
      }
    >
      <ClientPayContent />
    </Suspense>
  );
}
