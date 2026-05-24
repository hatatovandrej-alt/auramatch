/**
 * Canonical Destiny Matrix layout in a 400×400 SVG.
 *
 * Center is (200, 200). The outer diamond (cardinals) has radius 170; the
 * inner rotated square (diagonals) has half-side 95 and its corners sit on
 * the diamond's edge midpoints. Heart-line points are at 0.5 of the cardinal
 * radius. Period points sit at 1/2 of each octant on the diamond edges.
 *
 * Keep keys in sync with backend/app/core/matrix_calc.py — both refer to the
 * same node by string id.
 */
export interface PointGeometry {
  key: string;
  x: number;
  y: number;
  /** Radius of the rendered medallion. */
  r: number;
}

const C = 200; // center
const R_OUTER = 170;
const R_INNER = 95;
const R_HEART = R_OUTER * 0.42; // visually between center and cardinal

// Cardinal corners (outer diamond)
const cardinals: PointGeometry[] = [
  { key: "B", x: C, y: C - R_OUTER, r: 30 }, // north — month
  { key: "C", x: C + R_OUTER, y: C, r: 30 }, // east — year
  { key: "D", x: C, y: C + R_OUTER, r: 30 }, // south — purpose
  { key: "A", x: C - R_OUTER, y: C, r: 30 }, // west — day
];

// Inner rotated square (diagonals)
const diagonals: PointGeometry[] = [
  { key: "AB", x: C - R_INNER, y: C - R_INNER, r: 24 }, // NW — paternal
  { key: "BC", x: C + R_INNER, y: C - R_INNER, r: 24 }, // NE — maternal
  { key: "CD", x: C + R_INNER, y: C + R_INNER, r: 24 }, // SE — social karma
  { key: "DA", x: C - R_INNER, y: C + R_INNER, r: 24 }, // SW — karmic tail
];

// Heart line
const heart: PointGeometry[] = [
  { key: "HB", x: C, y: C - R_HEART, r: 16 },
  { key: "HC", x: C + R_HEART, y: C, r: 16 },
  { key: "HD", x: C, y: C + R_HEART, r: 16 },
  { key: "HA", x: C - R_HEART, y: C, r: 16 },
];

// Karmic tail — three points cascading below the SW (DA) corner.
const karma: PointGeometry[] = [
  { key: "KT1", x: C - R_INNER - 32, y: C + R_INNER + 32, r: 14 },
  { key: "KT2", x: C - R_INNER - 58, y: C + R_INNER + 18, r: 14 },
  { key: "KT3", x: C - R_INNER - 18, y: C + R_INNER + 58, r: 14 },
];

// Eight age periods. Sit on the diamond edges, midpoint between each cardinal
// and the adjacent diagonal vertex.
const periodCoord = (cx: number, cy: number, dx: number, dy: number) => ({
  x: (cx + dx) / 2,
  y: (cy + dy) / 2,
  r: 12,
});

const periods: PointGeometry[] = [
  // P1 0–10: between A (west) and AB (NW)
  { key: "P1", ...periodCoord(C - R_OUTER, C, C - R_INNER, C - R_INNER) },
  // P2 10–20: between AB and B
  { key: "P2", ...periodCoord(C - R_INNER, C - R_INNER, C, C - R_OUTER) },
  // P3 20–30: between B and BC
  { key: "P3", ...periodCoord(C, C - R_OUTER, C + R_INNER, C - R_INNER) },
  // P4 30–40: between BC and C
  { key: "P4", ...periodCoord(C + R_INNER, C - R_INNER, C + R_OUTER, C) },
  // P5 40–50: between C and CD
  { key: "P5", ...periodCoord(C + R_OUTER, C, C + R_INNER, C + R_INNER) },
  // P6 50–60: between CD and D
  { key: "P6", ...periodCoord(C + R_INNER, C + R_INNER, C, C + R_OUTER) },
  // P7 60–70: between D and DA
  { key: "P7", ...periodCoord(C, C + R_OUTER, C - R_INNER, C + R_INNER) },
  // P8 70–80: between DA and A
  { key: "P8", ...periodCoord(C - R_INNER, C + R_INNER, C - R_OUTER, C) },
];

const center: PointGeometry = { key: "E", x: C, y: C, r: 36 };

export const MATRIX_GEOMETRY: Record<string, PointGeometry> = Object.fromEntries(
  [center, ...cardinals, ...diagonals, ...heart, ...karma, ...periods].map(
    (p) => [p.key, p],
  ),
);

export const VIEWBOX = { x: 0, y: 0, w: 400, h: 400 } as const;

/** Cardinal axes for drawing the structural lines (W–E and N–S). */
export const STRUCTURE_LINES = [
  { x1: C - R_OUTER, y1: C, x2: C + R_OUTER, y2: C }, // horizontal A–C
  { x1: C, y1: C - R_OUTER, x2: C, y2: C + R_OUTER }, // vertical B–D
] as const;

/** Outer diamond polygon (A→B→C→D→A). */
export const OUTER_DIAMOND_POINTS = `${C - R_OUTER},${C} ${C},${C - R_OUTER} ${C + R_OUTER},${C} ${C},${C + R_OUTER}`;

/** Inner rotated square polygon (AB→BC→CD→DA→AB). */
export const INNER_SQUARE_POINTS = `${C - R_INNER},${C - R_INNER} ${C + R_INNER},${C - R_INNER} ${C + R_INNER},${C + R_INNER} ${C - R_INNER},${C + R_INNER}`;
