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
    { name: "Overview", href: "/app", icon: LayoutDashboard },
    { name: "Vaults", href: "/app/vaults", icon: Vault },
    { name: "Rules", href: "/app/rules", icon: Sliders },
    { name: "Payments", href: "/app/payments", icon: Receipt },
    { name: "Clients", href: "/app/clients", icon: Users },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border px-2 py-1.5 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? "text-spend font-bold" : "text-muted hover:text-primary"
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? "text-spend" : "text-muted"}`} />
            <span>{item.name}</span>
          </Link>
        );
      })}
      <button
        onClick={() => setIsDemoDrawerOpen(true)}
        className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium text-tax"
      >
        <Sparkles className="w-4 h-4" />
        <span>Simulate</span>
      </button>
    </nav>
  );
}
