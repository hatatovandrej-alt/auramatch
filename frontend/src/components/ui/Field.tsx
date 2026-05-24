import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  leading?: ReactNode;
  hint?: string;
  error?: string;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, leading, hint, error, className, id, ...rest },
  ref,
) {
  const inputId = id ?? rest.name ?? label.replace(/\s+/g, "-").toLowerCase();
  return (
    <label htmlFor={inputId} className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-[0.18em] text-aura-rune">
        {label}
      </span>
      <span
        className={[
          "flex items-center gap-3 rounded-2xl border border-aura-amethyst/20 bg-aura-obsidian/60 px-4 h-14 focus-within:border-aura-amethyst/60 focus-within:shadow-aura-soft transition-colors",
          error ? "border-red-400/60" : "",
        ].join(" ")}
      >
        {leading ? <span className="text-aura-mist shrink-0">{leading}</span> : null}
        <input
          ref={ref}
          id={inputId}
          className={[
            "w-full bg-transparent text-base text-aura-champagne placeholder:text-aura-rune/60 outline-none num",
            className ?? "",
          ].join(" ")}
          {...rest}
        />
      </span>
      {hint && !error ? (
        <span className="mt-1.5 block text-xs text-aura-rune/80">{hint}</span>
      ) : null}
      {error ? <span className="mt-1.5 block text-xs text-red-300">{error}</span> : null}
    </label>
  );
});
