import Link from "next/link";
import Footer from "@/components/Footer";

const entries = [
  {
    version: "v1.2",
    date: "May 2026",
    label: "Expert Help",
    changes: [
      "Users can now request expert assistance directly from any alert",
      "Enquiries are delivered to the BadgerAlerts team with full context",
      "Founder welcome email sent automatically after account confirmation",
    ],
  },
  {
    version: "v1.1",
    date: "April 2026",
    label: "Account & Notifications",
    changes: [
      "Automated email notifications when new alerts are ready to view",
      "Password reset flow added for users who forget their credentials",
      "Users can update their name and manage account settings",
      "Account deletion available from the settings page",
      "Email unsubscribe supported from all notification emails",
      "Contact page added for direct enquiries",
    ],
  },
  {
    version: "v1.0",
    date: "April 2026",
    label: "Launch",
    changes: [
      "BadgerAlerts goes live",
      "Users can sign up and verify their account via email",
      "Personalised digital marketing alerts delivered to your dashboard",
      "Alerts cover SEO, social media, competitors, content strategy, and paid media",
      "Full alert detail pages with explanations and recommended actions",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div style={{ background: "#eff4fb", minHeight: "100vh" }}>
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-[15px] font-extrabold tracking-tighter text-slate-900 uppercase">
          BADGER<span className="text-emerald-500">ALERTS</span>
        </Link>
        <Link href="/login" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition">
          Sign in
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Changelog</h1>
          <p className="text-slate-500">What's new at BadgerAlerts.</p>
        </div>

        <div className="space-y-6">
          {entries.map((entry) => (
            <div key={entry.version} className="bg-white rounded-3xl border border-slate-200 shadow-sm px-8 py-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {entry.version}
                </span>
                <span className="text-sm font-bold text-slate-900">{entry.label}</span>
                <span className="text-sm text-slate-400 ml-auto">{entry.date}</span>
              </div>
              <ul className="space-y-2">
                {entry.changes.map((change, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
