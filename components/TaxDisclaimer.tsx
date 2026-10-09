import React from "react";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function TaxDisclaimer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-surface border border-border text-muted select-none",
        className
      )}
    >
      <ShieldAlert className="w-3.5 h-3.5 text-tax shrink-0" />
      <span className="font-medium text-[11px] leading-tight">
        Estimate, not tax advice · Non-custodial · Unaudited, devnet
      </span>
    </div>
  );
}
