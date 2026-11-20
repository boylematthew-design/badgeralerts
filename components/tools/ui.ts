// Shared Tailwind class strings for the free tools, so every tool's forms look the same.
// Colours come from the tokens in app/globals.css only.

export const card = "border border-border rounded-[16px] bg-white p-4 sm:p-6";
export const label = "block text-[13px] font-semibold text-ink mb-1.5";
export const hint = "text-[12.5px] text-muted mt-1 leading-[1.45]";
export const input =
  "w-full rounded-[10px] border border-border-strong bg-white px-3 py-2.5 text-[15px] text-ink placeholder:text-muted/70 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";
export const textarea = `${input} min-h-[110px] font-[inherit] leading-[1.5]`;
export const btn = "btn-light inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[14px] disabled:opacity-50";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-[8px] border border-border-strong bg-white px-4 py-2.5 text-[14px] font-semibold text-ink hover:border-accent hover:text-accent-dark transition-colors disabled:opacity-50";
export const btnSmall =
  "inline-flex items-center justify-center gap-1.5 rounded-[8px] border border-border-strong bg-white px-3 py-1.5 text-[13px] font-semibold text-ink hover:border-accent hover:text-accent-dark transition-colors";
export const h2 = "font-heading font-extrabold tracking-[-0.04em] text-[22px] md:text-[26px] text-ink";
export const h3 = "font-heading font-bold tracking-[-0.03em] text-[17px] md:text-[19px] text-ink";
export const tabBtn = (active: boolean) =>
  `rounded-full px-3.5 py-1.5 text-[13px] font-semibold border transition-colors ${
    active ? "bg-ink text-paper border-ink" : "bg-white text-ink border-border-strong hover:border-accent"
  }`;
export const errorBox = "rounded-[10px] bg-danger-soft text-danger text-[14px] px-3 py-2.5";
export const codeBox =
  "w-full rounded-[10px] border border-border bg-surface px-3 py-2.5 font-mono text-[12.5px] leading-[1.5] text-ink whitespace-pre overflow-x-auto max-h-[360px]";
