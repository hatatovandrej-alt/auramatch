import { motion } from "framer-motion";
import type { CompatibilityChannel } from "@/services/api";
import { haptic } from "@/hooks/useTelegram";

interface ChannelCardProps {
  channel: CompatibilityChannel;
  index: number;
  onSelect: (c: CompatibilityChannel) => void;
}

const toneAccent: Record<CompatibilityChannel["tone"], { dot: string; chip: string; label: string }> = {
  harmonious: {
    dot: "bg-aura-gold",
    chip: "bg-aura-gold/15 text-aura-gold",
    label: "Гармония",
  },
  working: {
    dot: "bg-aura-amethyst",
    chip: "bg-aura-amethyst/15 text-aura-mist",
    label: "Работа",
  },
  transformative: {
    dot: "bg-rose-300",
    chip: "bg-rose-300/15 text-rose-200",
    label: "Трансформация",
  },
};

export function ChannelCard({ channel, index, onSelect }: ChannelCardProps) {
  const t = toneAccent[channel.tone];
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 * index }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        haptic("light");
        onSelect(channel);
      }}
      className="aura-card flex w-full items-center gap-4 p-4 text-left"
    >
      <div className="flex shrink-0 flex-col items-center gap-1">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-aura-gold/80 to-aura-gold/30 text-lg font-semibold text-aura-void num">
          {channel.value}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] ${t.chip}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
          {t.label}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-[10px] uppercase tracking-[0.25em] text-aura-rune">
          {channel.label}
        </span>
        <span className="truncate text-sm text-aura-champagne">
          {channel.arcana}
        </span>
        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-aura-mist/70 num">
          <span className="rounded-md bg-aura-amethyst/15 px-1.5 py-0.5">
            {channel.person_a_value}
          </span>
          <span className="text-aura-rune">+</span>
          <span className="rounded-md bg-aura-gold/15 px-1.5 py-0.5">
            {channel.person_b_value}
          </span>
        </div>
      </div>
    </motion.button>
  );
}
