"use client";

import React, { useState } from "react";
import { ShieldCheck, Edit2, Check, Sparkles } from "lucide-react";
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
    <div className="bg-surface rounded-card border border-border p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-tax" />
          <h3 className="text-sm font-semibold text-primary">Tax Readiness</h3>
        </div>
        <span className="text-[11px] text-muted">Personal Planning</span>
      </div>

      <div className="flex items-center justify-center my-3 gap-6">
        {/* SVG Progress Ring */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              className="text-surface-elevated stroke-current"
              strokeWidth="9"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              className="text-tax stroke-current transition-all duration-700 ease-out"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-bold font-mono text-primary tnum">{readinessPercent}%</span>
            <span className="text-[9px] uppercase font-bold text-tax">Funded</span>
          </div>
        </div>

        {/* Breakdown Values */}
        <div className="space-y-2 text-xs flex-1">
          <div>
            <span className="text-muted block text-[11px]">Reserved in Tax Vault</span>
            <span className="font-mono font-bold text-tax text-sm tnum">
              {formatUSDC(reservedTax)}
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] text-muted">
              <span>Target Estimate</span>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-muted hover:text-primary transition-colors"
                  title="Edit target tax estimate"
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
                  className="w-20 px-2 py-0.5 rounded bg-surface-elevated border border-border text-xs font-mono text-primary"
                />
                <button
                  onClick={handleSave}
                  className="p-1 rounded bg-spend text-black"
                  title="Save"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <span className="font-mono font-medium text-primary text-xs tnum">
                {formatUSDC(projectedNeed)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-border text-[11px] text-muted leading-tight">
        User-defined target indicator. Estimate only, not tax calculation or legal advice.
      </div>
    </div>
  );
}
