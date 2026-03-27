"use client";

import { Card } from "@/components/cards";
import { Badge } from "@/components/data-table";
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analyses IA</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Analyses Gemini du marché en temps réel
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[var(--muted)] animate-pulse">
          Chargement...
        </div>
      ) : (analyses?.length ?? 0) === 0 ? (
        <div className="text-center py-24 text-[var(--muted)]">
          <Brain className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Aucune analyse IA enregistrée</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {analyses!.map((a) => {
            const d = new Date(a.timestamp);
            const result = a.result || {};
            const action = (result.action as string) || "HOLD";
            const reasoning = (result.reasoning as string) || "";

            return (
              <Card
                key={a.id}
                title={`${a.symbol || "Global"} — ${a.analysis_type}`}
                action={
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        action === "BUY"
                          ? "success"
                          : action === "SELL"
                            ? "danger"
                            : "warning"
                      }
                    >
                      {action}
                    </Badge>
                    <span className="text-xs text-[var(--muted)]">
                      {(a.confidence * 100).toFixed(0)}% confiance
                    </span>
                  </div>
                }
              >
                <div className="space-y-3">
                  <p className="text-sm text-[var(--foreground)]/80">
                    {reasoning || JSON.stringify(result, null, 2)}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
                    <span>
                      {d.toLocaleDateString("fr-FR")} {d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span>{a.provider}</span>
                    {a.tokens_used > 0 && <span>{a.tokens_used} tokens</span>}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
