import { footerLinks } from "@/lib/footer-links";

export default function DashboardFooter() {
  return (
    <footer className="border-t border-slate-200 px-10 py-6 bg-white mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <p className="text-xs text-slate-400">
          &copy; 2026 BadgerAlerts Intelligence Systems. All rights reserved.
        </p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {footerLinks.flatMap((section) =>
            section.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs text-slate-400 hover:text-emerald-500 transition-colors"
              >
                {link.label}
              </a>
            ))
          )}
        </nav>
      </div>
    </footer>
  );
}
