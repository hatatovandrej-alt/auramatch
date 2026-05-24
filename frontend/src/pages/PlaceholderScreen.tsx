import { motion } from "framer-motion";
import { IconSpark } from "@/design-system/icons";

interface PlaceholderScreenProps {
  title: string;
  subtitle: string;
}

/**
 * Used by tabs that aren't built yet in Stage 1 — keeps the bottom nav alive
 * so the navigation contract holds up even before screens land.
 */
export function PlaceholderScreen({ title, subtitle }: PlaceholderScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex w-full max-w-md flex-col items-center gap-5 px-6 pt-16 text-center"
    >
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-aura-obsidian/70 ring-1 ring-aura-amethyst/25 text-aura-amethyst">
        <IconSpark size={28} />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl text-aura-champagne">{title}</h2>
        <p className="text-sm leading-relaxed text-aura-mist/75">{subtitle}</p>
      </div>
      <span className="rounded-full border border-aura-amethyst/25 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-aura-rune">
        скоро
      </span>
    </motion.div>
  );
}
