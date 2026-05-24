import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import type { NavKey } from "@/components/layout/BottomNav";
import { OnboardingScreen } from "@/pages/OnboardingScreen";
import { MatrixScreen } from "@/pages/MatrixScreen";
import { PlaceholderScreen } from "@/pages/PlaceholderScreen";
import { useTelegram } from "@/hooks/useTelegram";
import { api, type BirthData, type MatrixResult } from "@/services/api";

type Stage = "onboarding" | "matrix";

export default function App() {
  const { user, ready } = useTelegram();
  const [stage, setStage] = useState<Stage>("onboarding");
  const [tab, setTab] = useState<NavKey>("matrix");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matrix, setMatrix] = useState<MatrixResult | null>(null);

  const handleSubmit = async (data: BirthData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.calcMatrix(data);
      setMatrix(result);
      setStage("matrix");
      setTab("matrix");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось рассчитать матрицу");
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="grid place-items-center" style={{ minHeight: "var(--tg-vh)" }}>
        <div className="h-10 w-10 animate-spin-slow rounded-full border border-aura-amethyst/30 border-t-aura-amethyst" />
      </div>
    );
  }

  return (
    <AppShell
      active={stage === "onboarding" ? null : tab}
      onNavigate={setTab}
    >
      <AnimatePresence mode="wait">
        {stage === "onboarding" ? (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <OnboardingScreen
              defaultName={user?.first_name ?? ""}
              onSubmit={handleSubmit}
              loading={loading}
            />
            {error ? (
              <p className="mx-auto mt-3 max-w-md px-5 text-center text-xs text-red-300">
                {error}
              </p>
            ) : null}
          </motion.div>
        ) : (
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {tab === "matrix" && matrix ? (
              <MatrixScreen
                result={matrix}
                onRestart={() => {
                  setStage("onboarding");
                  setMatrix(null);
                }}
              />
            ) : tab === "compat" ? (
              <PlaceholderScreen
                title="Совместимость"
                subtitle="Скрещивание двух матриц с визуализацией синергии. В работе."
              />
            ) : tab === "explore" ? (
              <PlaceholderScreen
                title="Смыслы"
                subtitle="Расшифровки энергий, периодов и точек роста."
              />
            ) : (
              <PlaceholderScreen
                title={user?.first_name ?? "Профиль"}
                subtitle="Сохранённые расчёты и настройки появятся здесь."
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
