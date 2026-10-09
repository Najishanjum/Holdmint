"use client";

import React, { useState } from "react";
import { X, HelpCircle, ChevronRight, Check, Copy, ExternalLink, ShieldAlert } from "lucide-react";
import { useVault } from "@/lib/store/vault-store";
import { DEMO_WORKER_PUBKEY } from "@/lib/demo/seed-data";
import { truncateAddress } from "@/lib/utils/format-usdc";

export function ConnectModal() {
  const {
    isConnectModalOpen,
    setIsConnectModalOpen,
    isWalletConnected,
    walletAddress,
    connectWallet,
    disconnectWallet,
  } = useVault();

  const [copied, setCopied] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);

  if (!isConnectModalOpen) return null;

  const handleCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSelectWallet = (name: string, mockAddress?: string) => {
    setConnectingWallet(name);
    setTimeout(() => {
      connectWallet(mockAddress || DEMO_WORKER_PUBKEY);
      setConnectingWallet(null);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-[390px] bg-white text-[#050505] rounded-[28px] p-6 shadow-2xl relative border-2 border-[#050505] neo-shadow"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header matching provided reference */}
        <div className="flex items-center justify-between pb-4">
          <button
            type="button"
            className="p-1 rounded-full text-[#696574] hover:text-[#050505] transition-colors"
            title="Help & Info"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <h2 id="modal-title" className="text-base font-bold text-[#050505] tracking-tight">
            {isWalletConnected ? "Connected Account" : "Connect Wallet"}
          </h2>

          <button
            onClick={() => setIsConnectModalOpen(false)}
            className="p-1 rounded-full text-[#696574] hover:text-[#050505] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isWalletConnected ? (
          <div className="py-4 space-y-4">
            <div className="p-4 rounded-2xl bg-[#F2F0F7] border border-[#E5E3ED] space-y-2">
              <div className="flex items-center justify-between text-xs text-[#696574]">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Active Address</span>
                <span className="flex items-center gap-1.5 font-bold text-[#21D99B]">
                  <span className="w-2 h-2 rounded-full bg-[#21D99B]" />
                  Devnet Connected
                </span>
              </div>
              <div className="flex items-center justify-between font-mono text-xs font-bold text-[#050505] pt-1">
                <span>{truncateAddress(walletAddress, 6)}</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] font-sans px-2.5 py-1 rounded-lg bg-white border border-[#050505] hover:bg-[#E8FF00] transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#21D99B]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => disconnectWallet()}
                className="flex-1 py-3 px-4 rounded-xl border-2 border-[#F2677A] text-[#F2677A] hover:bg-[#F2677A]/10 font-bold text-xs uppercase transition-colors"
              >
                Disconnect
              </button>
              <button
                onClick={() => setIsConnectModalOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#5919F6] text-white font-bold text-xs uppercase neo-btn hover:bg-[#6C2BFF]"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="py-2 space-y-2">
            {/* 1. WalletConnect */}
            <button
              onClick={() => handleSelectWallet("WalletConnect")}
              disabled={connectingWallet !== null}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-[#F2F0F7] transition-all text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#3B99FC] flex items-center justify-center text-white shadow-sm shrink-0">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6.5 9.5C9.5 6.5 14.5 6.5 17.5 9.5L18 10L19.5 8.5L19 8C15.1 4.1 8.9 4.1 5 8L4.5 8.5L6 10L6.5 9.5ZM21.5 10.5L20 12L15.5 7.5C13.5 5.5 10.5 5.5 8.5 7.5L4 12L2.5 10.5L7 6C9.8 3.2 14.2 3.2 17 6L21.5 10.5Z"
                      fill="currentColor"
                    />
                    <path
                      d="M8.5 11.5L12 15L15.5 11.5C14.5 10.5 13.3 10 12 10C10.7 10 9.5 10.5 8.5 11.5Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-[#050505] tracking-tight">
                  WalletConnect
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-[#E0F2FE] text-[#0284C7] uppercase">
                  QR Code
                </span>
                <ChevronRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#050505] transition-colors" />
              </div>
            </button>

            {/* 2. Binance Wallet */}
            <button
              onClick={() => handleSelectWallet("Binance Wallet")}
              disabled={connectingWallet !== null}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-[#F2F0F7] transition-all text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0B0E11] flex items-center justify-center text-[#F0B90B] shadow-sm shrink-0">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.5 5.5L13.4 7.6L12 6.2L10.6 7.6L8.5 5.5L12 2ZM5.5 8.5L7.6 10.6L6.2 12L7.6 13.4L5.5 15.5L2 12L5.5 8.5ZM18.5 8.5L22 12L18.5 15.5L16.4 13.4L17.8 12L16.4 10.6L18.5 8.5ZM12 22L8.5 18.5L10.6 16.4L12 17.8L13.4 16.4L15.5 18.5L12 22ZM12 9.8L14.2 12L12 14.2L9.8 12L12 9.8Z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-[#050505] tracking-tight">
                  Binance Wallet
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#050505] transition-colors" />
            </button>

            {/* 3. MetaMask */}
            <button
              onClick={() => handleSelectWallet("MetaMask")}
              disabled={connectingWallet !== null}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-[#F2F0F7] transition-all text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E3ED] flex items-center justify-center shadow-sm shrink-0">
                  <svg className="w-7 h-7" viewBox="0 0 32 32">
                    <path d="M29.5 3L17.8 11.5L20 6.5L29.5 3Z" fill="#E2761B" stroke="#E2761B" />
                    <path d="M2.5 3L12 6.5L14.2 11.5L2.5 3Z" fill="#E4761B" stroke="#E4761B" />
                    <path d="M25 22.5L22 27L28.5 28.5L30 22.2L25 22.5Z" fill="#E4761B" stroke="#E4761B" />
                    <path d="M2 22.2L3.5 28.5L10 27L7 22.5L2 22.2Z" fill="#E4761B" stroke="#E4761B" />
                    <path d="M9.5 14L7.5 17L14 17.5L13.8 10.5L9.5 14Z" fill="#E4761B" stroke="#E4761B" />
                    <path d="M22.5 14L18.2 10.5L18 17.5L24.5 17L22.5 14Z" fill="#E4761B" stroke="#E4761B" />
                    <path d="M10 27L13.8 25L10.5 22.5L10 27Z" fill="#D7C1B3" stroke="#D7C1B3" />
                    <path d="M22 27L21.5 22.5L18.2 25L22 27Z" fill="#D7C1B3" stroke="#D7C1B3" />
                    <path d="M13.8 25L18.2 25L17.5 28.5L14.5 28.5L13.8 25Z" fill="#233447" stroke="#233447" />
                    <path d="M16 19L11.5 18.5L14 23.5L16 23.5L18 23.5L20.5 18.5L16 19Z" fill="#CD6116" stroke="#CD6116" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-[#050505] tracking-tight">
                  MetaMask
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#050505] transition-colors" />
            </button>

            {/* 4. SafePal */}
            <button
              onClick={() => handleSelectWallet("SafePal")}
              disabled={connectingWallet !== null}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-[#F2F0F7] transition-all text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#5A3FFF] flex items-center justify-center text-white shadow-sm shrink-0">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 7C4 5.34 5.34 4 7 4H17C18.66 4 20 5.34 20 7V9H18V7C18 6.45 17.55 6 17 6H7C6.45 6 6 6.45 6 7V17C6 17.55 6.45 18 7 18H17C17.55 18 18 17.55 18 17V15H20V17C20 18.66 18.66 20 17 20H7C5.34 20 4 18.66 4 17V7ZM9 10H15V14H9V10Z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-[#050505] tracking-tight">
                  SafePal
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#050505] transition-colors" />
            </button>

            {/* 5. Trust Wallet */}
            <button
              onClick={() => handleSelectWallet("Trust Wallet")}
              disabled={connectingWallet !== null}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-[#F2F0F7] transition-all text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0500FF] via-[#0564FF] to-[#00FFE0] flex items-center justify-center text-white shadow-sm shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L4 6V12C4 17.52 7.42 22.5 12 24C16.58 22.5 20 17.52 20 12V6L12 2ZM18 12C18 16.42 15.45 20.35 12 21.84C8.55 20.35 6 16.42 6 12V7.47L12 4.47L18 7.47V12Z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-[#050505] tracking-tight">
                  Trust Wallet
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#050505] transition-colors" />
            </button>

            {/* 6. Phantom / Solflare (Solana Native) */}
            <button
              onClick={() => handleSelectWallet("Phantom")}
              disabled={connectingWallet !== null}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-[#F2F0F7] transition-all text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#AB9FF2] flex items-center justify-center text-[#211B3D] shadow-sm shrink-0">
                  <span className="text-lg font-bold">👻</span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-[#050505] tracking-tight block">
                    Phantom / Solana
                  </span>
                  <span className="text-[10px] text-[#5919F6] font-bold uppercase">Solana Native</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#050505] transition-colors" />
            </button>
          </div>
        )}

        {/* Footer exactly matching the reference "UX by . / reown" */}
        <div className="pt-5 mt-2 border-t border-[#F2F0F7] flex items-center justify-center gap-1.5 text-xs text-[#696574]">
          <span className="text-[11px] font-medium">UX by</span>
          <span className="w-3.5 h-3.5 rounded-full bg-[#E5E3ED] inline-block" />
          <span className="text-[#A1A1AA]">/</span>
          <span className="px-2 py-0.5 rounded-full bg-[#E5E3ED] text-[10px] font-bold text-[#050505]">
            reown
          </span>
        </div>
      </div>
    </div>
  );
}
