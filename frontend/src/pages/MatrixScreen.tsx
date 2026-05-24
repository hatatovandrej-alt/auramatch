import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MatrixDiagram } from "@/components/matrix/MatrixDiagram";
import { PointSheet } from "@/components/matrix/PointSheet";
import { IconChevronLeft, IconAura } from "@/design-system/icons";
import type { MatrixPoint, MatrixResult } from "@/services/api";
import { haptic } from "@/hooks/useTelegram";

interface MatrixScreenProps {
  result: MatrixResult;
  onRestart: () => void;
}

const KEY_POINTS: Array<{ key: string; caption: string }> = [
  { key: "E", caption: "Центр" },
  { key: "D", caption: "Миссия" },
  { key: "A", caption: "Личность" },
  { key: "DA", caption: "Карма" },
];

const formatBirth = (iso: string) => {
  // Render dd.mm.yyyy — feels native to RU audience and stays compact.
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
};

export function MatrixScreen({ result, onRestart }: MatrixScreenProps) {
  const [active, setActive] = useState<MatrixPoint | null>(null);

  const pointsByKey = useMemo(() => {
    const map = new Map<string, MatrixPoint>();
    for (const p of result.points) map.set(p.key, p);
    return map;
  }, [result.points]);

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
          aria-label="Назад к вводу данных"
        >
          <IconChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] uppercase tracking-[0.32em] text-aura-rune">
            Матрица
          </span>
          <h2 className="font-display text-lg leading-tight text-aura-champagne">
            {result.name}
          </h2>
          <span className="text-[11px] text-aura-rune num">
            {formatBirth(result.birth)}
          </span>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-aura-violet/40 to-aura-amethyst/20 text-aura-champagne ring-1 ring-aura-amethyst/30">
          <IconAura size={20} />
        </div>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="aura-card relative overflow-hidden p-3"
      >
        <MatrixDiagram
          points={result.points}
          activeKey={active?.key ?? null}
          onSelect={setActive}
        />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="grid grid-cols-2 gap-2.5"
      >
        {KEY_POINTS.map(({ key, caption }) => {
          const p = pointsByKey.get(key);
          if (!p) return null;
          return (
            <button
              key={key}
              onClick={() => {
                haptic("light");
                setActive(p);
              }}
              className="aura-card flex items-center justify-between gap-3 p-3.5 text-left transition-transform active:scale-[0.98]"
            >
              <div className="flex min-w-0 flex-col">
                <span className="text-[10px] uppercase tracking-[0.25em] text-aura-rune">
                  {caption}
                </span>
                <span className="truncate text-sm text-aura-champagne">
                  {p.arcana}
                </span>
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-aura-gold/80 to-aura-gold/40 text-lg font-semibold text-aura-void num">
                {p.value}
              </span>
            </button>
          );
        })}
      </motion.section>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="px-1 text-center text-[12px] leading-relaxed text-aura-mist/70"
      >
        {result.summary}
      </motion.p>

      <PointSheet point={active} onClose={() => setActive(null)} />
    </div>
  );
}
