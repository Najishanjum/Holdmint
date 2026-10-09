"use client";

import React from "react";
import Link from "next/link";
import { Calendar, ExternalLink, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { TAX_DEADLINES } from "@/config/tax-deadlines";
import { useVault } from "@/lib/store/vault-store";

export function DeadlineCard() {
  const { jurisdiction, setJurisdiction } = useVault();

  // Find next upcoming deadline for selected jurisdiction
  const now = new Date();
  const filtered = TAX_DEADLINES.filter((d) => d.jurisdiction === jurisdiction);

  // Pick nearest future deadline or first one
  const nextDeadline =
    filtered.find((d) => new Date(d.dueDate) >= now) || filtered[0];

  const targetDate = nextDeadline ? new Date(nextDeadline.dueDate) : now;
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-surface rounded-card border border-border p-5 flex flex-col justify-between">
      {/* Header with US/IN switch */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-tax" />
          <h3 className="text-sm font-semibold text-primary">Next Tax Deadline</h3>
        </div>

        {/* Jurisdiction preference switcher */}
        <div className="flex rounded-lg bg-surface-elevated p-0.5 border border-border text-xs">
          <button
            onClick={() => setJurisdiction("US")}
            className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
              jurisdiction === "US"
                ? "bg-tax text-black"
                : "text-muted hover:text-primary"
            }`}
          >
            US (IRS)
          </button>
          <button
            onClick={() => setJurisdiction("IN")}
            className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
              jurisdiction === "IN"
                ? "bg-tax text-black"
                : "text-muted hover:text-primary"
            }`}
          >
            IN (ITD)
          </button>
        </div>
      </div>

      {nextDeadline && (
        <div className="my-3 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold text-primary">{nextDeadline.label}</div>
              <div className="text-xs text-muted font-mono">{nextDeadline.dueDate}</div>
            </div>

            <div className="text-right">
              <span className="text-lg font-bold font-mono text-tax tnum">
                {diffDays > 0 ? `${diffDays}d` : "Due"}
              </span>
              <span className="block text-[10px] text-muted">remaining</span>
            </div>
          </div>

          <p className="text-xs text-muted leading-relaxed">{nextDeadline.description}</p>

          <div className="flex items-center justify-between pt-1 text-[11px]">
            <span className="flex items-center gap-1 text-spend">
              <CheckCircle className="w-3 h-3" />
              Official Source Verified
            </span>
            <a
              href={nextDeadline.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-primary flex items-center gap-1"
            >
              <span>Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Footer link to calendar */}
      <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
        <span className="text-[11px] text-muted">Jurisdiction display preference only</span>
        <Link
          href="/app/deadlines"
          className="text-xs font-semibold text-spend hover:underline flex items-center gap-1"
        >
          <span>View All Deadlines</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
