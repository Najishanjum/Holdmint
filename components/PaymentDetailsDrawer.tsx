"use client";

import React from "react";
import { X, Receipt, CheckCircle, ExternalLink, ShieldAlert, Sparkles, Copy, Check } from "lucide-react";
import { PaymentRecordItem } from "@/lib/services/types";
import { formatUSDC, truncateAddress } from "@/lib/utils/format-usdc";

interface PaymentDetailsDrawerProps {
  payment: PaymentRecordItem | null;
  onClose: () => void;
}

export function PaymentDetailsDrawer({ payment, onClose }: PaymentDetailsDrawerProps) {
  const [copied, setCopied] = React.useState(false);

  if (!payment) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface border-l border-border shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-surface-elevated text-spend">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-primary">Transaction Details</h3>
                <span className="text-xs text-muted font-mono">{payment.invoiceRef || payment.id}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-surface-elevated text-muted hover:text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            {/* Status & Gross Amount */}
            <div className="p-4 rounded-xl bg-surface-elevated border border-border text-center space-y-1">
              <span className="text-muted block text-xs">Gross Received</span>
              <div className="text-3xl font-bold font-mono text-primary tnum">
                {formatUSDC(payment.grossAmount)}
              </div>
              <div className="pt-1 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-spend" />
                <span className="capitalize font-semibold text-spend text-xs">{payment.status}</span>
                {payment.isSimulated && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-tax/20 text-tax border border-tax/30 uppercase">
                    Simulated
                  </span>
                )}
              </div>
            </div>

            {/* Atomic Three-Vault Split Breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-primary block">
                Source Split Allocations
              </span>
              <div className="p-3.5 rounded-xl bg-surface-elevated border border-border space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-spend" />
                    <span className="text-muted">Spend Vault</span>
                  </div>
                  <span className="font-mono font-semibold text-spend text-sm">
                    {formatUSDC(payment.spendAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-tax" />
                    <span className="text-muted">Tax Vault (Locked)</span>
                  </div>
                  <span className="font-mono font-semibold text-tax text-sm">
                    {formatUSDC(payment.taxAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-savings" />
                    <span className="text-muted">Savings Vault</span>
                  </div>
                  <span className="font-mono font-semibold text-savings text-sm">
                    {formatUSDC(payment.savingsAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payer and Metadata */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-primary block">Metadata</span>
              <div className="p-3.5 rounded-xl bg-surface-elevated border border-border space-y-2 font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-muted font-sans">Client:</span>
                  <span className="text-primary font-sans font-medium">{payment.payerName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted font-sans">Memo:</span>
                  <span className="text-primary font-sans">{payment.memo || "Consulting fees"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted font-sans">Date:</span>
                  <span className="text-primary">{new Date(payment.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted font-sans">Payer Address:</span>
                  <span className="text-primary">{truncateAddress(payment.payer, 4)}</span>
                </div>
                {payment.txSignature && (
                  <div className="flex justify-between items-center pt-1 border-t border-border">
                    <span className="text-muted font-sans">Signature:</span>
                    <button
                      onClick={() => handleCopy(payment.txSignature!)}
                      className="text-spend hover:underline flex items-center gap-1"
                    >
                      <span>{truncateAddress(payment.txSignature, 4)}</span>
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Notice */}
            <div className="p-3 rounded-xl bg-surface-elevated border border-border flex items-start gap-2 text-muted">
              <ShieldAlert className="w-4 h-4 text-tax shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                Tokens deposited directly into the program vault accounts. Non-custodial worker-controlled enforcement.
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-border">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-surface-elevated hover:bg-border border border-border text-primary font-medium text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
