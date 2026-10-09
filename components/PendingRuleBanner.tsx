"use client";

import React, { useState, useEffect } from "react";
import { Clock, CheckCircle, ArrowRight } from "lucide-react";
import { useVault } from "@/lib/store/vault-store";

export function PendingRuleBanner() {
  const { profile, applyRules, cancelPendingRules, applyPayee, cancelPendingPayee } = useVault();
  const [nowSecs, setNowSecs] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const timer = setInterval(() => {
      setNowSecs(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!profile.hasPendingRules && !profile.hasPendingPayee) {
    return null;
  }

  const isRulesEligible =
    profile.hasPendingRules && nowSecs >= (profile.pendingRulesEffectiveTs || 0);
  const rulesSecsLeft = Math.max(
    0,
    (profile.pendingRulesEffectiveTs || 0) - nowSecs
  );

  const isPayeeEligible =
    profile.hasPendingPayee && nowSecs >= (profile.pendingPayeeEffectiveTs || 0);
  const payeeSecsLeft = Math.max(
    0,
    (profile.pendingPayeeEffectiveTs || 0) - nowSecs
  );

  return (
    <div className="space-y-3 mb-6 font-mono text-xs">
      {/* Pending Split Rules Banner */}
      {profile.hasPendingRules && (
        <div className="p-4 rounded-[6px] bg-[#E8FF00] border-2 border-[#050505] neo-shadow text-[#050505] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <Clock className="w-5 h-5 text-[#050505] shrink-0 mt-0.5" />
            <div>
              <div className="font-display font-black text-sm uppercase tracking-wider">
                PENDING SPLIT TRANSITION TIMELOCK
              </div>
              <div className="text-[11px] mt-0.5 font-bold">
                Current: {profile.spendBps / 100}% / {profile.taxBps / 100}% / {profile.savingsBps / 100}%{" "}
                <ArrowRight className="inline w-3 h-3 mx-1" />
                Proposed: {(profile.pendingSpendBps || 0) / 100}% / {(profile.pendingTaxBps || 0) / 100}% / {(profile.pendingSavingsBps || 0) / 100}%
              </div>
              <div className="text-[11px] mt-1 font-black uppercase">
                {isRulesEligible ? (
                  <span className="flex items-center gap-1 text-[#050505]">
                    <CheckCircle className="w-3.5 h-3.5" />
                    24h Cooldown Elapsed · Ready to activate!
                  </span>
                ) : (
                  <span>
                    Cooldown Active: {Math.floor(rulesSecsLeft / 60)}m {rulesSecsLeft % 60}s remaining
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={cancelPendingRules}
              className="px-3 py-1.5 rounded bg-white text-[#050505] border-2 border-[#050505] neo-btn text-xs font-bold uppercase"
            >
              Cancel
            </button>
            {isRulesEligible && (
              <button
                onClick={applyRules}
                className="px-3.5 py-1.5 rounded bg-[#5919F6] text-white border-2 border-[#050505] neo-btn text-xs font-black uppercase"
              >
                Apply Rules Now
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pending Payee Banner */}
      {profile.hasPendingPayee && (
        <div className="p-4 rounded-[6px] bg-[#E8FF00] border-2 border-[#050505] neo-shadow text-[#050505] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <Clock className="w-5 h-5 text-[#050505] shrink-0 mt-0.5" />
            <div>
              <div className="font-display font-black text-sm uppercase tracking-wider">
                PENDING APPROVED TAX PAYEE UPDATE
              </div>
              <div className="text-[11px] mt-0.5 font-bold">
                Proposed Address: {profile.pendingPayee}
              </div>
              <div className="text-[11px] mt-1 font-black uppercase">
                {isPayeeEligible ? (
                  <span className="flex items-center gap-1 text-[#050505]">
                    <CheckCircle className="w-3.5 h-3.5" />
                    72-hour timelock elapsed · Ready to activate!
                  </span>
                ) : (
                  <span>
                    Security Delay: {Math.floor(payeeSecsLeft / 3600)}h {Math.floor((payeeSecsLeft % 3600) / 60)}m remaining
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={cancelPendingPayee}
              className="px-3 py-1.5 rounded bg-white text-[#050505] border-2 border-[#050505] neo-btn text-xs font-bold uppercase"
            >
              Cancel
            </button>
            {isPayeeEligible && (
              <button
                onClick={applyPayee}
                className="px-3.5 py-1.5 rounded bg-[#5919F6] text-white border-2 border-[#050505] neo-btn text-xs font-black uppercase"
              >
                Apply Payee Now
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
