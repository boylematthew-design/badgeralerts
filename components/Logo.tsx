// Compounding Wins logo: four rising rounded bars (the last one is the accent) plus the
// "compounding" + "wins" wordmark. Use variant="dark" on Ink backgrounds — it swaps the
// bars to Paper/Lime and the wordmark to Paper/Lime so it stays readable.

type Variant = "light" | "dark";

const COLOURS: Record<Variant, { bars: string; accent: string }> = {
  light: { bars: "var(--color-ink)", accent: "var(--color-accent)" },
  dark: { bars: "var(--color-paper)", accent: "var(--color-lime)" },
};

export function LogoMark({ size = 28, variant = "light" }: { size?: number; variant?: Variant }) {
  const { bars, accent } = COLOURS[variant];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <rect x="6" y="76" width="16" height="12" rx="4" fill={bars} />
      <rect x="30" y="66" width="16" height="22" rx="4" fill={bars} />
      <rect x="54" y="48" width="16" height="40" rx="4" fill={bars} />
      <rect x="78" y="16" width="16" height="72" rx="4" fill={accent} />
    </svg>
  );
}

export default function Logo({ size = 28, variant = "light" }: { size?: number; variant?: Variant }) {
  return (
    <span className="flex items-center gap-2">
      <LogoMark size={size} variant={variant} />
      <span
        className={`font-heading font-extrabold tracking-[-0.04em] leading-none ${
          variant === "dark" ? "text-paper" : "text-ink"
        }`}
        style={{ fontSize: Math.round(size * 0.68) }}
      >
        compounding
        <span className={variant === "dark" ? "text-lime" : "text-accent"}>wins</span>
      </span>
    </span>
  );
}
