"use client";

import React from "react";
import { Calendar, ExternalLink, CheckCircle, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { useVault } from "@/lib/store/vault-store";
import { TAX_DEADLINES } from "@/config/tax-deadlines";
import { formatUSDC } from "@/lib/utils/format-usdc";
import { ReadinessRing } from "@/components/ReadinessRing";

export default function DeadlinesPage() {
  const { jurisdiction, setJurisdiction, balances, profile } = useVault();

  const deadlines = TAX_DEADLINES.filter((d) => d.jurisdiction === jurisdiction);
  const now = new Date();

  return (
    <div className="space-y-6">
      {/* Neo-Brutalist Header */}
      <div className="bg-[#050505] neo-border neo-shadow p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-[#FFBD45] inline-block animate-pulse"></span>
            <span className="font-mono text-xs uppercase tracking-widest text-[#FFBD45]">
              STATUTORY COMPLIANCE // CALENDAR TIMELINES
            </span>
          </div>
          <h2 className="font-display text-3xl font-black uppercase tracking-tight text-white">
            Tax Deadline Calendar
          </h2>
          <p className="text-xs text-white/60 font-mono mt-0.5">
            Jurisdiction-specific statutory filing dates with official tax authority links
          </p>
        </div>

        {/* Jurisdiction Switcher */}
        <div className="flex bg-[#121216] neo-border p-1 gap-1 self-start sm:self-auto">
          <button
            onClick={() => setJurisdiction("US")}
            className={`px-4 py-2 font-mono text-xs font-black uppercase transition-all ${
              jurisdiction === "US"
                ? "bg-[#FFBD45] text-black"
                : "text-white/70 hover:text-white"
            }`}
          >
            United States (IRS)
          </button>
          <button
            onClick={() => setJurisdiction("IN")}
            className={`px-4 py-2 font-mono text-xs font-black uppercase transition-all ${
              jurisdiction === "IN"
                ? "bg-[#FFBD45] text-black"
                : "text-white/70 hover:text-white"
            }`}
          >
            India (Income Tax Dept)
          </button>
        </div>
      </div>

      {/* Tax Readiness & Context Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReadinessRing />

        <div className="md:col-span-2 bg-white neo-border neo-shadow flex flex-col justify-between">
          <div className="bg-[#050505] text-white px-4 py-2.5 flex items-center justify-between border-b-2 border-black font-mono text-xs font-bold uppercase">
            <span className="text-[#FFBD45] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>JURISDICTION NOTICE</span>
            </span>
            <span className="text-white/60">ESTIMATE ONLY</span>
          </div>

          <div className="p-6 space-y-4 flex-1">
            <h3 className="font-display text-2xl font-black uppercase tracking-tight text-black">
              Display Preference Only · Estimate, Not Tax Advice
            </h3>
            <p className="text-xs font-mono text-black/80 leading-relaxed">
              The jurisdiction switch toggles which calendar dates and official guidelines are displayed in your personal planning dashboard. It does not determine or affect your actual legal tax residency, withholding obligations, or statutory filing requirements. Always verify your liability with a licensed CPA, Enrolled Agent, or Chartered Accountant.
            </p>

            <div className="p-4 bg-[#F2F0F7] neo-border flex items-center justify-between font-mono text-xs">
              <span className="text-black font-bold uppercase">Current Tax Vault Reserve Balance:</span>
              <span className="text-xl font-black text-[#5919F6] tnum">{formatUSDC(balances.tax)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deadlines List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#FFBD45]" />
            <span>
              {jurisdiction === "US" ? "Federal IRS Estimated Tax Schedule (Form 1040-ES)" : "Indian Advance Tax Schedule (Section 208/211)"}
            </span>
          </h3>
          <span className="font-mono text-xs text-white/50 uppercase">Active Timelines</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {deadlines.map((item) => {
            const itemDate = new Date(item.dueDate);
            const isPast = itemDate < now;
            const diffDays = Math.ceil((itemDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={item.id}
                className="bg-white neo-border neo-shadow flex flex-col justify-between"
              >
                {/* Terminal Card Header */}
                <div className="bg-[#050505] text-white px-3.5 py-2 flex items-center justify-between border-b-2 border-black font-mono text-xs">
                  <span className="px-2 py-0.5 bg-[#FFBD45] text-black font-black uppercase text-[10px]">
                    {item.quarter || item.applicableYear}
                  </span>
                  <span className="text-white/70 font-mono text-[11px]">{item.dueDate}</span>
                </div>

                <div className="p-5 space-y-4 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-display text-xl font-black uppercase tracking-tight text-black">
                        {item.label}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      {isPast ? (
                        <span className="px-2 py-1 bg-[#F2F0F7] neo-border text-xs font-mono font-bold text-black/60">
                          PASSED
                        </span>
                      ) : (
                        <div className="bg-[#E8FF00] neo-border px-3 py-1">
                          <span className="text-xl font-black font-mono text-black tnum">
                            {diffDays}d
                          </span>
                          <span className="block text-[9px] font-mono font-bold uppercase text-black">
                            REMAINING
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs font-mono text-black/80 leading-relaxed">
                    {item.description}
                  </p>

                  {item.caveat && (
                    <div className="p-3 bg-[#F2F0F7] neo-border text-[11px] font-mono text-black/80">
                      ℹ️ {item.caveat}
                    </div>
                  )}
                </div>

                {/* Footer link */}
                <div className="p-3 bg-[#F2F0F7] border-t-2 border-black flex items-center justify-between text-xs font-mono font-bold">
                  <span className="flex items-center gap-1.5 text-black">
                    <CheckCircle className="w-4 h-4 text-[#21D99B]" />
                    <span>VERIFIED SCHEDULE</span>
                  </span>

                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neo-btn py-1 px-2.5 bg-white hover:bg-[#5919F6] hover:text-white neo-border flex items-center gap-1 text-[11px] transition-colors"
                  >
                    <span>OFFICIAL PORTAL</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
