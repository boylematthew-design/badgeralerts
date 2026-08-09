import Link from "next/link";
import { footerLinks } from "@/lib/footer-links";
import LogoMark from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-border w-full">
      <div className="max-w-[1120px] mx-auto px-7 md:px-12 pt-14 pb-8">
        {/* Top row: brand + link columns */}
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-9 md:gap-[60px] pb-12 border-b border-border">
          <div className="flex flex-col gap-3.5 max-w-xs">
            <Link href="/" className="flex items-center gap-2.5">
              <LogoMark size={28} />
              <span className="text-[14px] font-medium tracking-[-0.025em] text-ink">
                Matthew Boyle
              </span>
            </Link>
            <p className="text-[13px] text-muted font-light leading-[1.55]">
              Digital marketing consulting, guides, and tools.
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
            &copy; 2026 Matthew Boyle &middot; Built in London 🇬🇧
          </span>
        </div>
      </div>
    </footer>
  );
}
