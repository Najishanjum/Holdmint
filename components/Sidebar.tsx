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
} from "lucide-react";
import { useVault } from "@/lib/store/vault-store";
import { TaxDisclaimer } from "./TaxDisclaimer";

export function Sidebar() {
  const pathname = usePathname();
  const { notifications, setIsDemoDrawerOpen } = useVault();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navItems = [
    { name: "OVERVIEW", href: "/app", icon: LayoutDashboard },
    { name: "VAULTS", href: "/app/vaults", icon: Vault },
    { name: "SPLIT RULES", href: "/app/rules", icon: Sliders },
    { name: "PAYMENTS", href: "/app/payments", icon: Receipt },
    { name: "CLIENTS & LINKS", href: "/app/clients", icon: Users },
    { name: "ANALYTICS", href: "/app/analytics", icon: BarChart3 },
    { name: "TAX DEADLINES", href: "/app/deadlines", icon: CalendarDays },
    { name: "APPROVED PAYEES", href: "/app/payees", icon: ShieldCheck },
    { name: "EXPORT & REPORTS", href: "/app/export", icon: FileDown },
    { name: "NOTIFICATIONS", href: "/app/notifications", icon: Bell, badge: unreadCount },
    { name: "SETTINGS", href: "/app/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r-2 border-[#050505] bg-[#09090B] text-white flex flex-col justify-between shrink-0 hidden md:flex min-h-screen sticky top-0 h-screen overflow-y-auto">
      <div>
        {/* Navigation Items */}
        <div className="p-3">
          <div className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#A1A1AA]">
            FINANCIAL DASHBOARD
          </div>
          <nav className="space-y-1 mt-1 font-display font-bold text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-[4px] tracking-wider transition-all border ${
                    isActive
                      ? "bg-[#5919F6] text-white border-[#050505] neo-shadow-sm font-black"
                      : "text-[#B8B5C5] border-transparent hover:text-white hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#E8FF00]" : "text-[#B8B5C5]"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-[#E8FF00] text-[#050505] font-mono">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Simulator Button & Disclaimers */}
      <div className="p-3 border-t-2 border-[#050505] space-y-3 bg-[#09090B]">
        <button
          onClick={() => setIsDemoDrawerOpen(true)}
          className="w-full py-2.5 px-3 rounded-[4px] bg-[#E8FF00] hover:bg-yellow-300 text-[#050505] border-2 border-[#050505] font-display font-black text-xs uppercase flex items-center justify-center gap-2 neo-btn tracking-wider"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>SIMULATE PAYMENT</span>
        </button>

        <TaxDisclaimer className="w-full justify-center" />
      </div>
    </aside>
  );
}
