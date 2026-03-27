"use client";

import { WifiOff } from "lucide-react";
import { useApi } from "@/lib/hooks";

/**
 * Bandeau si l’API ne répond pas (hors chargement initial).
 */
export function BackendStatusBanner() {
  const { error, loading } = useApi<{ status: string }>("/api/health", 25000);

  if (loading) {
    return null;
  }

  if (!error) {
    return null;
  }

  return (
    <div
      role="alert"
      className="mb-8 flex items-start gap-4 rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 to-orange-500/5 px-5 py-4 shadow-lg shadow-black/20"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
        <WifiOff className="h-5 w-5" aria-hidden />
      </div>
      <div className="min-w-0 pt-0.5">
        <p className="font-semibold text-amber-50 text-sm">API injoignable</p>
        <p className="mt-1.5 text-xs text-amber-100/85 leading-relaxed">
          Vérifie que le backend tourne sur{" "}
          <code className="rounded-md bg-black/35 px-1.5 py-0.5 text-[11px] text-amber-50/95">
            {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}
          </code>{" "}
          et que <code className="rounded-md bg-black/35 px-1.5 py-0.5 text-[11px]">CORS_ORIGINS</code> inclut
          l’origine du dashboard.
        </p>
        <p className="mt-2 font-mono text-[11px] text-amber-200/80 break-all">{error}</p>
      </div>
    </div>
  );
}
