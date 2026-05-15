"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

interface SignupFormProps {
  initialUrl?: string;
}

const inputClass =
  "w-full px-4 py-3 text-[14px] bg-white border border-border rounded-[10px] text-ink placeholder:text-muted outline-none focus:border-accent focus:shadow-[0_0_0_4px_rgba(29,185,115,0.08)] transition-all";

export default function SignupForm({ initialUrl = "" }: SignupFormProps) {
  const [formData, setFormData] = useState({
    website: initialUrl,
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: formData.fullName,
          website: formData.website,
        },
      },
    });

    if (authError) {
      if (authError.message.toLowerCase().includes("database error")) {
        setError("This website is already registered with another account.");
      } else if (authError.message.toLowerCase().includes("already registered")) {
        setError("An account with this email already exists. Try signing in.");
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    if (typeof window !== "undefined" && (window as any).rdt) {
      (window as any).rdt("track", "SignUp");
    }
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="bg-accent-light border border-accent/20 rounded-[14px] p-8 text-center">
        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif font-normal text-[22px] text-ink mb-2">
          Check your email
        </h3>
        <p className="text-[14px] text-mid font-light leading-[1.6]">
          We&apos;ve sent a confirmation link to{" "}
          <strong className="font-medium text-ink">{formData.email}</strong>.
          Click it to activate your account.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      {/* Website URL — hidden if passed from landing, visible if arriving directly */}
      {!initialUrl ? (
        <div className="flex flex-col gap-1.5">
          <label className="text-[12.5px] font-medium text-mid">Website URL</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://yourwebsite.com"
            required
            className={inputClass}
          />
        </div>
      ) : (
        <input type="hidden" name="website" value={formData.website} />
      )}

      {/* Full name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12.5px] font-medium text-mid">Full name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Sarah Wilson"
          required
          autoComplete="name"
          className={inputClass}
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12.5px] font-medium text-mid">Email address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="sarah@yourshop.co.uk"
          required
          autoComplete="email"
          className={inputClass}
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12.5px] font-medium text-mid">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Min. 8 characters"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-white py-3.5 rounded-[8px] text-[15px] font-medium flex items-center justify-center gap-2 hover:bg-accent-dark active:translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Creating your account&hellip;
          </>
        ) : (
          <>
            Create account
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>

      {/* Legal line */}
      <p className="text-[12px] text-muted text-center leading-[1.5]">
        By clicking Create account, you agree to our{" "}
        <Link href="/terms" className="text-mid underline underline-offset-2 decoration-border-strong hover:text-accent-dark transition-colors">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-mid underline underline-offset-2 decoration-border-strong hover:text-accent-dark transition-colors">
          Privacy Policy
        </Link>.
      </p>

      {/* Error */}
      {error && (
        <div className="bg-[#FEECEC] border border-[#A32D2D]/20 text-[#A32D2D] text-[13px] px-4 py-3 rounded-[10px]">
          {error}
        </div>
      )}

      {/* Trust bullets */}
      <div className="border-t border-border pt-5 mt-1 flex flex-col gap-2.5">
        {[
          "Free to use",
          "Used by small businesses across the UK",
          "We'll email you an alert when we find something",
        ].map((text) => (
          <div key={text} className="flex items-center gap-2.5 text-[14px] text-ink">
            <div className="w-5 h-5 rounded-full bg-accent-light text-accent-dark flex items-center justify-center flex-shrink-0">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m4 12 5 5 11-12" />
              </svg>
            </div>
            {text}
          </div>
        ))}
      </div>

      <p className="text-[12px] text-muted text-center">
        No credit card. Unsubscribe with one click.
      </p>
    </form>
  );
}
