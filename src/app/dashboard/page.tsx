"use client";

import { Activity, ArrowDownRight, ArrowUpRight, Bot, Clock, Crosshair, Gauge, Sparkles, Zap } from "lucide-react";
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

export default function DashboardPage() {
  const { data, loading } = useApi<DashboardData>("/api/dashboard", 10000);
  const { data: chartData } = useApi<ChartPoint[]>("/api/portfolio/history", 30000);
  const { data: recentTrades } = useApi<Trade[]>("/api/trades?limit=5", 15000);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-glow text-[var(--fg-muted)] text-xs uppercase tracking-widest">
          Initialisation du terminal...
        </div>
      </div>
    );
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
    <div className="space-y-6">
      <section className="glass rounded-2xl px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          <div>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[var(--fg-muted)] font-semibold mb-2">
              cockpit de trading ia
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Vue Temps Reel, Decisions Plus Nettes
            </h1>
            <p className="text-sm sm:text-base text-[var(--fg-dim)] mt-2 max-w-3xl">
              Interface refondue pour voir instantanement l'etat du moteur, les performances, les signaux actifs et le risque.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <div className="bg-black/25 rounded-xl border border-[var(--border)] p-3">
              <p className="text-[10px] uppercase tracking-wider text-[var(--fg-muted)]">Mode</p>
              <p className="text-sm font-bold mt-1">{engine.mode || "PAPER"}</p>
            </div>
            <div className="bg-black/25 rounded-xl border border-[var(--border)] p-3">
              <p className="text-[10px] uppercase tracking-wider text-[var(--fg-muted)]">Statut</p>
              <p className="text-sm font-bold mt-1 flex items-center gap-2">
                <span className={isRunning ? "glow-dot" : "glow-dot-red"} />
                {isRunning ? "Actif" : "Arrete"}
              </p>
            </div>
            <div className="bg-black/25 rounded-xl border border-[var(--border)] p-3">
              <p className="text-[10px] uppercase tracking-wider text-[var(--fg-muted)]">Uptime</p>
              <p className="text-sm font-bold mt-1 num">{uptimeStr}</p>
            </div>
            <div className="bg-black/25 rounded-xl border border-[var(--border)] p-3">
              <p className="text-[10px] uppercase tracking-wider text-[var(--fg-muted)]">Cycles</p>
              <p className="text-sm font-bold mt-1 num">{engine.cycle_count ?? 0}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
        <Metric
          label="Capital Total"
          value={`$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          sub={`Libre: $${(portfolio.available_balance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 0 })}`}
          large
        />
        <Metric
          label="Performance Totale"
          value={`${totalPnl >= 0 ? "+" : ""}$${totalPnl.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          trend={totalPnl >= 0 ? "up" : "down"}
          large
        />
        <Metric
          label="PnL Journalier"
          value={`${todayPnl >= 0 ? "+" : ""}$${todayPnl.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          trend={todayPnl >= 0 ? "up" : "down"}
        />
        <Metric
          label="Taux de Reussite"
          value={`${winRate}%`}
          sub={`${stats.total_trades ?? 0} trades`}
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <Panel title="Courbe de Performance" noPad className="xl:col-span-8">
          <div className="px-5 pt-4 pb-5">
            <PortfolioChart data={chartData || []} />
          </div>
        </Panel>

        <Panel title="Controle Systeme" className="xl:col-span-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-black/25 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <Gauge className="w-4 h-4 text-[var(--primary-soft)]" />
                <span className="text-xs uppercase tracking-wider text-[var(--fg-muted)]">Sante Systeme</span>
              </div>
              <span className="num text-lg font-bold">{systemHealth}%</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs uppercase tracking-wider text-[var(--fg-muted)] flex items-center gap-2">
                  <Crosshair className="w-3.5 h-3.5" />Risque global
                </span>
                <span className="num text-xs font-bold">{riskLevel}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[var(--green)] via-[var(--amber)] to-[var(--loss)]" style={{ width: `${riskLevel}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-[var(--border)] bg-black/25 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-[var(--fg-muted)]">Analyser IA</p>
                <p className="text-sm font-bold mt-1 flex items-center gap-2"><Bot className="w-3.5 h-3.5 text-[var(--primary-soft)]" />Actif</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-black/25 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-[var(--fg-muted)]">Cadence</p>
                <p className="text-sm font-bold mt-1 flex items-center gap-2 num"><Clock className="w-3.5 h-3.5 text-[var(--fg-dim)]" />{uptimeStr}</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-black/25 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-[var(--fg-muted)]">Cycles</p>
                <p className="text-sm font-bold mt-1 flex items-center gap-2 num"><Zap className="w-3.5 h-3.5 text-[var(--amber)]" />{engine.cycle_count ?? 0}</p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-black/25 px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-[var(--fg-muted)]">Signal moyen</p>
                <p className="text-sm font-bold mt-1 flex items-center gap-2 num"><Sparkles className="w-3.5 h-3.5 text-[var(--green)]" />{signals.length > 0 ? Math.round((signals.reduce((a, s) => a + s.strength, 0) / signals.length) * 100) : 0}%</p>
              </div>
            </div>
          </div>
        </Panel>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Panel title="Derniers Trades">
          <div className="space-y-2">
            {(!recentTrades || recentTrades.length === 0) ? (
              <p className="text-sm text-[var(--fg-muted)] text-center py-10 uppercase tracking-wider">Aucun trade</p>
            ) : (
              recentTrades.slice(0, 6).map((t, i) => {
                const d = new Date(t.timestamp);
                const isBuy = t.side === "buy";
                return (
                  <div key={t.id ?? i} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-black/20 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center ${isBuy ? "bg-[var(--green-dim)]" : "bg-[var(--loss-dim)]"}`}>
                        {isBuy
                          ? <ArrowUpRight className="w-4 h-4 text-[var(--green)]" />
                          : <ArrowDownRight className="w-4 h-4 text-[var(--loss)]" />}
                      </div>
                      <div>
                        <span className="text-sm sm:text-base font-semibold">{t.symbol}</span>
                        <div className="text-[11px] text-[var(--fg-muted)] num">
                          {d.toLocaleDateString("fr-FR")} {d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm sm:text-base font-bold num ${t.pnl >= 0 ? "text-[var(--green)]" : "text-[var(--loss)]"}`}>
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

        <Panel title="Signaux En Direct">
          <div className="space-y-2 max-h-[430px] overflow-y-auto no-scrollbar pr-1">
            {signals.length === 0 ? (
              <p className="text-sm text-[var(--fg-muted)] text-center py-10 uppercase tracking-wider">
                Aucun signal
              </p>
            ) : (
              signals.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-black/20 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-[var(--primary-dim)] flex items-center justify-center">
                      <Activity className="w-4 h-4 text-[var(--primary-soft)]" />
                    </div>
                    <div>
                      <span className="text-sm sm:text-base font-semibold">{s.symbol}</span>
                      <div className="text-[11px] text-[var(--fg-muted)] uppercase tracking-wide">{s.source}</div>
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
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold num text-[var(--green)]">{stats.wins ?? 0}</p>
          <p className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider mt-1">Trades gagnants</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold num text-[var(--loss)]">{stats.losses ?? 0}</p>
          <p className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider mt-1">Trades perdants</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold num">{engine.cycle_count ?? 0}</p>
          <p className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider mt-1">Cycles moteur</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold num text-[var(--amber)]">
            ${(portfolio.available_balance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 0 })}
          </p>
          <p className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider mt-1">Balance libre</p>
        </div>
      </section>
    </div>
  );
}
