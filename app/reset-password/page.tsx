"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Logo from "@/components/Logo";

const inputClass =
  "w-full px-4 py-3 text-[14px] bg-white border border-border rounded-[10px] text-ink placeholder:text-muted outline-none focus:border-accent focus:ring-4 focus:ring-accent/15 transition-all";


export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="flex items-center justify-between px-7 md:px-8 py-5 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
        </Link>
      </header>

      <main className="flex-1 flex items-start justify-center px-5 py-8 md:py-12">
        <div className="bg-white border border-border rounded-[20px] w-full max-w-[440px] px-8 py-10 md:px-12 md:py-12">
          <div className="text-[11px] font-medium tracking-[0.08em] text-accent-dark uppercase mb-4">
            New password
          </div>
          <h1 className="font-heading font-extrabold tracking-[-0.04em] text-[28px] md:text-[34px] leading-[1.1] mb-4">
            Set a new <em className="not-italic text-accent">password</em>
          </h1>
          <p className="text-[15px] text-mid leading-[1.6] mb-8">
            Choose a strong password for your account.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12.5px] font-medium text-mid">New password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                autoComplete="new-password"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12.5px] font-medium text-mid">Confirm new password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                required
                autoComplete="new-password"
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
                  Saving&hellip;
                </>
              ) : (
                <>
                  Set new password
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
