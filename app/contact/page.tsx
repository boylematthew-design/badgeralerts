"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inputClass =
  "w-full px-4 py-3 text-[14px] bg-white border border-border rounded-[10px] text-ink placeholder:text-muted outline-none focus:border-accent focus:shadow-[0_0_0_4px_rgba(29,185,115,0.08)] transition-all";

const selectClass =
  "w-full px-4 py-3 text-[14px] bg-white border border-border rounded-[10px] text-ink outline-none focus:border-accent focus:shadow-[0_0_0_4px_rgba(29,185,115,0.08)] transition-all";

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
    <div className="bg-white text-ink">
      <Navbar />
      <main className="max-w-[1060px] mx-auto px-7 md:px-12 py-14 md:py-20">

        <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-4">Contact</div>
        <h1 className="font-serif font-normal text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.02em] text-ink mb-4">
          Get in <em className="italic text-accent-dark">touch</em>
        </h1>
        <p className="text-[15px] md:text-[16px] text-mid font-light leading-[1.6] mb-12 max-w-[520px]">
          Have a project in mind, or a question? I&apos;d love to hear from you.
        </p>

        <div className="grid md:grid-cols-3 gap-6 md:gap-10">

          {/* Left — contact info */}
          <div className="flex flex-col gap-4">
            {[
              {
                label: "Email us",
                value: "support@badgeralerts.live",
                icon: (
                  <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                ),
              },
              {
                label: "Response time",
                value: "We aim to reply within 1 business day.",
                icon: (
                  <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
              },
              {
                label: "Based in",
                value: "England, United Kingdom",
                icon: (
                  <>
                    <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </>
                ),
              },
            ].map((item) => (
              <div key={item.label} className="border border-border rounded-[14px] p-5">
                <div className="w-9 h-9 rounded-[9px] bg-accent-light flex items-center justify-center mb-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" className="text-accent-dark" aria-hidden="true">{item.icon}</svg>
                </div>
                <p className="text-[13.5px] font-medium text-ink mb-0.5">{item.label}</p>
                <p className="text-[13px] text-muted">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Right — form */}
          <div className="md:col-span-2">
            <div className="border border-border rounded-[20px] p-7 md:p-9">
              {sent ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="font-serif font-normal text-[22px] text-ink mb-2">Message sent!</h2>
                  <p className="text-[14px] text-mid font-light mb-6">Thanks for reaching out. We&apos;ll get back to you within 1 business day.</p>
                  <Link href="/" className="text-[14px] text-accent-dark font-medium hover:underline underline-offset-2">
                    Back to home
                  </Link>
                </div>
              ) : (
                <>
                  <h2 className="text-[16px] font-medium text-ink mb-6">Send us a message</h2>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Honeypot */}
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
                      <label className="text-[12.5px] font-medium text-mid">Subject</label>
                      <select name="subject" value={formData.subject} onChange={handleChange} required className={selectClass}>
                        <option value="">Select a topic</option>
                        <option value="General enquiry">General enquiry</option>
                        <option value="Account help">Account help</option>
                        <option value="Billing">Billing</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12.5px] font-medium text-mid">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help..."
                        required
                        rows={5}
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
                        <>
                          Send message
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
