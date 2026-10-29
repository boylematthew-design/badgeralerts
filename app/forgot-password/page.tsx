"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import Logo from "@/components/Logo";

const inputClass =
  "w-full px-4 py-3 text-[14px] bg-white border border-border rounded-[10px] text-ink placeholder:text-muted outline-none focus:border-accent focus:ring-4 focus:ring-accent/15 transition-all";


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
          <Logo />
        </Link>
        <Link href="/login" className="text-[14px] text-mid hover:text-ink transition-colors">
          ← Back to sign in
        </Link>
      </header>

      <main className="flex-1 flex items-start justify-center px-5 py-8 md:py-12">
        <div className="bg-white border border-border rounded-[20px] w-full max-w-[440px] px-8 py-10 md:px-12 md:py-12">
          {sent ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="font-heading font-bold tracking-[-0.03em] text-[22px] text-ink mb-2">Check your email</h1>
              <p className="text-[14px] text-mid leading-[1.6] mb-6">
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
              <h1 className="font-heading font-extrabold tracking-[-0.04em] text-[28px] md:text-[34px] leading-[1.1] mb-4">
                Reset your <em className="not-italic text-accent">password</em>
              </h1>
              <p className="text-[15px] text-mid leading-[1.6] mb-8">
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
                  <div className="bg-danger-soft border border-danger/20 text-danger text-[13px] px-4 py-3 rounded-[10px]">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-light py-3.5 text-[15px] flex items-center justify-center gap-2 active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed mt-2"
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
