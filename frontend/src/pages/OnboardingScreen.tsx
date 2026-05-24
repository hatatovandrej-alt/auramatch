import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import {
  IconArrowRight,
  IconCalendar,
  IconClock,
  IconUser,
  IconAura,
} from "@/design-system/icons";
import type { BirthData } from "@/services/api";
import { haptic } from "@/hooks/useTelegram";

interface OnboardingScreenProps {
  defaultName?: string;
  onSubmit: (data: BirthData) => void;
  loading?: boolean;
}

const today = () => new Date().toISOString().slice(0, 10);

export function OnboardingScreen({
  defaultName = "",
  onSubmit,
  loading,
}: OnboardingScreenProps) {
  const [name, setName] = useState(defaultName);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [errors, setErrors] = useState<{ name?: string; date?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Введите имя";
    if (!date) e.date = "Укажите дату рождения";
    else if (date > today()) e.date = "Дата не может быть в будущем";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      haptic("error");
      return;
    }
    haptic("success");
    onSubmit({ name: name.trim(), date, time: time || null });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-md flex-col gap-6 px-5"
    >
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-4 pt-6 text-center"
      >
        <div className="relative">
          <span className="absolute inset-0 -m-4 rounded-full bg-aura-amethyst/20 blur-2xl animate-aura-pulse" />
          <div className="relative grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-aura-violet/50 to-aura-amethyst/30 ring-1 ring-aura-amethyst/40 shadow-aura">
            <IconAura size={36} className="text-aura-champagne" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[11px] uppercase tracking-[0.4em] text-aura-rune">
            AuraMatch
          </span>
          <h1 className="font-display text-3xl leading-tight text-aura-champagne sm:text-4xl">
            Прочитайте <span className="gold-text">карту своей судьбы</span>
          </h1>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-aura-mist/80">
            Введите данные рождения — мы рассчитаем личную матрицу и раскроем
            энергии, которые ведут вас по жизни.
          </p>
        </div>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="aura-card p-5"
      >
        <div className="flex flex-col gap-4">
          <Field
            label="Имя"
            name="name"
            placeholder="Как к вам обращаться"
            autoComplete="given-name"
            leading={<IconUser size={20} />}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            inputMode="text"
            maxLength={40}
          />
          <Field
            label="Дата рождения"
            name="date"
            type="date"
            leading={<IconCalendar size={20} />}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={today()}
            error={errors.date}
          />
          <Field
            label="Время рождения"
            name="time"
            type="time"
            leading={<IconClock size={20} />}
            value={time}
            onChange={(e) => setTime(e.target.value)}
            hint="Необязательно. Уточняет тонкие энергии матрицы."
          />
        </div>
      </motion.section>

      <Button
        type="submit"
        variant="gold"
        size="lg"
        fullWidth
        disabled={loading}
        trailing={<IconArrowRight size={20} />}
      >
        {loading ? "Считаем матрицу…" : "Открыть матрицу"}
      </Button>

      <p className="px-2 text-center text-[11px] leading-relaxed text-aura-rune/80">
        Данные используются только для расчёта и не передаются третьим лицам.
      </p>
    </form>
  );
}
