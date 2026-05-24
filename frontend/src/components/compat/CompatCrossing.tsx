import { motion } from "framer-motion";

interface CompatCrossingProps {
  /** Center value (E) of person A's matrix. */
  centerA: number;
  /** Center value (E) of person B's matrix. */
  centerB: number;
  /** First names — rendered under each diamond. */
  nameA: string;
  nameB: string;
  /** Synergy percentage 0..100 — sits in the vesica overlap. */
  synergy: number;
}

/**
 * Two interlocking diamonds — Venn-style "crossing" of two matrices.
 *
 * Person A is rendered in amethyst, person B in gold. The vesica piscis at
 * the overlap holds the synergy %. Bridge curves between the centers carry a
 * soft animated stream so the union reads as energetic, not static.
 *
 * Pure visualization — gets numerical inputs only, owns no state.
 */
export function CompatCrossing({
  centerA,
  centerB,
  nameA,
  nameB,
  synergy,
}: CompatCrossingProps) {
  return (
    <svg viewBox="0 0 360 280" className="block h-auto w-full select-none">
      <defs>
        <radialGradient id="compatA" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#C8A8FF" />
          <stop offset="60%" stopColor="#9D6BFF" />
          <stop offset="100%" stopColor="#3A1A60" />
        </radialGradient>
        <radialGradient id="compatB" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FFF1C8" />
          <stop offset="60%" stopColor="#E8C770" />
          <stop offset="100%" stopColor="#8C6818" />
        </radialGradient>
        <radialGradient id="compatCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#F5E6BE" />
          <stop offset="100%" stopColor="#E8C770" />
        </radialGradient>
        <linearGradient id="compatBridge" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#9D6BFF" stopOpacity="0" />
          <stop offset="50%" stopColor="#F5E6BE" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#E8C770" stopOpacity="0" />
        </linearGradient>
        <filter id="compatGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background halos */}
      <motion.circle
        cx={120}
        cy={140}
        r={110}
        fill="rgba(157,107,255,0.18)"
        filter="url(#compatGlow)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      <motion.circle
        cx={240}
        cy={140}
        r={110}
        fill="rgba(232,199,112,0.18)"
        filter="url(#compatGlow)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.15 }}
      />

      {/* Bridge curves */}
      <motion.path
        d="M 120 140 Q 180 70 240 140"
        stroke="url(#compatBridge)"
        strokeWidth={1.2}
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.35 }}
      />
      <motion.path
        d="M 120 140 Q 180 210 240 140"
        stroke="url(#compatBridge)"
        strokeWidth={1.2}
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
      />

      {/* Diamond A — Person A */}
      <motion.g
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <polygon
          points="120,55 195,140 120,225 45,140"
          fill="url(#compatA)"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={1}
        />
        <text
          x={120}
          y={138}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={36}
          fontWeight={600}
          fill="#F5E6BE"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {centerA}
        </text>
        <text
          x={120}
          y={250}
          textAnchor="middle"
          fontSize={11}
          fill="#B8A8D9"
          letterSpacing={1.6}
        >
          {nameA.toUpperCase()}
        </text>
      </motion.g>

      {/* Diamond B — Person B */}
      <motion.g
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <polygon
          points="240,55 315,140 240,225 165,140"
          fill="url(#compatB)"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={1}
        />
        <text
          x={240}
          y={138}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={36}
          fontWeight={600}
          fill="#0A0612"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {centerB}
        </text>
        <text
          x={240}
          y={250}
          textAnchor="middle"
          fontSize={11}
          fill="#B8A8D9"
          letterSpacing={1.6}
        >
          {nameB.toUpperCase()}
        </text>
      </motion.g>

      {/* Vesica core — synergy % */}
      <motion.g
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.55,
          delay: 0.4,
          type: "spring",
          stiffness: 320,
          damping: 24,
        }}
      >
        <ellipse
          cx={180}
          cy={140}
          rx={26}
          ry={60}
          fill="rgba(232,199,112,0.18)"
          filter="url(#compatGlow)"
        />
        <circle cx={180} cy={140} r={34} fill="url(#compatCore)" />
        <text
          x={180}
          y={134}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={20}
          fontWeight={700}
          fill="#0A0612"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {synergy}
        </text>
        <text
          x={180}
          y={154}
          textAnchor="middle"
          fontSize={9}
          fontWeight={600}
          fill="#0A0612"
          letterSpacing={1.2}
        >
          СИНЕРГИЯ
        </text>
      </motion.g>
    </svg>
  );
}
