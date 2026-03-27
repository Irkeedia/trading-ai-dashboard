"use client";

import { useState } from "react";
import { Card, StatCard } from "@/components/cards";
import { useApi } from "@/lib/hooks";
import { apiFetch } from "@/lib/utils";
import { Settings, Play, Square, Zap, Clock, BarChart3 } from "lucide-react";

interface EngineStatus {
  status: string;
  mode: string;
  exchange: string;
  cycle_count: number;
  uptime_seconds: number;
  error: string;
  timestamp: string;
}

interface Config {
  trading: {
    mode: string;
    base_currency: string;
    max_open_positions: number;
    check_interval_seconds: number;
  };
  exchange: string;
  watchlist: string[];
  risk: {
    max_portfolio_risk_pct: number;
    max_position_size_pct: number;
    stop_loss_pct: number;
    take_profit_pct: number;
    trailing_stop_pct: number;
    max_daily_loss_pct: number;
  };
  ai: {
    provider: string;
    model: string;
  };
}

export default function EnginePage() {
  const { data: status, refetch } = useApi<EngineStatus>("/api/engine/status", 5000);
  const { data: config } = useApi<Config>("/api/config", 60000);
  const [actionLoading, setActionLoading] = useState(false);

  const isRunning = status?.status === "running";

  const uptime = status?.uptime_seconds ?? 0;
  const uptimeStr =
    uptime > 3600
      ? `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${uptime % 60}s`
      : uptime > 60
        ? `${Math.floor(uptime / 60)}m ${uptime % 60}s`
        : `${uptime}s`;

  async function handleAction(action: "start" | "stop") {
    setActionLoading(true);
    try {
      await apiFetch("/api/engine/control", {
        method: "POST",
        body: JSON.stringify({
          action,
          mode: config?.trading.mode || "PAPER",
          exchange: config?.exchange || "binance",
        }),
      });
      setTimeout(refetch, 1000);
    } catch (e) {
      console.error("Engine action failed:", e);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Moteur de Trading</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Contrôle et configuration du système
          </p>
        </div>

        <button
          onClick={() => handleAction(isRunning ? "stop" : "start")}
          disabled={actionLoading}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all
            ${
              isRunning
                ? "bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30"
                : "bg-green-500/15 text-green-400 hover:bg-green-500/25 border border-green-500/30"
            }
            disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {actionLoading ? (
            <span className="animate-spin">⏳</span>
          ) : isRunning ? (
            <Square className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {isRunning ? "Arrêter" : "Démarrer"}
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Statut"
          value={isRunning ? "En cours" : "Arrêté"}
          trend={isRunning ? "up" : "down"}
          icon={Zap}
        />
        <StatCard
          title="Mode"
          value={status?.mode || config?.trading.mode || "—"}
          icon={Settings}
        />
        <StatCard
          title="Uptime"
          value={uptimeStr}
          icon={Clock}
        />
        <StatCard
          title="Cycles"
          value={String(status?.cycle_count ?? 0)}
          icon={BarChart3}
        />
      </div>

      {/* Error */}
      {status?.error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-sm text-red-400 font-medium">Erreur:</p>
          <p className="text-sm text-red-300 mt-1">{status.error}</p>
        </div>
      )}

      {/* Config */}
      {config && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card title="Configuration Trading">
            <div className="space-y-3">
              {[
                ["Exchange", config.exchange],
                ["Devise", config.trading.base_currency],
                ["Intervalle", `${config.trading.check_interval_seconds}s`],
                ["Positions max", config.trading.max_open_positions],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">{label}</span>
                  <span className="font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Gestion du Risque">
            <div className="space-y-3">
              {[
                ["Risque max/trade", `${config.risk.max_portfolio_risk_pct}%`],
                ["Taille max position", `${config.risk.max_position_size_pct}%`],
                ["Stop Loss", `${config.risk.stop_loss_pct}%`],
                ["Take Profit", `${config.risk.take_profit_pct}%`],
                ["Trailing Stop", `${config.risk.trailing_stop_pct}%`],
                ["Perte max/jour", `${config.risk.max_daily_loss_pct}%`],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Intelligence Artificielle">
            <div className="space-y-3">
              {[
                ["Provider", config.ai.provider],
                ["Modèle", config.ai.model],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Watchlist">
            <div className="flex flex-wrap gap-2">
              {config.watchlist.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 bg-[var(--accent)]/10 text-[var(--accent-light)] rounded-lg text-xs font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
