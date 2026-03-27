"use client";

import { Card } from "@/components/cards";
import { Badge } from "@/components/data-table";
import { useApi } from "@/lib/hooks";
import { Newspaper, ExternalLink } from "lucide-react";

interface NewsItem {
  id: number;
  timestamp: string;
  title: string;
  source: string;
  url: string;
  sentiment_score: number;
  relevance_score: number;
  related_symbols: string;
  summary: string;
}

export default function NewsPage() {
  const { data: news, loading } = useApi<NewsItem[]>("/api/news?limit=50", 30000);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">News</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Actualités crypto et analyse de sentiment
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[var(--muted)] animate-pulse">
          Chargement...
        </div>
      ) : (news?.length ?? 0) === 0 ? (
        <div className="text-center py-24 text-[var(--muted)]">
          <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Aucune news collectée</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {news!.map((n) => {
            const d = new Date(n.timestamp);
            const sentimentColor =
              n.sentiment_score > 0.2
                ? "text-green-400"
                : n.sentiment_score < -0.2
                  ? "text-red-400"
                  : "text-yellow-400";

            return (
              <div
                key={n.id}
                className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-4 hover:border-[var(--accent)]/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm leading-snug">
                      {n.title}
                    </h3>
                    {n.summary && (
                      <p className="text-xs text-[var(--muted)] mt-1.5 line-clamp-2">
                        {n.summary}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-[var(--muted)]">
                        {n.source} • {d.toLocaleDateString("fr-FR")}
                      </span>
                      {n.related_symbols && (
                        <span className="text-xs text-[var(--accent-light)]">
                          {n.related_symbols}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Badge
                      variant={
                        n.sentiment_score > 0.2
                          ? "success"
                          : n.sentiment_score < -0.2
                            ? "danger"
                            : "warning"
                      }
                    >
                      {n.sentiment_score > 0 ? "+" : ""}
                      {(n.sentiment_score * 100).toFixed(0)}%
                    </Badge>
                    {n.url && (
                      <a
                        href={n.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--muted)] hover:text-[var(--accent-light)] transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
