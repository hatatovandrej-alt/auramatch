import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CompatCrossing } from "@/components/compat/CompatCrossing";
import { ChannelCard } from "@/components/compat/ChannelCard";
import { ChannelSheet } from "@/components/compat/ChannelSheet";
import { IconChevronLeft, IconHeart } from "@/design-system/icons";
import type { CompatibilityChannel, CompatibilityResult } from "@/services/api";
import { haptic } from "@/hooks/useTelegram";

interface CompatibilityScreenProps {
  result: CompatibilityResult;
  onRestart: () => void;
}

const formatBirth = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
};

export function CompatibilityScreen({ result, onRestart }: CompatibilityScreenProps) {
  const [active, setActive] = useState<CompatibilityChannel | null>(null);

  // Center values are not on the response (they live in personal matrices) —
  // we reconstruct from channel values: the "emotions" channel = E_a + E_b.
  // The emotions channel exposes both raw inputs, so we surface those.
  const { centerA, centerB } = useMemo(() => {
    const emotions = result.channels.find((c) => c.key === "emotions");
    return {
      centerA: emotions?.person_a_value ?? 1,
      centerB: emotions?.person_b_value ?? 1,
    };
  }, [result.channels]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5 px-5">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between gap-3 pt-1"
      >
        <button
          onClick={() => {
            haptic("light");
            onRestart();
          }}
          className="grid h-10 w-10 place-items-center rounded-2xl border border-aura-amethyst/20 bg-aura-obsidian/70 text-aura-mist transition-colors hover:text-aura-champagne"
          aria-label="Назад к вводу"
        >
          <IconChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] uppercase tracking-[0.32em] text-aura-rune">
            Карта пары
          </span>
          <h2 className="font-display text-base leading-tight text-aura-champagne">
            {result.person_a_name} <span className="text-aura-rune">×</span>{" "}
            {result.person_b_name}
          </h2>
          <span className="text-[10px] text-aura-rune num">
            {formatBirth(result.person_a_birth)} · {formatBirth(result.person_b_birth)}
          </span>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-aura-gold to-aura-gold/40 text-aura-void ring-1 ring-aura-gold/40">
          <IconHeart size={20} />
        </div>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="aura-card relative overflow-hidden p-3"
      >
        <CompatCrossing
          centerA={centerA}
          centerB={centerB}
          nameA={result.person_a_name}
          nameB={result.person_b_name}
          synergy={result.synergy_percent}
        />
        <div className="mt-1 flex flex-col items-center gap-1 px-3 pb-2 text-center">
          <span className="font-display text-lg text-aura-champagne">
            {result.tone_label}
          </span>
          <span className="text-xs leading-relaxed text-aura-mist/80">
            {result.headline}
          </span>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="flex flex-col gap-2.5"
      >
        <span className="px-1 text-[10px] uppercase tracking-[0.3em] text-aura-rune">
          Каналы пары
        </span>
        {result.channels.map((c, i) => (
          <ChannelCard key={c.key} channel={c} index={i} onSelect={setActive} />
        ))}
      </motion.section>

      <p className="px-1 pb-1 text-center text-[11px] leading-relaxed text-aura-rune/80">
        Нажмите на канал, чтобы прочитать его подробное значение.
      </p>

      <ChannelSheet
        channel={active}
        nameA={result.person_a_name}
        nameB={result.person_b_name}
        onClose={() => setActive(null)}
      />
    </div>
  );
}
