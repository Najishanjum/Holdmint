"use client";

import React, { useState, useEffect } from "react";
import { Clock, AlertCircle, CheckCircle, ArrowRight, X } from "lucide-react";
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
    <div className="space-y-2 mb-6">
      {/* Pending Split Rules Banner */}
      {profile.hasPendingRules && (
        <div className="p-4 rounded-xl bg-tax/10 border border-tax/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-tax shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-primary">
                Pending Split Rule Transition
              </div>
              <div className="text-muted mt-0.5">
                Current: {profile.spendBps / 100}% / {profile.taxBps / 100}% / {profile.savingsBps / 100}%{" "}
                <ArrowRight className="inline w-3 h-3 text-tax mx-1" />
                Proposed: {(profile.pendingSpendBps || 0) / 100}% / {(profile.pendingTaxBps || 0) / 100}% / {(profile.pendingSavingsBps || 0) / 100}%
              </div>
              <div className="text-[11px] text-tax mt-1 font-mono">
                {isRulesEligible ? (
                  <span className="flex items-center gap-1 font-semibold text-spend">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Cooldown elapsed · Ready to activate for future payments
                  </span>
                ) : (
                  <span>
                    Cooldown active: {Math.floor(rulesSecsLeft / 60)}m {rulesSecsLeft % 60}s remaining
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={cancelPendingRules}
              className="px-2.5 py-1.5 rounded-lg border border-border text-muted hover:text-primary transition-colors text-xs"
            >
              Cancel Proposal
            </button>
            {isRulesEligible && (
              <button
                onClick={applyRules}
                className="px-3 py-1.5 rounded-lg bg-spend text-black font-semibold text-xs hover:opacity-90 transition-opacity"
              >
                Apply New Rules Now
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pending Payee Banner */}
      {profile.hasPendingPayee && (
        <div className="p-4 rounded-xl bg-tax/10 border border-tax/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-tax shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-primary">
                Pending Approved Tax Payee Update
              </div>
              <div className="text-muted mt-0.5 font-mono">
                Proposed Payee: {profile.pendingPayee}
              </div>
              <div className="text-[11px] text-tax mt-1 font-mono">
                {isPayeeEligible ? (
                  <span className="flex items-center gap-1 font-semibold text-spend">
                    <CheckCircle className="w-3.5 h-3.5" />
                    72-hour delay elapsed · Ready to activate
                  </span>
                ) : (
                  <span>
                    Security delay: {Math.floor(payeeSecsLeft / 3600)}h {Math.floor((payeeSecsLeft % 3600) / 60)}m remaining
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={cancelPendingPayee}
              className="px-2.5 py-1.5 rounded-lg border border-border text-muted hover:text-primary transition-colors text-xs"
            >
              Cancel Proposal
            </button>
            {isPayeeEligible && (
              <button
                onClick={applyPayee}
                className="px-3 py-1.5 rounded-lg bg-spend text-black font-semibold text-xs hover:opacity-90 transition-opacity"
              >
                Apply New Payee
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
