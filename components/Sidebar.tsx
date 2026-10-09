"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Vault,
  Sliders,
  Receipt,
  Users,
  BarChart3,
  CalendarDays,
  ShieldCheck,
  FileDown,
  Bell,
  Settings,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useVault } from "@/lib/store/vault-store";
import { TaxDisclaimer } from "./TaxDisclaimer";

export function Sidebar() {
  const pathname = usePathname();
  const { notifications, setIsDemoDrawerOpen } = useVault();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navItems = [
    { name: "Overview", href: "/app", icon: LayoutDashboard },
    { name: "Vaults", href: "/app/vaults", icon: Vault },
    { name: "Split Rules", href: "/app/rules", icon: Sliders },
    { name: "Payments", href: "/app/payments", icon: Receipt },
    { name: "Clients & Links", href: "/app/clients", icon: Users },
    { name: "Analytics", href: "/app/analytics", icon: BarChart3 },
    { name: "Tax Deadlines", href: "/app/deadlines", icon: CalendarDays },
    { name: "Approved Payees", href: "/app/payees", icon: ShieldCheck },
    { name: "Export & Reports", href: "/app/export", icon: FileDown },
    { name: "Notifications", href: "/app/notifications", icon: Bell, badge: unreadCount },
    { name: "Settings", href: "/app/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-border bg-surface flex flex-col justify-between shrink-0 hidden md:flex min-h-screen sticky top-0 h-screen overflow-y-auto">
      <div>
        {/* Brand */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary text-background font-bold flex items-center justify-center text-sm shadow-md group-hover:scale-105 transition-transform">
              TV
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-primary">Tax Vault</span>
              <span className="block text-[10px] text-muted font-medium">Solana Fintech</span>
            </div>
          </Link>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-tax/15 text-tax border border-tax/30">
            Devnet
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-surface-elevated text-spend font-semibold border border-border"
                    : "text-muted hover:text-primary hover:bg-surface-elevated/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-spend" : "text-muted"}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-tax text-black">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Simulator Button & Disclaimers */}
      <div className="p-3 border-t border-border space-y-3">
        <button
          onClick={() => setIsDemoDrawerOpen(true)}
          className="w-full py-2.5 px-3 rounded-xl bg-tax/10 hover:bg-tax/20 text-tax border border-tax/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simulate Incoming Payment</span>
        </button>

        <TaxDisclaimer />
      </div>
    </aside>
  );
}
