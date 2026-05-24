/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      colors: {
        aura: {
          void: "#0A0612",
          obsidian: "#120A1F",
          plum: "#1C1030",
          violet: "#5A2A8C",
          amethyst: "#9D6BFF",
          gold: "#E8C770",
          champagne: "#F5E6BE",
          mist: "#B8A8D9",
          rune: "#8674A8",
        },
      },
      boxShadow: {
        aura: "0 8px 32px rgba(157, 107, 255, 0.18), inset 0 1px 0 rgba(255,255,255,0.06)",
        "aura-soft": "0 2px 16px rgba(157, 107, 255, 0.12)",
        gold: "0 0 24px rgba(232, 199, 112, 0.35)",
      },
      backgroundImage: {
        "aura-gradient":
          "radial-gradient(circle at 20% 0%, rgba(157,107,255,0.25), transparent 50%), radial-gradient(circle at 80% 100%, rgba(232,199,112,0.12), transparent 55%), linear-gradient(180deg, #0A0612 0%, #120A1F 100%)",
        "aura-card":
          "linear-gradient(140deg, rgba(157,107,255,0.10) 0%, rgba(28,16,48,0.4) 60%, rgba(232,199,112,0.06) 100%)",
        "gold-shimmer":
          "linear-gradient(110deg, #E8C770 0%, #F5E6BE 45%, #E8C770 55%, #B8932F 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "aura-pulse": {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "aura-pulse": "aura-pulse 4s ease-in-out infinite",
        "spin-slow": "spin-slow 32s linear infinite",
      },
    },
  },
  plugins: [],
};
