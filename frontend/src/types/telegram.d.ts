/**
 * Minimal ambient typing for Telegram WebApp. The real SDK ships its own types
 * via @twa-dev/sdk; this file just exposes `window.Telegram` for the small set
 * of fields we touch directly (viewport height + theme params).
 */
export {};

declare global {
  interface TelegramWebAppUser {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  }

  interface TelegramWebAppInitData {
    user?: TelegramWebAppUser;
    auth_date?: number;
    hash?: string;
  }

  interface TelegramWebApp {
    initData: string;
    initDataUnsafe: TelegramWebAppInitData;
    colorScheme: "light" | "dark";
    themeParams: Record<string, string>;
    viewportHeight: number;
    viewportStableHeight: number;
    isExpanded: boolean;
    expand: () => void;
    ready: () => void;
    close: () => void;
    setHeaderColor: (color: string) => void;
    setBackgroundColor: (color: string) => void;
    enableClosingConfirmation: () => void;
    disableVerticalSwipes?: () => void;
    HapticFeedback?: {
      impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
      notificationOccurred: (type: "error" | "success" | "warning") => void;
      selectionChanged: () => void;
    };
    onEvent: (event: string, cb: () => void) => void;
    offEvent: (event: string, cb: () => void) => void;
  }

  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}
