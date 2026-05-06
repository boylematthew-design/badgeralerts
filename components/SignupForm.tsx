"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    website: "",
    fullName: "",
    email: "",
    password: "",
    agreed: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    // 1. Create the user in Supabase Auth (sends confirmation email automatically)
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

    // User row is created automatically by database trigger

    if (typeof window !== "undefined" && (window as any).rdt) {
      (window as any).rdt("track", "SignUp");
    }
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-extrabold text-slate-900 mb-2">Check your email!</h3>
        <p className="text-slate-600 text-sm">
          We&apos;ve sent a confirmation link to <strong>{formData.email}</strong>. Click it to activate your account.
        </p>
      </div>
    );
  }

  return (
    <form id="signup" onSubmit={handleSubmit} className="space-y-3">
      {/* Website URL */}
      <input
        type="url"
        name="website"
        value={formData.website}
        onChange={handleChange}
        placeholder="https://yourwebsite.com"
        required
        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all font-semibold placeholder:text-slate-400"
      />

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full name"
          required
          className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all font-semibold placeholder:text-slate-400"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email address"
          required
          className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all font-semibold placeholder:text-slate-400"
        />
      </div>

      {/* Password */}
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password (min. 8 characters)"
        required
        minLength={8}
        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all font-semibold placeholder:text-slate-400"
      />

      {/* Consent */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <label className="flex items-start gap-3 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            name="agreed"
            checked={formData.agreed}
            onChange={handleChange}
            required
            className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span>
            I agree to the{" "}
            <a href="/terms" className="text-emerald-600 font-semibold hover:underline">Terms</a>
            {" "}and{" "}
            <a href="/privacy" className="text-emerald-600 font-semibold hover:underline">Privacy Policy</a>.
          </span>
        </label>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-500 text-white px-8 py-4 rounded-2xl text-lg font-extrabold shadow-xl shadow-emerald-200 hover:bg-emerald-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Creating account..." : "Get started"}
      </button>

      <p className="text-xs text-slate-500 text-center">Unsubscribe anytime.</p>
    </form>
  );
}
