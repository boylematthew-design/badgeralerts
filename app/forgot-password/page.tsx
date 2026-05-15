"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

const inputClass =
  "w-full px-4 py-3 text-[14px] bg-white border border-border rounded-[10px] text-ink placeholder:text-muted outline-none focus:border-accent focus:shadow-[0_0_0_4px_rgba(29,185,115,0.08)] transition-all";

function LogoMark() {
  return (
    <div className="w-8 h-8 flex-shrink-0" aria-hidden="true">
      <svg viewBox="0 0 32 32" width="32" height="32">
        <defs>
          <clipPath id="ba-fp-clip">
            <rect width="32" height="32" rx="9" />
          </clipPath>
        </defs>
        <g clipPath="url(#ba-fp-clip)">
          <rect width="32" height="32" rx="9" fill="#111110" />
          <g fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
            <path d="M7 25 A 8 8 0 0 1 15 17" />
            <path d="M7 25 A 13 13 0 0 1 20 12" opacity="0.55" />
            <path d="M7 25 A 18 18 0 0 1 25 7" opacity="0.3" />
          </g>
          <circle cx="7" cy="25" r="2.4" fill="#1DB973" />
        </g>
      </svg>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="flex items-center justify-between px-7 md:px-8 py-5 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-[15px] font-medium tracking-[-0.025em] text-ink">
            badger<span className="text-accent">alerts</span>
          </span>
        </Link>
        <Link href="/login" className="text-[14px] text-mid hover:text-ink transition-colors">
          ← Back to sign in
        </Link>
      </header>

      <main className="flex-1 flex items-start justify-center px-5 py-8 md:py-12">
        <div className="bg-white border border-border rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] w-full max-w-[440px] px-8 py-10 md:px-12 md:py-12">
          {sent ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="font-serif font-normal text-[22px] text-ink mb-2">Check your email</h1>
              <p className="text-[14px] text-mid font-light leading-[1.6] mb-6">
                We&apos;ve sent a reset link to <strong className="font-medium text-ink">{email}</strong>. Click the link in that email to set a new password.
              </p>
              <Link href="/login" className="text-[14px] text-accent-dark font-medium hover:underline underline-offset-2">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="text-[11px] font-medium tracking-[0.08em] text-accent-dark uppercase mb-4">
                Password reset
              </div>
              <h1 className="font-serif font-normal text-[28px] md:text-[34px] leading-[1.1] tracking-[-0.02em] mb-4">
                Reset your <em className="italic text-accent-dark">password</em>
              </h1>
              <p className="text-[15px] text-mid font-light leading-[1.6] mb-8">
                Enter your email and we&apos;ll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-medium text-mid">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@yourshop.co.uk"
                    required
                    autoComplete="email"
                    className={inputClass}
                  />
                </div>

                {error && (
                  <div className="bg-[#FEECEC] border border-[#A32D2D]/20 text-[#A32D2D] text-[13px] px-4 py-3 rounded-[10px]">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent text-white py-3.5 rounded-[8px] text-[15px] font-medium flex items-center justify-center gap-2 hover:bg-accent-dark active:translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Sending&hellip;
                    </>
                  ) : (
                    <>
                      Send reset link
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
