"use client";

import { useState } from "react";

const inputClass =
  "w-full px-4 py-3 text-[14px] bg-white border border-border rounded-[10px] text-ink placeholder:text-muted outline-none focus:border-accent focus:shadow-[0_0_0_4px_rgba(29,185,115,0.08)] transition-all";

export default function MapsLeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    business: "",
    message: "",
    website: "", // honeypot
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/maps-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        business: formData.business,
        message: formData.message,
        honeypot: formData.website,
      }),
    });

    if (res.ok) {
      setSent(true);
    } else {
      setError("Something went wrong. Please try again or email us directly.");
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="text-center py-10">
        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif font-normal text-[22px] text-ink mb-2">Thanks — got it!</h3>
        <p className="text-[14px] text-mid font-light">We&apos;ll be in touch within 1 business day with your free quote.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Honeypot — hidden from real visitors, bots fill it in and get silently ignored */}
      <div style={{ display: "none" }} aria-hidden="true">
        <input type="text" name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12.5px] font-medium text-mid">Your name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Jane Smith" required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12.5px] font-medium text-mid">Email address</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="jane@company.com" required className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[12.5px] font-medium text-mid">Business name</label>
        <input type="text" name="business" value={formData.business} onChange={handleChange} placeholder="Jane's Cafe" required className={inputClass} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[12.5px] font-medium text-mid">What are you looking to achieve? <span className="text-muted font-normal">(optional)</span></label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us a bit about your business..."
          rows={4}
          className={`${inputClass} resize-none`}
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
        className="w-full bg-accent text-white py-3.5 rounded-[8px] text-[15px] font-medium flex items-center justify-center gap-2 hover:bg-accent-dark active:translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Sending&hellip;
          </>
        ) : (
          "Get my free quote"
        )}
      </button>
    </form>
  );
}
