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
    <div className={cn("flex items-center gap-1.5 font-mono text-xs", className)}>
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-white border-2 border-[#050505] text-[#050505] font-bold neo-shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#21D99B] animate-pulse" />
        <span className="uppercase text-[11px]">SOLANA DEVNET</span>
      </div>
      {isDemo && (
        <span className="px-2 py-1 rounded-[4px] text-[10px] font-extrabold tracking-wider bg-[#E8FF00] text-[#050505] border-2 border-[#050505] uppercase neo-shadow-sm">
          SIMULATED
        </span>
      )}
    </div>
  );
}
