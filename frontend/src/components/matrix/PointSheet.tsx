import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import type { MatrixPoint } from "@/services/api";
import { IconAura, IconSpark, IconHeart, IconMatrix, IconCompass, IconUser } from "@/design-system/icons";

interface PointSheetProps {
  point: MatrixPoint | null;
  onClose: () => void;
}

const groupIcon: Record<MatrixPoint["group"], typeof IconAura> = {
  corner: IconMatrix,
  center: IconAura,
  diagonal: IconCompass,
  heart: IconHeart,
  karma: IconSpark,
  period: IconUser,
};

const groupLabel: Record<MatrixPoint["group"], string> = {
  corner: "Угловая точка",
  center: "Центр матрицы",
  diagonal: "Диагональ",
  heart: "Линия сердца",
  karma: "Кармический хвост",
  period: "Период жизни",
};

/**
 * Bottom sheet that surfaces the arcana reading for a tapped matrix point.
 *
 * Closes on backdrop tap, swipe-down (drag past 80 px), or Escape.
 * Pinned via `position: fixed` so it overlays the diagram + bottom nav, but
 * its safe-area padding keeps content above the iOS home indicator.
 */
export function PointSheet({ point, onClose }: PointSheetProps) {
  useEffect(() => {
    if (!point) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [point, onClose]);

  return (
    <AnimatePresence>
      {point ? (
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
                <PointHeader point={point} />
                <p className="mt-5 text-[15px] leading-relaxed text-aura-mist/90">
                  {point.meaning}
                </p>
                {point.age_range ? (
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-aura-amethyst/25 bg-aura-plum/40 px-3 py-1.5 text-xs uppercase tracking-[0.22em] text-aura-mist">
                    <span className="num">{point.age_range}</span>
                    <span className="text-aura-rune/70">лет</span>
                  </p>
                ) : null}
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function PointHeader({ point }: { point: MatrixPoint }) {
  const Icon = groupIcon[point.group];
  return (
    <div className="flex items-start gap-4">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-aura-violet/40 to-aura-amethyst/20 ring-1 ring-aura-amethyst/30 text-aura-champagne">
        <Icon size={22} />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="text-[10px] uppercase tracking-[0.3em] text-aura-rune">
          {groupLabel[point.group]}
        </span>
        <h3 className="font-display text-xl text-aura-champagne">{point.label}</h3>
        <span className="mt-1 text-sm text-aura-gold num">{point.arcana}</span>
      </div>
      <span className="ml-auto self-center rounded-2xl bg-aura-void/60 px-3 py-2 text-2xl font-semibold text-aura-champagne num">
        {point.value}
      </span>
    </div>
  );
}
