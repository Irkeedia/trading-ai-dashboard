"use client";

import { Tag } from "@/components/cards";
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
    <div className="space-y-5">
      {loading ? (
        <div className="text-center py-12 text-[var(--fg-muted)] animate-glow text-xs uppercase tracking-widest">
          Chargement...
        </div>
      ) : (news?.length ?? 0) === 0 ? (
        <div className="text-center py-24 text-[var(--fg-muted)]">
          <Newspaper className="w-10 h-10 mx-auto mb-4 opacity-20" />
          <p className="text-xs uppercase tracking-widest">Aucune news</p>
        </div>
      ) : (
        <div className="grid gap-2.5">
          {news!.map((n) => {
            const d = new Date(n.timestamp);
            return (
              <div
                key={n.id}
                className="glass rounded-xl px-5 py-4 hover:border-[var(--border-bright)] transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium leading-snug group-hover:text-[var(--fg)] transition-colors">
                      {n.title}
                    </h3>
                    {n.summary && (
                      <p className="text-xs text-[var(--fg-muted)] mt-1.5 line-clamp-2">
                        {n.summary}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-[10px] uppercase tracking-wider">
                      <span className="text-[var(--fg-muted)]">
                        {n.source} · <span className="num">{d.toLocaleDateString("fr-FR")}</span>
                      </span>
                      {n.related_symbols && (
                        <span className="text-[var(--cyan)]">{n.related_symbols}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Tag
                      variant={
                        n.sentiment_score > 0.2
                          ? "buy"
                          : n.sentiment_score < -0.2
                            ? "sell"
                            : "warn"
                      }
                    >
                      {n.sentiment_score > 0 ? "+" : ""}
                      {(n.sentiment_score * 100).toFixed(0)}%
                    </Tag>
                    {n.url && (
                      <a
                        href={n.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--fg-muted)] hover:text-[var(--cyan)] transition-colors"
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
