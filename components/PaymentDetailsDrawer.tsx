"use client";

import React, { useState } from "react";
import { X, Receipt, ShieldAlert, Copy, Check } from "lucide-react";
import { PaymentRecordItem } from "@/lib/services/types";
import { formatUSDC, truncateAddress } from "@/lib/utils/format-usdc";

interface PaymentDetailsDrawerProps {
  payment: PaymentRecordItem | null;
  onClose: () => void;
}

export function PaymentDetailsDrawer({ payment, onClose }: PaymentDetailsDrawerProps) {
  const [copied, setCopied] = useState(false);

  if (!payment) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white text-[#050505] border-l-2 border-[#050505] shadow-2xl flex flex-col justify-between">
          {/* Window Header */}
          <div className="bg-[#050505] text-white p-4 flex items-center justify-between border-b-2 border-[#050505]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E8FF00] inline-block" />
              <h3 className="font-display font-black text-sm uppercase tracking-wider text-white">
                TRANSACTION AUDIT LOG
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded bg-white text-black font-bold flex items-center justify-center text-xs"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            {/* Amount Banner */}
            <div className="p-4 rounded-[6px] bg-[#F2F0F7] border-2 border-[#050505] text-center space-y-1 neo-shadow-sm">
              <span className="text-[#696574] font-mono font-bold uppercase text-[10px] block">
                GROSS INCOMING PAYMENT
              </span>
              <div className="text-3xl font-display font-black text-[#050505] tnum">
                {formatUSDC(payment.grossAmount)}
              </div>
              <div className="pt-1 flex items-center justify-center gap-1.5 font-mono">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#E8FF00] text-black border border-black">
                  {payment.status}
                </span>
                {payment.isSimulated && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#8790FF] text-black border border-black">
                    SIMULATED
                  </span>
                )}
              </div>
            </div>

            {/* Split Allocations */}
            <div className="space-y-2">
              <span className="font-display font-black text-xs uppercase tracking-wider text-[#050505] block">
                ATOMIC ROUTING BREAKDOWN
              </span>
              <div className="p-3.5 rounded-[6px] bg-white border-2 border-[#050505] neo-shadow-sm space-y-2 font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#21D99B] border border-black" />
                    <span>SPEND VAULT (70%)</span>
                  </div>
                  <span className="font-bold text-[#050505]">{formatUSDC(payment.spendAmount)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD45] border border-black" />
                    <span>TAX VAULT (25% - LOCKED)</span>
                  </div>
                  <span className="font-bold text-[#050505]">{formatUSDC(payment.taxAmount)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8790FF] border border-black" />
                    <span>SAVINGS VAULT (5%)</span>
                  </div>
                  <span className="font-bold text-[#050505]">{formatUSDC(payment.savingsAmount)}</span>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-2">
              <span className="font-display font-black text-xs uppercase tracking-wider text-[#050505] block">
                TRANSACTION METADATA
              </span>
              <div className="p-3.5 rounded-[6px] bg-[#F2F0F7] border border-[#050505] space-y-2 font-mono text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-[#696574]">Payer:</span>
                  <span className="font-bold text-[#050505]">{payment.payerName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#696574]">Memo:</span>
                  <span className="text-[#050505]">{payment.memo || "None"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#696574]">Timestamp:</span>
                  <span className="text-[#050505]">{new Date(payment.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#696574]">Payer Address:</span>
                  <span className="text-[#050505]">{truncateAddress(payment.payer, 4)}</span>
                </div>
                {payment.txSignature && (
                  <div className="flex justify-between items-center pt-1 border-t border-[#050505]">
                    <span className="text-[#696574]">Signature:</span>
                    <button
                      onClick={() => handleCopy(payment.txSignature!)}
                      className="text-[#5919F6] font-bold hover:underline flex items-center gap-1"
                    >
                      <span>{truncateAddress(payment.txSignature, 4)}</span>
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 rounded-[4px] bg-white border border-[#050505] flex items-start gap-2 text-[#696574] text-[11px] leading-relaxed">
              <ShieldAlert className="w-4 h-4 text-[#FFBD45] shrink-0 mt-0.5" />
              <span>
                Tokens deposited atomically into Program-Derived Accounts. Non-custodial, worker-governed.
              </span>
            </div>
          </div>

          <div className="p-4 border-t-2 border-[#050505] bg-[#F2F0F7]">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-[4px] bg-[#050505] text-white font-display font-black text-xs uppercase neo-btn tracking-wider hover:bg-[#5919F6]"
            >
              CLOSE AUDIT LOG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
