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
  Sparkles,
} from "lucide-react";
import { useVault } from "@/lib/store/vault-store";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { setIsDemoDrawerOpen } = useVault();

  const items = [
    { name: "OVERVIEW", href: "/app", icon: LayoutDashboard },
    { name: "VAULTS", href: "/app/vaults", icon: Vault },
    { name: "RULES", href: "/app/rules", icon: Sliders },
    { name: "PAYMENTS", href: "/app/payments", icon: Receipt },
    { name: "CLIENTS", href: "/app/clients", icon: Users },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#09090B] border-t-2 border-[#050505] px-2 py-1.5 flex items-center justify-around font-display font-bold">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-[4px] text-[10px] tracking-wider transition-colors ${
              isActive
                ? "text-[#E8FF00] font-black bg-white/10"
                : "text-[#B8B5C5] hover:text-white"
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? "text-[#E8FF00]" : "text-[#B8B5C5]"}`} />
            <span>{item.name}</span>
          </Link>
        );
      })}
      <button
        onClick={() => setIsDemoDrawerOpen(true)}
        className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-[4px] text-[10px] tracking-wider text-[#E8FF00] font-black"
      >
        <Sparkles className="w-4 h-4" />
        <span>SIMULATE</span>
      </button>
    </nav>
  );
}
