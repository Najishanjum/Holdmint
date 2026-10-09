"use client";

import React from "react";
import Link from "next/link";
import { Calendar, ExternalLink, CheckCircle, ArrowRight } from "lucide-react";
import { TAX_DEADLINES } from "@/config/tax-deadlines";
import { useVault } from "@/lib/store/vault-store";

export function DeadlineCard() {
  const { jurisdiction, setJurisdiction } = useVault();

  const now = new Date();
  const filtered = TAX_DEADLINES.filter((d) => d.jurisdiction === jurisdiction);
  const nextDeadline = filtered.find((d) => new Date(d.dueDate) >= now) || filtered[0];

  const targetDate = nextDeadline ? new Date(nextDeadline.dueDate) : now;
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-[#E8FF00] text-[#050505] rounded-[6px] border-2 border-[#050505] neo-shadow flex flex-col justify-between overflow-hidden">
      {/* Title Bar */}
      <div className="bg-[#050505] text-white px-4 py-2 flex items-center justify-between border-b-2 border-[#050505]">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-[#E8FF00]" />
          <h3 className="font-display font-black text-xs uppercase tracking-wider text-white">
            NEXT TAX DEADLINE
          </h3>
        </div>

        {/* Jurisdiction Switcher */}
        <div className="flex rounded bg-[#1C1917] p-0.5 border border-[#444] text-[10px] font-mono">
          <button
            onClick={() => setJurisdiction("US")}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              jurisdiction === "US"
                ? "bg-[#E8FF00] text-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            US (IRS)
          </button>
          <button
            onClick={() => setJurisdiction("IN")}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              jurisdiction === "IN"
                ? "bg-[#E8FF00] text-black"
                : "text-white/60 hover:text-white"
            }`}
          >
            IN (ITD)
          </button>
        </div>
      </div>

      {nextDeadline && (
        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[#050505] text-[#E8FF00]">
                  {nextDeadline.quarter || nextDeadline.applicableYear}
                </span>
                <h4 className="font-display font-black text-base uppercase text-[#050505] mt-1.5 leading-tight">
                  {nextDeadline.label}
                </h4>
                <div className="text-xs font-mono font-bold text-[#050505] mt-0.5">
                  Due: {nextDeadline.dueDate}
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-display font-black text-[#050505] tnum">
                  {diffDays > 0 ? `${diffDays}D` : "DUE"}
                </span>
                <span className="block text-[9px] font-mono font-bold uppercase text-[#050505]">
                  COUNTDOWN
                </span>
              </div>
            </div>

            <p className="text-xs text-[#050505] font-sans mt-2 leading-relaxed">
              {nextDeadline.description}
            </p>
          </div>

          <div className="pt-2 border-t-2 border-[#050505] flex items-center justify-between text-xs font-display font-bold">
            <span className="text-[10px] font-mono uppercase text-[#050505]">
              Verified Official Schedule
            </span>
            <Link
              href="/app/deadlines"
              className="text-xs font-black uppercase text-[#050505] hover:underline flex items-center gap-1"
            >
              <span>VIEW ALL</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
