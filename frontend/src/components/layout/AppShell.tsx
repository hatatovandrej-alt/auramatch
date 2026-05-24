import type { ReactNode } from "react";
import { AuraBackdrop } from "./AuraBackdrop";
import { BottomNav, type NavKey } from "./BottomNav";

interface AppShellProps {
  children: ReactNode;
  /** Currently active bottom-nav item. Pass null to hide nav (e.g. onboarding). */
  active: NavKey | null;
  onNavigate: (k: NavKey) => void;
}

/**
 * Top-level layout. Three concerns it nails down so child screens never have
 * to worry about them:
 *  1. Stable viewport: uses `--tg-vh` so iOS Safari/Telegram chrome resizes
 *     don't cause content jumps.
 *  2. Safe-area padding: `env(safe-area-inset-*)` handled at the shell layer.
 *  3. Persistent bottom nav: fixed, never scrolls away, sits above iOS gesture bar.
 */
export function AppShell({ children, active, onNavigate }: AppShellProps) {
  return (
    <div
      className="relative flex flex-col"
      style={{ minHeight: "var(--tg-vh)" }}
    >
      <AuraBackdrop />

      <main
        className="flex-1 overflow-y-auto no-scrollbar"
        style={{
          paddingTop: "calc(var(--safe-top) + 12px)",
          paddingBottom: active ? "calc(var(--safe-bottom) + 96px)" : "calc(var(--safe-bottom) + 16px)",
        }}
      >
        {children}
      </main>

      {active ? <BottomNav active={active} onNavigate={onNavigate} /> : null}
    </div>
  );
}
