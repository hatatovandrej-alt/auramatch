import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import {
  IconArrowRight,
  IconCalendar,
  IconClock,
  IconHeart,
  IconUser,
} from "@/design-system/icons";
import type { BirthData } from "@/services/api";
import { haptic } from "@/hooks/useTelegram";

interface CompatOnboardingProps {
  initialA?: BirthData | null;
  onSubmit: (a: BirthData, b: BirthData) => void;
  loading?: boolean;
}

interface PersonState {
  name: string;
  date: string;
  time: string;
}

const empty: PersonState = { name: "", date: "", time: "" };
const today = () => new Date().toISOString().slice(0, 10);

const fromBirth = (d: BirthData | null | undefined): PersonState =>
  d
    ? { name: d.name, date: d.date, time: d.time ?? "" }
    : { ...empty };

const toBirth = (s: PersonState): BirthData => ({
  name: s.name.trim(),
  date: s.date,
  time: s.time || null,
});

interface PersonErrors {
  name?: string;
  date?: string;
}

function validate(s: PersonState): PersonErrors {
  const e: PersonErrors = {};
  if (!s.name.trim()) e.name = "Введите имя";
  if (!s.date) e.date = "Укажите дату";
  else if (s.date > today()) e.date = "Дата не может быть в будущем";
  return e;
}

interface PersonFormProps {
  title: string;
  caption: string;
  state: PersonState;
  errors: PersonErrors;
  onChange: (next: PersonState) => void;
}

function PersonForm({ title, caption, state, errors, onChange }: PersonFormProps) {
  return (
    <section className="aura-card p-5">
      <header className="mb-4 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-aura-violet/40 to-aura-amethyst/20 text-aura-champagne ring-1 ring-aura-amethyst/30">
          <IconUser size={18} />
        </span>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.3em] text-aura-rune">
            {caption}
          </span>
          <h3 className="font-display text-lg text-aura-champagne">{title}</h3>
        </div>
      </header>
      <div className="flex flex-col gap-3.5">
        <Field
          label="Имя"
          name={`${caption}-name`}
          placeholder="Имя"
          leading={<IconUser size={20} />}
          value={state.name}
          onChange={(e) => onChange({ ...state, name: e.target.value })}
          error={errors.name}
          maxLength={40}
        />
        <Field
          label="Дата рождения"
          name={`${caption}-date`}
          type="date"
          leading={<IconCalendar size={20} />}
          value={state.date}
          max={today()}
          onChange={(e) => onChange({ ...state, date: e.target.value })}
          error={errors.date}
        />
        <Field
          label="Время рождения"
          name={`${caption}-time`}
          type="time"
          leading={<IconClock size={20} />}
          value={state.time}
          onChange={(e) => onChange({ ...state, time: e.target.value })}
          hint="Необязательно"
        />
      </div>
    </section>
  );
}

export function CompatOnboarding({
  initialA,
  onSubmit,
  loading,
}: CompatOnboardingProps) {
  const [a, setA] = useState<PersonState>(() => fromBirth(initialA));
  const [b, setB] = useState<PersonState>({ ...empty });
  const [errA, setErrA] = useState<PersonErrors>({});
  const [errB, setErrB] = useState<PersonErrors>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const ea = validate(a);
    const eb = validate(b);
    setErrA(ea);
    setErrB(eb);
    if (Object.keys(ea).length || Object.keys(eb).length) {
      haptic("error");
      return;
    }
    haptic("success");
    onSubmit(toBirth(a), toBirth(b));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-md flex-col gap-5 px-5"
    >
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-3 pt-2 text-center"
      >
        <div className="relative">
          <span className="absolute inset-0 -m-3 rounded-full bg-aura-gold/20 blur-2xl animate-aura-pulse" />
          <div className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-aura-gold to-aura-gold/40 ring-1 ring-aura-gold/50 text-aura-void shadow-gold">
            <IconHeart size={28} />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-[0.4em] text-aura-rune">
            Совместимость
          </span>
          <h1 className="font-display text-2xl leading-tight text-aura-champagne">
            Соберём <span className="gold-text">карту пары</span>
          </h1>
          <p className="mx-auto max-w-xs text-sm leading-relaxed text-aura-mist/80">
            Две матрицы встречаются — мы покажем, как они звучат вместе.
          </p>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <PersonForm
          title="Вы"
          caption="Первый человек"
          state={a}
          errors={errA}
          onChange={setA}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18 }}
      >
        <PersonForm
          title="Партнёр"
          caption="Второй человек"
          state={b}
          errors={errB}
          onChange={setB}
        />
      </motion.div>

      <Button
        type="submit"
        variant="gold"
        size="lg"
        fullWidth
        disabled={loading}
        trailing={<IconArrowRight size={20} />}
      >
        {loading ? "Считаем синергию…" : "Открыть карту пары"}
      </Button>
    </form>
  );
}
