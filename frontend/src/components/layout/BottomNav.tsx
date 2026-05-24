import { motion } from "framer-motion";
import { IconAura, IconHeart, IconCompass, IconUser } from "@/design-system/icons";
import { haptic } from "@/hooks/useTelegram";

export type NavKey = "matrix" | "compat" | "explore" | "profile";

interface NavItem {
  key: NavKey;
  label: string;
  Icon: typeof IconAura;
}

const items: NavItem[] = [
  { key: "matrix", label: "Матрица", Icon: IconAura },
  { key: "compat", label: "Пара", Icon: IconHeart },
  { key: "explore", label: "Смыслы", Icon: IconCompass },
  { key: "profile", label: "Профиль", Icon: IconUser },
];

interface BottomNavProps {
  active: NavKey;
  onNavigate: (k: NavKey) => void;
}

/**
 * Fixed-position bottom navigation.
 * Pinned to the viewport (not the scroll container) so it is reachable from
 * any screen state. Safe-area inset is applied as padding so the touch targets
 * stay above the iOS home indicator.
 */
export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ paddingBottom: "var(--safe-bottom)" }}
    >
      <div className="mx-3 mb-3">
        <div className="relative flex items-stretch justify-between rounded-3xl border border-aura-amethyst/15 bg-aura-obsidian/85 px-2 py-1.5 backdrop-blur-2xl shadow-aura">
          {items.map(({ key, label, Icon }) => {
            const isActive = key === active;
            return (
              <button
                key={key}
                onClick={() => {
                  haptic("light");
                  onNavigate(key);
                }}
                className="relative flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-2 text-[11px] tracking-wide outline-none"
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive ? (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-1 rounded-2xl bg-gradient-to-br from-aura-violet/40 to-aura-amethyst/15 ring-1 ring-aura-amethyst/30"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : null}
                <span
                  className={`relative ${
                    isActive ? "text-aura-champagne" : "text-aura-rune"
                  }`}
                >
                  <Icon size={22} />
                </span>
                <span
                  className={`relative ${
                    isActive ? "text-aura-champagne" : "text-aura-rune"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
