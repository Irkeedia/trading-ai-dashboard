"use client";

import { Panel, Tag } from "@/components/cards";
import { useApi } from "@/lib/hooks";
import { Brain } from "lucide-react";

interface Analysis {
  id: number;
  timestamp: string;
  symbol: string;
  analysis_type: string;
  provider: string;
  result: Record<string, unknown>;
  confidence: number;
  tokens_used: number;
}

export default function AnalysesPage() {
  const { data: analyses, loading } = useApi<Analysis[]>("/api/analyses?limit=30", 15000);

  return (
    <div className="space-y-5">
      {loading ? (
        <div className="text-center py-12 text-[var(--fg-muted)] animate-glow text-xs uppercase tracking-widest">
          Chargement...
        </div>
      ) : (analyses?.length ?? 0) === 0 ? (
        <div className="text-center py-24 text-[var(--fg-muted)]">
          <Brain className="w-10 h-10 mx-auto mb-4 opacity-20" />
          <p className="text-xs uppercase tracking-widest">Aucune analyse IA</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {analyses!.map((a) => {
            const d = new Date(a.timestamp);
            const result = a.result || {};
            const action = (result.action as string) || "HOLD";
            const reasoning = (result.reasoning as string) || "";

            return (
              <Panel
                key={a.id}
                title={`${a.symbol || "Global"} — ${a.analysis_type}`}
                action={
                  <div className="flex items-center gap-2">
                    <Tag variant={action === "BUY" ? "buy" : action === "SELL" ? "sell" : "warn"}>
                      {action}
                    </Tag>
                    <span className="text-[10px] num text-[var(--fg-muted)]">
                      {(a.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                }
              >
                <div className="space-y-3">
                  <p className="text-sm text-[var(--fg)]/80 leading-relaxed">
                    {reasoning || JSON.stringify(result, null, 2)}
                  </p>
                  <div className="flex items-center gap-4 text-[10px] text-[var(--fg-muted)] uppercase tracking-wider">
                    <span className="num">
                      {d.toLocaleDateString("fr-FR")} {d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span>{a.provider}</span>
                    {a.tokens_used > 0 && <span className="num">{a.tokens_used} tok</span>}
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>
      )}
    </div>
  );
}
