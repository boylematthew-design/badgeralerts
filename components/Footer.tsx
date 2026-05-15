import Link from "next/link";
import { footerLinks } from "@/lib/footer-links";

function LogoMark() {
  return (
    <div className="w-7 h-7 flex-shrink-0" aria-hidden="true">
      <svg viewBox="0 0 32 32" width="28" height="28">
        <defs>
          <clipPath id="ba-footer-clip">
            <rect width="32" height="32" rx="9" />
          </clipPath>
        </defs>
        <g clipPath="url(#ba-footer-clip)">
          <rect width="32" height="32" rx="9" fill="#111110" />
          <g fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
            <path d="M7 25 A 8 8 0 0 1 15 17" />
            <path d="M7 25 A 13 13 0 0 1 20 12" opacity="0.55" />
            <path d="M7 25 A 18 18 0 0 1 25 7" opacity="0.3" />
          </g>
          <circle cx="7" cy="25" r="2.4" fill="#1DB973" />
        </g>
      </svg>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-border w-full">
      <div className="max-w-[1120px] mx-auto px-7 md:px-12 pt-14 pb-8">
        {/* Top row: brand + link columns */}
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-9 md:gap-[60px] pb-12 border-b border-border">
          <div className="flex flex-col gap-3.5 max-w-xs">
            <Link href="/" className="flex items-center gap-2.5">
              <LogoMark />
              <span className="text-[14px] font-medium tracking-[-0.025em] text-ink">
                badger<span className="text-accent">alerts</span>
              </span>
            </Link>
            <p className="text-[13px] text-muted font-light leading-[1.55]">
              An AI tool that watches your website so you don&apos;t have to.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 md:gap-[60px]">
            {footerLinks.map((section) => (
              <div key={section.heading} className="flex flex-col gap-3">
                <div className="text-[12px] font-semibold text-ink mb-1">
                  {section.heading}
                </div>
                {section.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-[13.5px] text-mid font-light hover:text-accent-dark transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-6">
          <span className="text-[12.5px] text-muted">
            &copy; 2026 BadgerAlerts &middot; Built in London 🇬🇧
          </span>
        </div>
      </div>
    </footer>
  );
}
