"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

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
    <div className="hero-pattern min-h-screen flex flex-col">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white p-1 shadow-lg transition-transform group-hover:scale-105">
            <svg viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path fill="currentColor" d="M12 22a2.25 2.25 0 0 0 2.2-1.8H9.8A2.25 2.25 0 0 0 12 22Z" />
              <path fill="currentColor" d="M20 18.2H4c.9-1 2.2-2.1 2.2-5.2V10.3A5.8 5.8 0 0 1 10.7 4.7V3.6c0-.7.6-1.3 1.3-1.3s1.3.6 1.3 1.3v1.1a5.8 5.8 0 0 1 4.5 5.6V13c0 3.1 1.3 4.2 2.2 5.2Z" />
              <circle cx="18.2" cy="6.2" r="2.2" fill="#10b981" />
            </svg>
          </div>
          <div className="text-xl font-extrabold tracking-tighter text-slate-900 uppercase">
            BADGER<span className="text-emerald-500">ALERTS</span>
          </div>
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Set new password</h1>
            <p className="text-slate-500 text-sm mb-8">Choose a strong password for your account.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">New password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm new password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-600 transition shadow-lg mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Set new password"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
