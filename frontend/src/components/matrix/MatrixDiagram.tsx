import { motion } from "framer-motion";
import {
  INNER_SQUARE_POINTS,
  MATRIX_GEOMETRY,
  OUTER_DIAMOND_POINTS,
  STRUCTURE_LINES,
  VIEWBOX,
} from "@/design-system/matrixGeometry";
import type { MatrixPoint } from "@/services/api";
import { haptic } from "@/hooks/useTelegram";

interface MatrixDiagramProps {
  points: MatrixPoint[];
  activeKey: string | null;
  onSelect: (point: MatrixPoint) => void;
}

const groupStyle: Record<
  MatrixPoint["group"],
  { fill: string; stroke: string; text: string; size: "lg" | "md" | "sm" | "xs" }
> = {
  corner: {
    fill: "url(#fillCorner)",
    stroke: "#E8C770",
    text: "#0A0612",
    size: "lg",
  },
  center: {
    fill: "url(#fillCenter)",
    stroke: "#F5E6BE",
    text: "#0A0612",
    size: "lg",
  },
  diagonal: {
    fill: "url(#fillDiagonal)",
    stroke: "#9D6BFF",
    text: "#F5E6BE",
    size: "md",
  },
  heart: {
    fill: "rgba(157,107,255,0.18)",
    stroke: "#B8A8D9",
    text: "#F5E6BE",
    size: "sm",
  },
  karma: {
    fill: "rgba(232,199,112,0.14)",
    stroke: "#E8C770",
    text: "#E8C770",
    size: "sm",
  },
  period: {
    fill: "rgba(28,16,48,0.85)",
    stroke: "#5A2A8C",
    text: "#B8A8D9",
    size: "xs",
  },
};

const textSize: Record<"lg" | "md" | "sm" | "xs", number> = {
  lg: 22,
  md: 17,
  sm: 14,
  xs: 11,
};

/**
 * Interactive SVG diagram of the matrix. Pure presentation — owns no state
 * beyond the visual feedback for `activeKey`. Geometry is in matrixGeometry.ts.
 */
export function MatrixDiagram({ points, activeKey, onSelect }: MatrixDiagramProps) {
  return (
    <svg
      viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`}
      className="block h-auto w-full select-none"
      role="img"
      aria-label="Схема матрицы судьбы"
    >
      <defs>
        <radialGradient id="fillCorner" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5E6BE" />
          <stop offset="100%" stopColor="#B8932F" />
        </radialGradient>
        <radialGradient id="fillCenter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#E8C770" />
          <stop offset="100%" stopColor="#9D6BFF" />
        </radialGradient>
        <radialGradient id="fillDiagonal" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9D6BFF" />
          <stop offset="100%" stopColor="#5A2A8C" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Structural lines */}
      <g stroke="rgba(157,107,255,0.28)" strokeWidth={0.8}>
        {STRUCTURE_LINES.map((l, i) => (
          <line key={i} {...l} />
        ))}
      </g>
      <polygon
        points={OUTER_DIAMOND_POINTS}
        fill="none"
        stroke="rgba(157,107,255,0.45)"
        strokeWidth={1.2}
      />
      <polygon
        points={INNER_SQUARE_POINTS}
        fill="none"
        stroke="rgba(232,199,112,0.4)"
        strokeWidth={1}
        strokeDasharray="3 4"
      />
      {/* Karmic-tail trace */}
      <path
        d={`M ${MATRIX_GEOMETRY.DA.x} ${MATRIX_GEOMETRY.DA.y} L ${MATRIX_GEOMETRY.KT3.x} ${MATRIX_GEOMETRY.KT3.y}`}
        stroke="rgba(232,199,112,0.4)"
        strokeDasharray="2 3"
        fill="none"
      />

      {/* Render points; period→heart→karma→diagonal→corner→center for layering. */}
      {(["period", "heart", "karma", "diagonal", "corner", "center"] as const).flatMap(
        (g) =>
          points
            .filter((p) => p.group === g)
            .map((p) => {
              const geo = MATRIX_GEOMETRY[p.key];
              if (!geo) return null;
              const s = groupStyle[p.group];
              const isActive = activeKey === p.key;
              return (
                <motion.g
                  key={p.key}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.05 + (g === "corner" || g === "center" ? 0 : 0.15),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    haptic("light");
                    onSelect(p);
                  }}
                >
                  {isActive ? (
                    <circle
                      cx={geo.x}
                      cy={geo.y}
                      r={geo.r + 6}
                      fill="rgba(232,199,112,0.18)"
                      filter="url(#glow)"
                    />
                  ) : null}
                  <circle
                    cx={geo.x}
                    cy={geo.y}
                    r={geo.r}
                    fill={s.fill}
                    stroke={isActive ? "#F5E6BE" : s.stroke}
                    strokeWidth={isActive ? 2 : 1.2}
                  />
                  <text
                    x={geo.x}
                    y={geo.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={textSize[s.size]}
                    fontWeight={600}
                    fill={s.text}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                    pointerEvents="none"
                  >
                    {p.value}
                  </text>
                </motion.g>
              );
            }),
      )}
    </svg>
  );
}
