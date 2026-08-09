"use client";

import { useState } from "react";
import Link from "next/link";
import LogoMark from "./Logo";

const LINKEDIN_URL = "https://www.linkedin.com/in/mattboyle3/";

const navLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/services", label: "Services" },
  { href: "/tools", label: "Tools" },
  { href: "/consulting", label: "Consulting" },
];

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.064 2.064 0 1 1 0-4.128 2.064 2.064 0 0 1 0 4.128zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-white/[0.92] backdrop-blur-[12px]">
      <div className="flex items-center justify-between px-7 md:px-12 h-[68px]">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <LogoMark />
          <span className="text-[15px] font-medium tracking-[-0.025em] text-ink">
            Matthew Boyle
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] text-mid px-3 py-2 hover:text-ink transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Matthew Boyle's LinkedIn profile"
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-mid hover:text-ink hover:border-border-strong transition-colors"
          >
            <LinkedInIcon />
          </a>
          <Link
            href="/contact"
            className="bg-ink text-white text-[14px] font-medium px-5 py-2.5 rounded-[8px] hover:opacity-80 active:translate-y-px transition-all"
          >
            Work with me
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="md:hidden w-9 h-9 flex items-center justify-center text-ink flex-shrink-0"
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-white px-7 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-[14px] text-mid px-2 py-2.5 hover:text-ink transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 mt-2 pt-3 border-t border-border">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Matthew Boyle's LinkedIn profile"
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-mid flex-shrink-0"
            >
              <LinkedInIcon />
            </a>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="flex-1 text-center bg-ink text-white text-[14px] font-medium px-5 py-2.5 rounded-[8px]"
            >
              Work with me
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
