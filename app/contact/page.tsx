"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "", website: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: formData.name, email: formData.email, subject: formData.subject, message: formData.message, honeypot: formData.website }),
    });

    if (res.ok) {
      setSent(true);
    } else {
      setError("Something went wrong. Please try again or email us directly.");
    }
    setLoading(false);
  };

  return (
    <div style={{ background: "#eff4fb", minHeight: "100vh" }}>
      {/* Nav */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white p-1 shadow-md transition-transform group-hover:scale-105">
            <svg viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path fill="currentColor" d="M12 22a2.25 2.25 0 0 0 2.2-1.8H9.8A2.25 2.25 0 0 0 12 22Z" />
              <path fill="currentColor" d="M20 18.2H4c.9-1 2.2-2.1 2.2-5.2V10.3A5.8 5.8 0 0 1 10.7 4.7V3.6c0-.7.6-1.3 1.3-1.3s1.3.6 1.3 1.3v1.1a5.8 5.8 0 0 1 4.5 5.6V13c0 3.1 1.3 4.2 2.2 5.2Z" />
              <circle cx="18.2" cy="6.2" r="2.2" fill="#10b981" />
            </svg>
          </div>
          <span className="text-[15px] font-extrabold tracking-tighter text-slate-900 uppercase">
            BADGER<span className="text-emerald-500">ALERTS</span>
          </span>
        </Link>
        <Link href="/login" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition">
          Sign in
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 md:py-16">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Get in touch</h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">Have a question about BadgerAlerts? We'd love to hear from you. Send us a message and we'll get back to you as soon as possible.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Left — contact info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Email us</h3>
              <p className="text-sm text-slate-500">hello@badgeralerts.live</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Response time</h3>
              <p className="text-sm text-slate-500">We aim to reply within 1 business day.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Based in</h3>
              <p className="text-sm text-slate-500">England, United Kingdom</p>
            </div>
          </div>

          {/* Right — form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Message sent!</h2>
                  <p className="text-slate-500 mb-6">Thanks for reaching out. We'll get back to you within 1 business day.</p>
                  <Link href="/" className="text-emerald-600 font-semibold text-sm hover:underline">
                    Back to home
                  </Link>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-extrabold text-slate-900 mb-6">Send us a message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Honeypot — hidden from real users, bots fill it in */}
                    <div style={{ display: "none" }} aria-hidden="true">
                      <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Jane Smith"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="jane@company.com"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm"
                      >
                        <option value="">Select a topic</option>
                        <option value="General enquiry">General enquiry</option>
                        <option value="Account help">Account help</option>
                        <option value="Billing">Billing</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help..."
                        required
                        rows={6}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm resize-none"
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
                      className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-600 transition shadow-lg disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                    >
                      {loading ? "Sending..." : "Send message"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
