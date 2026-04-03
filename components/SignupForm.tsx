"use client";

import { useState } from "react";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    website: "",
    fullName: "",
    email: "",
    password: "",
    agreed: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Supabase signup logic will go here
    console.log("Form submitted:", formData);
  };

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

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-emerald-500 text-white px-8 py-4 rounded-2xl text-lg font-extrabold shadow-xl shadow-emerald-200 hover:bg-emerald-600 transition-all"
      >
        Get started
      </button>

      <p className="text-xs text-slate-500 text-center">Unsubscribe anytime.</p>
    </form>
  );
}
