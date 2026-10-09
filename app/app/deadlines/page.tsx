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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary">Tax Deadline Calendar</h2>
          <p className="text-xs text-muted mt-0.5">
            Configurable statutory tax schedules for personal planning
          </p>
        </div>

        {/* Jurisdiction Switcher */}
        <div className="flex rounded-xl bg-surface-elevated p-1 border border-border text-xs">
          <button
            onClick={() => setJurisdiction("US")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              jurisdiction === "US"
                ? "bg-tax text-black"
                : "text-muted hover:text-primary"
            }`}
          >
            United States (IRS)
          </button>
          <button
            onClick={() => setJurisdiction("IN")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              jurisdiction === "IN"
                ? "bg-tax text-black"
                : "text-muted hover:text-primary"
            }`}
          >
            India (Income Tax Dept)
          </button>
        </div>
      </div>

      {/* Tax Readiness & Context Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReadinessRing />

        <div className="md:col-span-2 bg-surface rounded-card border border-border p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-tax text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Jurisdiction Display Notice</span>
            </div>
            <h3 className="text-base font-bold text-primary">
              Display Preference Only · Estimate, Not Tax Advice
            </h3>
            <p className="text-xs text-muted leading-relaxed mt-2">
              The jurisdiction switch toggles which calendar dates and official guidelines are displayed in your personal planning dashboard. It does not determine or affect your actual legal tax residency, withholding obligations, or statutory filing requirements. Always verify your liability with a licensed CPA, Enrolled Agent, or Chartered Accountant.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-elevated border border-border flex items-center justify-between text-xs font-mono">
            <span className="text-muted">Active Tax Reserve:</span>
            <span className="text-tax font-bold">{formatUSDC(balances.tax)}</span>
          </div>
        </div>
      </div>

      {/* Deadlines List */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-primary">
          {jurisdiction === "US" ? "Federal IRS Estimated Tax Dates" : "Indian Advance Tax Schedule"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deadlines.map((item) => {
            const itemDate = new Date(item.dueDate);
            const isPast = itemDate < now;
            const diffDays = Math.ceil((itemDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={item.id}
                className="bg-surface rounded-card border border-border p-5 flex flex-col justify-between space-y-4 hover:border-border/80 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-tax px-1.5 py-0.5 rounded bg-tax/15 border border-tax/30">
                        {item.quarter || item.applicableYear}
                      </span>
                      <h4 className="text-sm font-semibold text-primary mt-1.5">{item.label}</h4>
                      <span className="text-xs text-muted font-mono">{item.dueDate}</span>
                    </div>

                    <div className="text-right">
                      {isPast ? (
                        <span className="text-xs font-semibold text-muted">Passed</span>
                      ) : (
                        <div>
                          <span className="text-base font-bold font-mono text-tax tnum">
                            {diffDays}d
                          </span>
                          <span className="block text-[10px] text-muted">remaining</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-muted leading-relaxed">{item.description}</p>

                  {item.caveat && (
                    <div className="p-2.5 rounded-lg bg-surface-elevated border border-border text-[11px] text-muted">
                      ℹ️ {item.caveat}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1 text-spend font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified Official Source
                  </span>

                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-muted hover:text-primary transition-colors font-medium"
                  >
                    <span>Official Portal</span>
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
