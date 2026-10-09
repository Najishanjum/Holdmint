"use client";

import React, { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileBottomNav } from "./MobileBottomNav";
import { DemoDrawer } from "./DemoDrawer";
import { ConnectModal } from "./ConnectModal";
import { TaxDisclaimer } from "./TaxDisclaimer";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex text-primary">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-12">
          {children}
        </main>

        {/* Persistent bottom disclaimer */}
        <footer className="border-t border-border py-3 px-6 bg-surface/50 hidden md:flex items-center justify-between text-xs text-muted">
          <TaxDisclaimer />
          <span>Solana Devnet · Mock USDC Engine</span>
        </footer>

        {/* Mobile Navigation */}
        <MobileBottomNav />
      </div>

      {/* Persistent Dialogs */}
      <DemoDrawer />
      <ConnectModal />
    </div>
  );
}
