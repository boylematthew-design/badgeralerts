"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateWebsite } from "@/lib/validate-url";

interface HeroFormProps {
  variant?: "light" | "dark";
}

export default function HeroForm({ variant = "light" }: HeroFormProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { url: validUrl, error: validationError } = validateWebsite(url);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    router.push(`/signup?url=${encodeURIComponent(validUrl)}`);
  };

  const isDark = variant === "dark";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      <div className="flex items-stretch gap-3 flex-col sm:flex-row">
        {/* URL input */}
        <div
          className={`flex items-center flex-1 min-w-0 border-[1.5px] rounded-[10px] overflow-hidden transition-all ${
            isDark
              ? "bg-white/[0.08] border-white/[0.15] focus-within:border-accent"
              : "bg-white border-border focus-within:border-accent focus-within:shadow-[0_0_0_4px_rgba(29,185,115,0.08)]"
          }`}
        >
          <span
            className={`px-3.5 text-sm border-r h-full flex items-center flex-shrink-0 ${
              isDark
                ? "text-white/45 border-white/[0.1]"
                : "text-muted border-border"
            }`}
          >
            https://
          </span>
          <input
            type="text"
            placeholder="yoursite.co.uk"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`flex-1 min-w-0 px-4 py-3 text-sm outline-none bg-transparent ${
              isDark
                ? "text-white placeholder:text-white/40"
                : "text-ink placeholder:text-muted"
            }`}
          />
        </div>

        {/* CTA button */}
        <button
          type="submit"
          className="bg-accent text-white px-[22px] py-3 rounded-[8px] text-sm font-medium whitespace-nowrap hover:bg-accent-dark active:translate-y-px transition-all flex items-center justify-center gap-1.5"
        >
          Get free alerts
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {error ? (
        <span className="text-[12px] text-[#A32D2D]">{error}</span>
      ) : (
        <span className={`text-[12px] ${isDark ? "text-white/35" : "text-muted"}`}>
          Free alert tool &middot; No credit card &middot; Takes 30 seconds
        </span>
      )}
    </form>
  );
}
