import Link from "next/link";
import { footerLinks } from "@/lib/footer-links";

export default function DashboardFooter() {
  return (
    <footer className="border-t border-border px-6 md:px-10 py-5 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <p className="text-[12px] text-muted">
          &copy; 2026 Matthew Boyle &middot; Built in London
        </p>
        <nav className="flex flex-wrap gap-x-5 gap-y-1.5">
          {footerLinks.flatMap((section) =>
            section.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[12px] text-muted hover:text-accent-dark transition-colors"
              >
                {link.label}
              </Link>
            ))
          )}
        </nav>
      </div>
    </footer>
  );
}
