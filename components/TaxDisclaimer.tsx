import React from "react";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function TaxDisclaimer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#121217] border-2 border-[#050505] text-[#050505] dark:text-white rounded-[4px] neo-shadow-sm select-none font-mono text-[11px] font-semibold",
        className
      )}
    >
      <ShieldAlert className="w-3.5 h-3.5 text-[#FFBD45] shrink-0" />
      <span className="tracking-tight uppercase">
        Estimate, not tax advice · Non-custodial · Unaudited, devnet
      </span>
    </div>
  );
}
