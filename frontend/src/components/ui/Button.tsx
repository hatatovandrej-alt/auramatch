import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { haptic } from "@/hooks/useTelegram";

type Variant = "primary" | "ghost" | "gold";
type Size = "md" | "lg";

interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children">,
    Pick<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  variant?: Variant;
  size?: Size;
  leading?: ReactNode;
  trailing?: ReactNode;
  fullWidth?: boolean;
  children?: ReactNode;
}

const base =
  "relative inline-flex items-center justify-center gap-2 select-none font-medium tracking-wide transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "text-white bg-[linear-gradient(135deg,#5A2A8C_0%,#9D6BFF_100%)] shadow-aura hover:brightness-110",
  ghost:
    "text-aura-mist bg-white/[0.04] border border-aura-amethyst/20 backdrop-blur hover:bg-white/[0.08]",
  gold: "text-aura-void bg-gold-shimmer shadow-gold hover:brightness-105",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-5 text-sm rounded-2xl",
  lg: "h-14 px-7 text-base rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "lg",
    leading,
    trailing,
    fullWidth,
    children,
    className,
    onClick,
    ...rest
  },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 480, damping: 28 }}
      onClick={(e) => {
        haptic("light");
        onClick?.(e);
      }}
      className={[
        base,
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        className ?? "",
      ].join(" ")}
      {...rest}
    >
      {leading ? <span className="shrink-0">{leading}</span> : null}
      <span className="truncate">{children}</span>
      {trailing ? <span className="shrink-0">{trailing}</span> : null}
    </motion.button>
  );
});
