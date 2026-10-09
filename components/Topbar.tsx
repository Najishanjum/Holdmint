"use client";

import React from "react";
import Link from "next/link";
import { Bell, Wallet, Sparkles, ExternalLink } from "lucide-react";
import { useVault } from "@/lib/store/vault-store";
import { NetworkBadge } from "./NetworkBadge";
import { ThemeToggle } from "./ThemeToggle";
import { truncateAddress } from "@/lib/utils/format-usdc";

export function Topbar() {
  const {
    profile,
    isWalletConnected,
    walletAddress,
    setIsConnectModalOpen,
    setIsDemoDrawerOpen,
    notifications,
  } = useVault();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="h-16 border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between">
      {/* Left: Mobile brand & Desktop breadcrumb/greeting */}
      <div className="flex items-center gap-3">
        <Link href="/" className="md:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary text-background font-bold flex items-center justify-center text-xs">
            TV
          </div>
          <span className="font-bold text-sm text-primary">Tax Vault</span>
        </Link>
        <div className="hidden md:block">
          <h1 className="text-sm font-semibold text-primary">
            Welcome back, <span className="text-spend">{profile.displayName}</span>
          </h1>
          <p className="text-[11px] text-muted">Non-custodial split enforcement active</p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5">
        <NetworkBadge isDemo={profile.isSimulated} className="hidden sm:flex" />

        {/* Demo simulator trigger */}
        <button
          onClick={() => setIsDemoDrawerOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-border border border-border text-xs font-medium text-tax transition-colors"
          title="Open Payment Split Simulator"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simulator</span>
        </button>

        {/* Notification bell */}
        <Link
          href="/app/notifications"
          className="relative p-2 rounded-lg bg-surface hover:bg-surface-elevated border border-border text-muted hover:text-primary transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-tax text-black font-bold text-[10px] flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Wallet Connect Button */}
        <button
          onClick={() => setIsConnectModalOpen(true)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isWalletConnected
              ? "bg-surface-elevated text-primary border-border hover:border-muted"
              : "bg-spend text-black border-spend hover:opacity-90"
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>
            {isWalletConnected ? truncateAddress(walletAddress, 4) : "Connect Wallet"}
          </span>
        </button>
      </div>
    </header>
  );
}
