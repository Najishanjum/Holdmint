"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Wallet, Sparkles } from "lucide-react";
import { useVault } from "@/lib/store/vault-store";
import { NetworkBadge } from "./NetworkBadge";
import { ThemeToggle } from "./ThemeToggle";
import { truncateAddress } from "@/lib/utils/format-usdc";

export function Topbar() {
  const pathname = usePathname();
  const {
    profile,
    isWalletConnected,
    walletAddress,
    setIsConnectModalOpen,
    setIsDemoDrawerOpen,
    notifications,
  } = useVault();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navLinks = [
    { name: "OVERVIEW", href: "/app" },
    { name: "VAULTS", href: "/app/vaults" },
    { name: "RULES", href: "/app/rules" },
    { name: "PAYMENTS", href: "/app/payments" },
    { name: "CLIENTS", href: "/app/clients" },
    { name: "ANALYTICS", href: "/app/analytics" },
    { name: "DEADLINES", href: "/app/deadlines" },
    { name: "EXPORT", href: "/app/export" },
  ];

  return (
    <header className="h-16 border-b-2 border-[#050505] bg-[#09090B] text-white sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between">
      {/* Left: Brand and Navigation Tabs */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-[4px] bg-[#5919F6] border-2 border-[#050505] text-white font-display font-black text-lg flex items-center justify-center neo-shadow-sm group-hover:bg-[#E8FF00] group-hover:text-[#050505] transition-colors">
            TV
          </div>
          <div>
            <span className="font-display font-black text-lg tracking-tight uppercase block leading-none">
              TAX VAULT
            </span>
            <span className="text-[10px] text-[#A1A1AA] font-mono tracking-wider">
              FINTECH × WEB3
            </span>
          </div>
        </Link>

        {/* Desktop Quick Nav Tabs */}
        <nav className="hidden xl:flex items-center gap-1 font-display font-bold text-xs">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-1.5 rounded-[4px] transition-all tracking-wider ${
                  isActive
                    ? "bg-[#5919F6] text-white border border-[#050505] neo-shadow-sm"
                    : "text-[#B8B5C5] hover:text-white hover:bg-white/10"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        <NetworkBadge isDemo={profile.isSimulated} className="hidden sm:flex" />

        {/* Demo Simulator Trigger Button */}
        <button
          onClick={() => setIsDemoDrawerOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#E8FF00] hover:bg-yellow-300 text-[#050505] font-display font-black text-xs uppercase neo-btn tracking-wider"
          title="Open Payment Split Simulator"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>SIMULATOR</span>
        </button>

        {/* Notification Bell */}
        <Link
          href="/app/notifications"
          className="relative p-2 rounded-[4px] bg-white text-[#050505] border-2 border-[#050505] neo-shadow-sm hover:bg-[#F2F0F7] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#E8FF00] border border-[#050505] text-[#050505] font-black text-[9px] flex items-center justify-center font-mono">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Theme Toggle */}
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>

        {/* Wallet Connect Button */}
        <button
          onClick={() => setIsConnectModalOpen(true)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] font-mono text-xs font-bold neo-btn tracking-tight ${
            isWalletConnected
              ? "bg-white text-[#050505] hover:bg-[#F2F0F7]"
              : "bg-[#5919F6] text-white hover:bg-[#6C2BFF]"
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>
            {isWalletConnected ? truncateAddress(walletAddress, 4) : "CONNECT WALLET"}
          </span>
        </button>
      </div>
    </header>
  );
}
