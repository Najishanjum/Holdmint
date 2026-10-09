"use client";

import React, { useState } from "react";
import { ShieldCheck, Edit2, Check } from "lucide-react";
import { useVault } from "@/lib/store/vault-store";
import { formatUSDC, parseUSDC } from "@/lib/utils/format-usdc";

export function ReadinessRing() {
  const { balances, profile, updateProjectedTaxNeed } = useVault();
  const [isEditing, setIsEditing] = useState(false);
  const [editStr, setEditStr] = useState((Number(profile.projectedTaxNeed) / 1000000).toFixed(2));

  const reservedTax = balances.tax;
  const projectedNeed = profile.projectedTaxNeed;

  let readinessPercent = 0;
  if (projectedNeed > 0n) {
    const ratio = Number(reservedTax) / Number(projectedNeed);
    readinessPercent = Math.min(Math.round(ratio * 100), 100);
  }

  const handleSave = () => {
    const parsed = parseUSDC(editStr);
    updateProjectedTaxNeed(parsed > 0n ? parsed : 2_500_000_000n);
    setIsEditing(false);
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (readinessPercent / 100) * circumference;

  return (
    <div className="bg-white text-[#050505] rounded-[6px] border-2 border-[#050505] neo-shadow flex flex-col justify-between overflow-hidden">
      {/* Title Bar */}
      <div className="bg-[#050505] text-white px-4 py-2 flex items-center justify-between border-b-2 border-[#050505]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD45] border border-black inline-block" />
          <h3 className="font-display font-black text-xs uppercase tracking-wider text-white">
            TAX READINESS
          </h3>
        </div>
        <span className="font-mono text-[11px] font-bold text-[#E8FF00]">ESTIMATE</span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-center my-3 gap-6">
          {/* SVG Progress Ring */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-[#F2F0F7] stroke-current"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-[#FFBD45] stroke-current transition-all duration-700 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="square"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-display font-black text-[#050505] tnum">{readinessPercent}%</span>
              <span className="text-[9px] uppercase font-mono font-bold text-[#696574]">FUNDED</span>
            </div>
          </div>

          {/* Breakdown Values */}
          <div className="space-y-2 text-xs flex-1 font-mono">
            <div>
              <span className="text-[#696574] block text-[10px] uppercase font-bold">RESERVED IN TAX VAULT</span>
              <span className="font-display font-black text-[#050505] text-lg tnum">
                {formatUSDC(reservedTax)}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between text-[10px] text-[#696574] font-bold uppercase">
                <span>TARGET ESTIMATE</span>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[#696574] hover:text-[#050505] transition-colors"
                    title="Edit target"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="text"
                    value={editStr}
                    onChange={(e) => setEditStr(e.target.value)}
                    className="w-20 px-2 py-0.5 rounded bg-[#F2F0F7] border border-[#050505] text-xs font-mono font-bold text-[#050505]"
                  />
                  <button
                    onClick={handleSave}
                    className="p-1 rounded bg-[#E8FF00] text-black border border-[#050505]"
                    title="Save"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <span className="font-display font-black text-[#696574] text-sm tnum">
                  {formatUSDC(projectedNeed)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-[#E5E3ED] text-[10px] text-[#696574] font-mono leading-tight uppercase">
          User-defined target indicator. Estimate only, not tax calculation or advice.
        </div>
      </div>
    </div>
  );
}
