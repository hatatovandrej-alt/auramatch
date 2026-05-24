/**
 * Thin REST client. Uses VITE_API_BASE in prod, falls back to /api in dev so a
 * Vite proxy or a co-located deployment can serve both.
 */
const BASE = import.meta.env.VITE_API_BASE ?? "/api";

export interface BirthData {
  name: string;
  /** ISO date string yyyy-MM-dd */
  date: string;
  /** HH:mm, optional */
  time?: string | null;
}

export interface MatrixPoint {
  key: string;
  label: string;
  value: number;
}

export interface MatrixResult {
  name: string;
  points: MatrixPoint[];
  summary: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const initData = window.Telegram?.WebApp?.initData ?? "";
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Telegram-Init-Data": initData,
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${body || res.statusText}`);
  }
  return (await res.json()) as T;
}

export const api = {
  calcMatrix: (data: BirthData) =>
    request<MatrixResult>("/matrix", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  health: () => request<{ status: string }>("/health"),
};
