/**
 * Design tokens — single source of truth for visual constants.
 * Tailwind config mirrors these names; keep them in sync.
 */

export const palette = {
  void: "#0A0612",
  obsidian: "#120A1F",
  plum: "#1C1030",
  violet: "#5A2A8C",
  amethyst: "#9D6BFF",
  gold: "#E8C770",
  champagne: "#F5E6BE",
  mist: "#B8A8D9",
  rune: "#8674A8",
} as const;

export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
} as const;

export const motion = {
  ease: [0.22, 1, 0.36, 1] as const,
  easeSoft: [0.4, 0, 0.2, 1] as const,
  spring: { type: "spring", stiffness: 320, damping: 28 } as const,
  fast: 0.18,
  base: 0.32,
  slow: 0.6,
} as const;

export type Palette = typeof palette;
