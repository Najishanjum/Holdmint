import React from "react";
import { cn } from "@/lib/utils/cn";

export function NetworkBadge({
  isDemo = true,
  className,
}: {
  isDemo?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-surface-elevated border border-border text-primary">
        <span className="w-1.5 h-1.5 rounded-full bg-spend animate-pulse" />
        <span>Solana Devnet</span>
      </div>
      {isDemo && (
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider bg-tax/15 text-tax border border-tax/30 uppercase">
          Simulated
        </span>
      )}
    </div>
  );
}
