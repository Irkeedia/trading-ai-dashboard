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

export function PortfolioChart({ data }: PortfolioChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[280px] flex items-center justify-center text-[var(--fg-muted)] text-xs uppercase tracking-widest">
        En attente de données...
      </div>
    );
  }

  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06d6a0" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#06d6a0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#4b5563", fontFamily: "JetBrains Mono" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#4b5563", fontFamily: "JetBrains Mono" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`}
            width={42}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(10, 10, 18, 0.9)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              fontSize: "11px",
              fontFamily: "JetBrains Mono",
              padding: "8px 12px",
            }}
            labelStyle={{ color: "#4b5563", fontSize: "10px", marginBottom: "4px" }}
            formatter={(value: number) => [`$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, ""]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#06d6a0"
            strokeWidth={1.5}
            fill="url(#grad)"
            dot={false}
            activeDot={{ r: 3, fill: "#06d6a0", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
