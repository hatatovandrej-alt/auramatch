import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import type { CompatibilityChannel } from "@/services/api";

interface ChannelSheetProps {
  channel: CompatibilityChannel | null;
  nameA: string;
  nameB: string;
  onClose: () => void;
}

const toneCopy: Record<CompatibilityChannel["tone"], string> = {
  harmonious: "Поток лёгкий — энергия течёт сама, без сопротивления.",
  working: "Канал устойчивый, требует осознанной работы и внимания.",
  transformative: "Канал-учитель: через напряжение приходит глубокая перестройка.",
};

export function ChannelSheet({ channel, nameA, nameB, onClose }: ChannelSheetProps) {
  useEffect(() => {
    if (!channel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [channel, onClose]);

  return (
    <AnimatePresence>
      {channel ? (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-aura-void/70 backdrop-blur-sm"
          />
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80 || info.velocity.y > 500) onClose();
            }}
            className="fixed inset-x-0 bottom-0 z-[61]"
          >
            <div
              className="mx-auto max-w-md rounded-t-3xl border-t border-x border-aura-amethyst/25 bg-aura-obsidian/95 shadow-aura backdrop-blur-2xl"
              style={{ paddingBottom: "calc(var(--safe-bottom) + 28px)" }}
            >
              <div className="flex justify-center pt-3">
                <span className="h-1.5 w-12 rounded-full bg-aura-rune/40" />
              </div>
              <div className="px-6 pt-4">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-aura-gold to-aura-gold/40 text-2xl font-semibold text-aura-void num">
                      {channel.value}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-aura-rune">
                      {channel.label}
                    </span>
                    <h3 className="font-display text-xl text-aura-champagne">
                      {channel.arcana}
                    </h3>
                    <span className="mt-1 text-[11px] text-aura-mist/70">
                      {channel.description}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex items-stretch gap-2">
                  <PersonChip name={nameA} value={channel.person_a_value} accent="amethyst" />
                  <span className="grid place-items-center text-aura-rune">+</span>
                  <PersonChip name={nameB} value={channel.person_b_value} accent="gold" />
                </div>

                <p className="mt-5 text-[15px] leading-relaxed text-aura-mist/90">
                  {channel.meaning}
                </p>
                <p className="mt-3 text-[12px] leading-relaxed text-aura-rune/90">
                  {toneCopy[channel.tone]}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function PersonChip({
  name,
  value,
  accent,
}: {
  name: string;
  value: number;
  accent: "amethyst" | "gold";
}) {
  const bg =
    accent === "amethyst"
      ? "from-aura-violet/40 to-aura-amethyst/15 ring-aura-amethyst/30"
      : "from-aura-gold/40 to-aura-gold/10 ring-aura-gold/30";
  return (
    <div
      className={`flex flex-1 items-center justify-between gap-2 rounded-2xl bg-gradient-to-br ${bg} px-3 py-2 ring-1`}
    >
      <span className="truncate text-xs text-aura-mist">{name}</span>
      <span className="text-base font-semibold text-aura-champagne num">{value}</span>
    </div>
  );
}
