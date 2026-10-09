"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useVault } from "@/lib/store/vault-store";

export function SplitDonut() {
  const { profile } = useVault();

  const data = [
    { name: "Spend", value: profile.spendBps / 100, color: "#34D399" },
    { name: "Tax Vault", value: profile.taxBps / 100, color: "#F5B44A" },
    { name: "Savings Vault", value: profile.savingsBps / 100, color: "#7C8CFF" },
  ];

  return (
    <div className="bg-surface rounded-card border border-border p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <h3 className="text-sm font-semibold text-primary">Active Split Ratio</h3>
        <span className="text-xs text-muted font-mono">100% Total</span>
      </div>

      <div className="h-44 w-full relative my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="p-2 rounded-lg bg-surface-elevated border border-border shadow-lg text-xs">
                      <div className="font-semibold text-primary">{item.name}</div>
                      <div className="font-mono text-muted">{item.value}% of gross incoming payment</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={data}
              innerRadius={50}
              outerRadius={70}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold font-mono text-primary">
            {profile.spendBps / 100}/{profile.taxBps / 100}/{profile.savingsBps / 100}
          </span>
          <span className="text-[10px] text-muted uppercase font-semibold">Active Rules</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border text-center">
        {data.map((item) => (
          <div key={item.name} className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs font-semibold text-primary font-mono">{item.value}%</span>
            </div>
            <span className="text-[11px] text-muted">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
