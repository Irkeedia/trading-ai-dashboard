import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_KEY = process.env.NEXT_PUBLIC_TRADING_IA_API_KEY?.trim();

function buildHeaders(base: HeadersInit): HeadersInit {
  const h = new Headers(base);
  if (API_KEY) {
    h.set("X-API-Key", API_KEY);
  }
  return h;
}

export async function apiFetch<T = unknown>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: buildHeaders({
      "Content-Type": "application/json",
      ...((options?.headers as Record<string, string>) || {}),
    }),
  });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const j = (await res.json()) as { detail?: unknown };
      if (typeof j.detail === "string") {
        detail = j.detail;
      } else if (Array.isArray(j.detail)) {
        detail = j.detail.map((x) => JSON.stringify(x)).join("; ");
      }
    } catch {
      /* ignore */
    }
    throw new Error(`API ${path}: ${res.status} — ${detail}`);
  }
  return res.json();
}
