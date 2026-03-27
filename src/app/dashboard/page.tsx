"use client";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  Clock,
  Crosshair,
  Gauge,
  Sparkles,
  Zap,
} from "lucide-react";
import { Metric, Panel, Tag } from "@/components/cards";
import { PortfolioChart } from "@/components/portfolio-chart";
import { useApi } from "@/lib/hooks";

interface DashboardData {
  portfolio: {
    total_value_usdt?: number;
    available_balance?: number;
    positions_value?: number;
    daily_pnl?: number;
    total_pnl?: number;
  };
  stats: {
    total_trades?: number;
    wins?: number;
    losses?: number;
    total_pnl?: number;
    today_pnl?: number;
  };
  engine: {
    status?: string;
    mode?: string;
    cycle_count?: number;
    uptime_seconds?: number;
  };
  recent_signals: Array<{
    symbol: string;
    signal_type: string;
    strength: number;
    source: string;
    timestamp: string;
  }>;
}

interface ChartPoint {
  date: string;
  value: number;
  pnl: number;
}

interface Trade {
  id: number;
  timestamp: string;
  symbol: string;
  side: string;
  price: number;
  amount: number;
  pnl: number;
  [key: string]: unknown;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="skeleton h-40 sm:h-44 rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-28 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="skeleton h-[380px] rounded-2xl xl:col-span-8" />
        <div className="skeleton h-[380px] rounded-2xl xl:col-span-4" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, loading } = useApi<DashboardData>("/api/dashboard", 10000);
  const { data: chartData } = useApi<ChartPoint[]>("/api/portfolio/history", 30000);
  const { data: recentTrades } = useApi<Trade[]>("/api/trades?limit=5", 15000);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const portfolio = data?.portfolio || {};
  const stats = data?.stats || {};
  const engine = data?.engine || {};
  const signals = data?.recent_signals || [];

  const totalValue = portfolio.total_value_usdt ?? 10000;
  const totalPnl = stats.total_pnl ?? 0;
  const todayPnl = stats.today_pnl ?? 0;
  const winRate =
    (stats.total_trades ?? 0) > 0
      ? (((stats.wins ?? 0) / (stats.total_trades ?? 1)) * 100).toFixed(1)
      : "0.0";

  const isRunning = engine.status === "running";
  const uptime = engine.uptime_seconds ?? 0;
  const uptimeStr =
    uptime > 3600
      ? `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`
      : `${Math.floor(uptime / 60)}m`;

  const riskLevel = Math.min(100, Math.max(0, Math.round((stats.losses ?? 0) * 4 + (isRunning ? 22 : 10))));
  const systemHealth = Math.max(70, 100 - (stats.losses ?? 0) * 2);

  return (
    <div className="space-y-8">
      <section className="glass-hero rounded-2xl px-6 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span
                  className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${isRunning ? "bg-emerald-400" : "bg-red-400"}`}
                />
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${isRunning ? "bg-emerald-400" : "bg-red-400"}`}
                />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--fg-muted)]">
                Cockpit temps réel
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.35rem] font-extrabold leading-[1.1] tracking-tight text-gradient">
              Décisions plus nettes, vue instantanée
            </h1>
            <p className="text-sm sm:text-base text-[var(--fg-dim)] leading-relaxed">
              Moteur, performances, signaux et risque sur un seul écran — interface pensée pour la lisibilité.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 xl:w-[min(100%,280px)] gap-3">
            <div className="stat-cell">
              <p className="text-[9px] uppercase tracking-[0.15em] text-[var(--fg-muted)] font-semibold">Mode</p>
              <p className="text-sm font-bold mt-1.5 num">{engine.mode || "PAPER"}</p>
            </div>
            <div className="stat-cell">
              <p className="text-[9px] uppercase tracking-[0.15em] text-[var(--fg-muted)] font-semibold">Statut</p>
              <p className="text-sm font-bold mt-1.5 flex items-center gap-2">
                <span className={isRunning ? "glow-dot" : "glow-dot-red"} />
                {isRunning ? "Actif" : "Arrêté"}
              </p>
            </div>
            <div className="stat-cell">
              <p className="text-[9px] uppercase tracking-[0.15em] text-[var(--fg-muted)] font-semibold">Uptime</p>
              <p className="text-sm font-bold mt-1.5 num">{uptimeStr}</p>
            </div>
            <div className="stat-cell">
              <p className="text-[9px] uppercase tracking-[0.15em] text-[var(--fg-muted)] font-semibold">Cycles</p>
              <p className="text-sm font-bold mt-1.5 num">{engine.cycle_count ?? 0}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
        <Metric
          label="Capital total"
          value={`$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          sub={`Libre : $${(portfolio.available_balance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 0 })}`}
          large
        />
        <Metric
          label="Performance totale"
          value={`${totalPnl >= 0 ? "+" : ""}$${totalPnl.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          trend={totalPnl >= 0 ? "up" : "down"}
          large
        />
        <Metric
          label="PnL journalier"
          value={`${todayPnl >= 0 ? "+" : ""}$${todayPnl.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          trend={todayPnl >= 0 ? "up" : "down"}
        />
        <Metric
          label="Taux de réussite"
          value={`${winRate}%`}
          sub={`${stats.total_trades ?? 0} trades`}
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <Panel title="Courbe de performance" noPad className="xl:col-span-8">
          <div className="px-5 pt-5 pb-6">
            <PortfolioChart data={chartData || []} />
          </div>
        </Panel>

        <Panel title="Contrôle système" className="xl:col-span-4">
          <div className="space-y-5">
            <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-dim)] text-[var(--accent)]">
                  <Gauge className="w-4 h-4" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--fg-muted)] font-semibold">
                  Santé système
                </span>
              </div>
              <span className="num text-xl font-bold">{systemHealth}%</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--fg-muted)] font-semibold flex items-center gap-2">
                  <Crosshair className="w-3.5 h-3.5 opacity-80" />
                  Risque global
                </span>
                <span className="num text-xs font-bold">{riskLevel}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden ring-1 ring-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-400 transition-[width] duration-500"
                  style={{ width: `${riskLevel}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { k: "IA", v: "Actif", icon: Bot, tone: "text-[var(--primary-soft)]", bg: "bg-[var(--primary-dim)]" },
                { k: "Cadence", v: uptimeStr, icon: Clock, tone: "text-[var(--fg-dim)]", bg: "bg-white/[0.06]" },
                { k: "Cycles", v: String(engine.cycle_count ?? 0), icon: Zap, tone: "text-[var(--amber)]", bg: "bg-[var(--amber-dim)]" },
                {
                  k: "Signal moy.",
                  v: `${signals.length > 0 ? Math.round((signals.reduce((a, s) => a + s.strength, 0) / signals.length) * 100) : 0}%`,
                  icon: Sparkles,
                  tone: "text-[var(--green)]",
                  bg: "bg-[var(--green-dim)]",
                },
              ].map((row) => (
                <div
                  key={row.k}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-3 flex gap-3 items-center"
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${row.bg}`}>
                    <row.icon className={`w-4 h-4 ${row.tone}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] uppercase tracking-wider text-[var(--fg-muted)] font-semibold">{row.k}</p>
                    <p className="text-sm font-bold num truncate">{row.v}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Panel title="Derniers trades">
          <div className="space-y-2.5">
            {!recentTrades || recentTrades.length === 0 ? (
              <p className="text-sm text-[var(--fg-muted)] text-center py-14 rounded-xl border border-dashed border-white/10">
                Aucun trade pour l’instant
              </p>
            ) : (
              recentTrades.slice(0, 6).map((t, i) => {
                const d = new Date(t.timestamp);
                const isBuy = t.side === "buy";
                return (
                  <div
                    key={t.id ?? i}
                    className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3.5 hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isBuy ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {isBuy ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm sm:text-base font-semibold block truncate">{t.symbol}</span>
                        <div className="text-[11px] text-[var(--fg-muted)] num">
                          {d.toLocaleDateString("fr-FR")}{" "}
                          {d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 pl-2">
                      <span
                        className={`text-sm sm:text-base font-bold num block ${
                          t.pnl >= 0 ? "text-[var(--green)]" : "text-[var(--loss)]"
                        }`}
                      >
                        {t.pnl >= 0 ? "+" : ""}${t.pnl.toFixed(2)}
                      </span>
                      <div className="text-[11px] text-[var(--fg-muted)] num">
                        ${t.price?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Panel>

        <Panel title="Signaux en direct">
          <div className="space-y-2.5 max-h-[430px] overflow-y-auto no-scrollbar pr-1">
            {signals.length === 0 ? (
              <p className="text-sm text-[var(--fg-muted)] text-center py-14 rounded-xl border border-dashed border-white/10">
                Aucun signal
              </p>
            ) : (
              signals.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3.5 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary-dim)] flex items-center justify-center shrink-0">
                      <Activity className="w-4 h-4 text-[var(--primary-soft)]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm sm:text-base font-semibold block truncate">{s.symbol}</span>
                      <div className="text-[11px] text-[var(--fg-muted)] uppercase tracking-wide truncate">
                        {s.source}
                      </div>
                    </div>
                  </div>
                  <Tag variant={s.signal_type === "BUY" ? "buy" : s.signal_type === "SELL" ? "sell" : "ghost"}>
                    {s.signal_type} {(s.strength * 100).toFixed(0)}%
                  </Tag>
                </div>
              ))
            )}
          </div>
        </Panel>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Trades gagnants", value: stats.wins ?? 0, color: "text-[var(--green)]" },
          { label: "Trades perdants", value: stats.losses ?? 0, color: "text-[var(--loss)]" },
          { label: "Cycles moteur", value: engine.cycle_count ?? 0, color: "text-[var(--fg)]" },
          {
            label: "Balance libre",
            value: `$${(portfolio.available_balance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
            color: "text-[var(--amber)]",
          },
        ].map((row) => (
          <div
            key={row.label}
            className="glass rounded-2xl p-5 text-center border border-white/[0.06] hover:border-white/10 transition-colors"
          >
            <p className={`text-2xl sm:text-3xl font-bold num ${row.color}`}>{row.value}</p>
            <p className="text-[9px] sm:text-[10px] text-[var(--fg-muted)] uppercase tracking-[0.18em] font-semibold mt-2">
              {row.label}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
