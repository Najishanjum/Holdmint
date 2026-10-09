"use client";

import React from "react";

export function TickerBar() {
  const items = [
    "NON-CUSTODIAL",
    "SOURCE-LEVEL SPLITS",
    "APPROVED TAX PAYEE LOCKED",
    "SOLANA DEVNET ENGINE",
    "AUTOMATIC SAVINGS TREASURY",
    "ZERO ACCIDENTAL TAX SPENDING",
    "MOCK USDC 6-DECIMAL INTEGER MATH",
  ];

  return (
    <div className="w-full bg-[#E8FF00] border-y-2 border-[#050505] text-[#050505] overflow-hidden py-1.5 select-none font-display font-bold text-xs uppercase tracking-wider">
      <div className="animate-ticker flex items-center gap-8 whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center gap-8">
            <span>{text}</span>
            <span className="w-1.5 h-1.5 bg-[#050505] rounded-full inline-block" />
          </div>
        ))}
      </div>
    </div>
  );
}
