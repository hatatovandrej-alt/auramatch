/**
 * Thin REST client. Uses VITE_API_BASE in prod, falls back to /api in dev
 * (Vite proxy in vite.config.ts forwards /api → http://127.0.0.1:8000).
 */
const BASE = import.meta.env.VITE_API_BASE ?? "/api";

export interface BirthData {
  name: string;
  /** ISO date string yyyy-MM-dd */
  date: string;
  /** HH:mm, optional */
  time?: string | null;
}

export type PointGroup =
  | "corner"
  | "diagonal"
  | "center"
  | "heart"
  | "karma"
  | "period";

export interface MatrixPoint {
  key: string;
  group: PointGroup;
  label: string;
  value: number;
  arcana: string;
  meaning: string;
  age_range?: string | null;
}

export interface MatrixResult {
  name: string;
  birth: string;
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

export type ChannelTone = "harmonious" | "working" | "transformative";

export interface CompatibilityChannel {
  key: string;
  label: string;
  description: string;
  value: number;
  arcana: string;
  meaning: string;
  tone: ChannelTone;
  person_a_value: number;
  person_b_value: number;
}

export interface CompatibilityResult {
  person_a_name: string;
  person_b_name: string;
  person_a_birth: string;
  person_b_birth: string;
  synergy_percent: number;
  tone_label: string;
  headline: string;
  summary: string;
  channels: CompatibilityChannel[];
}

export const api = {
  calcMatrix: (data: BirthData) =>
    request<MatrixResult>("/matrix", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  calcCompatibility: (a: BirthData, b: BirthData) =>
    request<CompatibilityResult>("/compatibility", {
      method: "POST",
      body: JSON.stringify({ person_a: a, person_b: b }),
    }),
  health: () => request<{ status: string }>("/health"),
};
