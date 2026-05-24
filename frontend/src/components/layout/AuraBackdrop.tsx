import { motion } from "framer-motion";

/**
 * Decorative ambient backdrop — a soft, slowly rotating sigil + glow halos.
 * Pure CSS/SVG, no raster assets, scales to any viewport without artifacts.
 */
export function AuraBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-aura-gradient"
    >
      <motion.div
        className="absolute left-1/2 top-[-20%] aspect-square w-[140%] -translate-x-1/2 opacity-50"
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 600 600" className="h-full w-full">
          <defs>
            <radialGradient id="halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#9D6BFF" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#5A2A8C" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0A0612" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="line" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#9D6BFF" stopOpacity="0.0" />
              <stop offset="50%" stopColor="#9D6BFF" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#E8C770" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <circle cx="300" cy="300" r="290" fill="url(#halo)" />
          <g
            stroke="url(#line)"
            strokeWidth="0.6"
            fill="none"
            transform="translate(300 300)"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <polygon
                key={i}
                points="0,-220 220,0 0,220 -220,0"
                transform={`rotate(${i * 15})`}
                opacity={0.35}
              />
            ))}
          </g>
        </svg>
      </motion.div>

      <div className="absolute bottom-[-25%] right-[-20%] h-[60vh] w-[60vh] rounded-full bg-aura-gold/10 blur-3xl" />
      <div className="absolute top-[20%] left-[-20%] h-[50vh] w-[50vh] rounded-full bg-aura-amethyst/15 blur-3xl" />
    </div>
  );
}
