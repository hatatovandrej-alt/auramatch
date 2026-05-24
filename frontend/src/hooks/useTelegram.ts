import { useEffect, useState } from "react";

type Scheme = "dark" | "light";

interface TelegramState {
  webApp: TelegramWebApp | null;
  scheme: Scheme;
  user: TelegramWebAppUser | null;
  ready: boolean;
}

/**
 * Wires the Telegram WebApp SDK into React lifecycle:
 *  - calls `ready()` and `expand()` on mount,
 *  - keeps `--tg-vh` CSS variable in sync with `viewportHeight` so layouts
 *    that rely on the visible area never collapse when the keyboard opens,
 *  - tracks color scheme changes,
 *  - works gracefully when running outside Telegram (dev in a browser).
 */
export function useTelegram(): TelegramState {
  const [state, setState] = useState<TelegramState>(() => ({
    webApp: null,
    scheme: "dark",
    user: null,
    ready: false,
  }));

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    const applyViewport = (heightPx: number) => {
      document.documentElement.style.setProperty("--tg-vh", `${heightPx}px`);
    };

    if (!tg) {
      // Dev fallback — pretend we're inside Telegram with dark theme.
      applyViewport(window.innerHeight);
      const onResize = () => applyViewport(window.innerHeight);
      window.addEventListener("resize", onResize);
      setState((s) => ({ ...s, ready: true }));
      return () => window.removeEventListener("resize", onResize);
    }

    tg.ready();
    tg.expand();
    tg.setHeaderColor("#0A0612");
    tg.setBackgroundColor("#0A0612");
    tg.disableVerticalSwipes?.();
    applyViewport(tg.viewportHeight || window.innerHeight);

    const sync = () => {
      applyViewport(tg.viewportHeight || window.innerHeight);
      setState({
        webApp: tg,
        scheme: (tg.colorScheme as Scheme) ?? "dark",
        user: tg.initDataUnsafe?.user ?? null,
        ready: true,
      });
    };
    sync();

    tg.onEvent("viewportChanged", sync);
    tg.onEvent("themeChanged", sync);
    return () => {
      tg.offEvent("viewportChanged", sync);
      tg.offEvent("themeChanged", sync);
    };
  }, []);

  return state;
}

/** Convenience wrapper — fires Telegram haptic if available, no-ops elsewhere. */
export function haptic(kind: "light" | "medium" | "heavy" | "success" | "error" = "light") {
  const hf = window.Telegram?.WebApp?.HapticFeedback;
  if (!hf) return;
  if (kind === "success" || kind === "error") {
    hf.notificationOccurred(kind);
  } else {
    hf.impactOccurred(kind);
  }
}
