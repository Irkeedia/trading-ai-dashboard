"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface PortfolioChartProps {
  data: Array<{ date: string; value: number; pnl: number }>;
}

const stroke = "#fb7185";
const strokeSoft = "#fda4af";
const tickFill = "#6e6b7a";

export function PortfolioChart({ data }: PortfolioChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[260px] sm:h-[340px] flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
        <p className="text-[var(--fg-muted)] text-xs font-semibold uppercase tracking-[0.2em]">
          En attente de données
        </p>
        <p className="text-[var(--fg-dim)] text-[11px]">L’historique apparaîtra ici</p>
      </div>
    );
  }

  return (
    <div className="h-[260px] sm:h-[340px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="apexArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
              <stop offset="55%" stopColor="#38bdf8" stopOpacity={0.08} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="apexStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={strokeSoft} />
              <stop offset="100%" stopColor={stroke} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: tickFill, fontFamily: "JetBrains Mono, monospace" }}
            tickLine={false}
            axisLine={false}
            dy={6}
          />
          <YAxis
            tick={{ fontSize: 10, fill: tickFill, fontFamily: "JetBrains Mono, monospace" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`}
            width={44}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(8, 7, 12, 0.92)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              fontSize: "12px",
              fontFamily: "JetBrains Mono, monospace",
              padding: "12px 16px",
              boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
            }}
            labelStyle={{ color: tickFill, fontSize: "10px", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.08em" }}
            formatter={(value: number) => [`$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, ""]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="url(#apexStroke)"
            strokeWidth={2.5}
            fill="url(#apexArea)"
            dot={false}
            activeDot={{ r: 4, fill: stroke, strokeWidth: 2, stroke: "rgba(255,255,255,0.4)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
