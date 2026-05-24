/**
 * Custom SVG icon registry. No emoji anywhere in the app.
 * Every icon is a stroke-based glyph that inherits `currentColor` so it can be
 * recolored per theme/state. New icons must use the same 24×24 viewBox and a
 * 1.6 stroke-width to keep the visual rhythm consistent.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (props: IconProps) => {
  const { size = 24, strokeWidth = 1.6, ...rest } = props;
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...rest,
  };
};

export const IconAura = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="3.2" />
    <circle cx="12" cy="12" r="7" opacity="0.55" />
    <circle cx="12" cy="12" r="10.5" opacity="0.25" />
  </svg>
);

export const IconMatrix = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 2.5 21.5 12 12 21.5 2.5 12 12 2.5Z" />
    <path d="M12 7.5 16.5 12 12 16.5 7.5 12Z" opacity="0.6" />
    <path d="M12 2.5v19M2.5 12h19" opacity="0.4" />
  </svg>
);

export const IconHeart = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 20.5c-1.2-.9-7.5-5.3-7.5-10.4A4.6 4.6 0 0 1 12 7.4a4.6 4.6 0 0 1 7.5 2.7c0 5.1-6.3 9.5-7.5 10.4Z" />
    <path d="M12 13v3" opacity="0.5" />
  </svg>
);

export const IconCalendar = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
    <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
    <circle cx="12" cy="14" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const IconClock = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const IconUser = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20c1.2-3.7 4.2-5.6 7.5-5.6s6.3 1.9 7.5 5.6" />
  </svg>
);

export const IconSpark = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3v4.5M12 16.5V21M3 12h4.5M16.5 12H21M5.6 5.6l3.2 3.2M15.2 15.2l3.2 3.2M5.6 18.4l3.2-3.2M15.2 8.8l3.2-3.2" />
    <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
  </svg>
);

export const IconArrowRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const IconChevronLeft = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m15 5-7 7 7 7" />
  </svg>
);

export const IconCompass = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15 9-2 5-4 1 2-5 4-1Z" />
  </svg>
);

/** Registry — useful when an icon name is passed dynamically. */
export const iconRegistry = {
  aura: IconAura,
  matrix: IconMatrix,
  heart: IconHeart,
  calendar: IconCalendar,
  clock: IconClock,
  user: IconUser,
  spark: IconSpark,
  arrowRight: IconArrowRight,
  chevronLeft: IconChevronLeft,
  compass: IconCompass,
} as const;

export type IconName = keyof typeof iconRegistry;
