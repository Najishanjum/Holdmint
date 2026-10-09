"use client";

import React, { useState } from "react";
import { X, Wallet, Check, Copy, ExternalLink, ShieldAlert, Sparkles } from "lucide-react";
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
    }, 600);
  };

  const wallets = [
    { name: "Phantom", icon: "🟣", detected: true },
    { name: "Solflare", icon: "🟠", detected: true },
    { name: "Backpack", icon: "🎒", detected: true },
    { name: "Demo Worker Wallet (Simulated)", icon: "⚡", detected: true, isDemo: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-surface border border-border rounded-card p-6 shadow-2xl relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-surface-elevated text-spend">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-title" className="text-base font-semibold text-primary">
                {isWalletConnected ? "Connected Wallet" : "Connect Solana Wallet"}
              </h2>
              <p className="text-xs text-muted">Solana Devnet · Non-custodial</p>
            </div>
          </div>
          <button
            onClick={() => setIsConnectModalOpen(false)}
            className="p-1.5 rounded-lg hover:bg-surface-elevated text-muted hover:text-primary transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isWalletConnected ? (
          <div className="py-6 space-y-4">
            <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-2">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Active Address</span>
                <span className="flex items-center gap-1 text-spend">
                  <span className="w-2 h-2 rounded-full bg-spend" />
                  Devnet Connected
                </span>
              </div>
              <div className="flex items-center justify-between font-mono text-sm text-primary">
                <span>{truncateAddress(walletAddress, 6)}</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-muted hover:text-primary transition-colors px-2 py-1 rounded bg-surface border border-border"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-spend" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  disconnectWallet();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl border border-danger/30 text-danger hover:bg-danger/10 text-sm font-medium transition-colors"
              >
                Disconnect
              </button>
              <button
                onClick={() => setIsConnectModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-spend text-black font-semibold text-sm hover:opacity-95 transition-opacity"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="py-5 space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted uppercase tracking-wider">
                Select a Solana Wallet
              </p>
              <div className="space-y-2">
                {wallets.map((w) => (
                  <button
                    key={w.name}
                    disabled={connectingWallet !== null}
                    onClick={() => handleSelectWallet(w.name)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-elevated hover:bg-border/60 border border-border transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{w.icon}</span>
                      <div>
                        <div className="text-sm font-medium text-primary group-hover:text-spend transition-colors">
                          {w.name}
                        </div>
                        {w.isDemo && (
                          <div className="text-[11px] text-tax">Pre-funded Alex Morgan simulation profile</div>
                        )}
                      </div>
                    </div>
                    {connectingWallet === w.name ? (
                      <span className="text-xs text-muted animate-pulse">Connecting...</span>
                    ) : (
                      <span className="text-xs text-muted group-hover:text-primary">Connect →</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-elevated border border-border flex items-start gap-2.5 text-xs text-muted">
              <ShieldAlert className="w-4 h-4 text-tax shrink-0 mt-0.5" />
              <span>
                Tax Vault is non-custodial. Your keys remain in your wallet at all times. We never request private keys or seed phrases.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
