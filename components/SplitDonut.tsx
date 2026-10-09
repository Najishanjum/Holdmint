"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useVault } from "@/lib/store/vault-store";

export function SplitDonut() {
  const { profile } = useVault();

  const data = [
    { name: "SPEND", value: profile.spendBps / 100, color: "#21D99B" },
    { name: "TAX VAULT", value: profile.taxBps / 100, color: "#FFBD45" },
    { name: "SAVINGS", value: profile.savingsBps / 100, color: "#8790FF" },
  ];

  return (
    <div className="bg-white text-[#050505] rounded-[6px] border-2 border-[#050505] neo-shadow flex flex-col justify-between overflow-hidden">
      {/* Terminal Title Bar */}
      <div className="bg-[#050505] text-white px-4 py-2 flex items-center justify-between border-b-2 border-[#050505]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E8FF00] border border-black inline-block" />
          <h3 className="font-display font-black text-xs uppercase tracking-wider text-white">
            ACTIVE SPLIT RATIO
          </h3>
        </div>
        <span className="font-mono text-[11px] font-bold text-[#E8FF00]">100% TOTAL</span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="h-44 w-full relative my-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="p-2 rounded bg-[#050505] text-white border-2 border-[#050505] neo-shadow-sm text-xs font-mono">
                        <div className="font-bold text-[#E8FF00]">{item.name}</div>
                        <div>{item.value}% of incoming USDC</div>
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
                stroke="#050505"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-display font-black text-[#050505]">
              {profile.spendBps / 100}/{profile.taxBps / 100}/{profile.savingsBps / 100}
            </span>
            <span className="text-[10px] text-[#696574] font-mono font-bold uppercase">
              ACTIVE RATIO
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t-2 border-[#050505] text-center font-display font-bold">
          {data.map((item) => (
            <div key={item.name} className="flex flex-col items-center p-1.5 rounded bg-[#F2F0F7] border border-[#050505]">
              <div className="flex items-center gap-1 text-xs">
                <span className="w-2.5 h-2.5 rounded-full border border-black" style={{ backgroundColor: item.color }} />
                <span className="font-mono font-black text-[#050505]">{item.value}%</span>
              </div>
              <span className="text-[10px] text-[#696574] uppercase tracking-wider mt-0.5">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
