import Link from "next/link";
import Footer from "@/components/Footer";

const faqs = [
  {
    q: "What is BadgerAlerts?",
    a: "BadgerAlerts is a digital marketing monitoring tool that automatically scans your website and online presence for issues and opportunities. When something is found — whether it's a drop in page speed, a competitor making moves, or an SEO opportunity — you receive a personalised alert in your dashboard and by email.",
  },
  {
    q: "How does it work?",
    a: "After you sign up and confirm your email, our systems get to work. AI analyses your website, scans your competitors, monitors search rankings, and looks for opportunities and issues across SEO, social media, content, and paid media. That intelligence is then reviewed and shaped into clear, actionable alerts — delivered to your dashboard and straight to your inbox. Each alert includes a full explanation, why it matters, and exactly what you can do about it.",
  },
  {
    q: "What kinds of alerts will I receive?",
    a: "Alerts cover five key areas: SEO (rankings, technical issues, keyword opportunities), Social Media (content ideas, competitor activity), Competitors (moves your rivals are making that could affect you), Content Strategy (gaps in your content, blog opportunities), and Paid Media (ad spend opportunities, market conditions).",
  },
  {
    q: "How quickly will I receive my first alert?",
    a: "Once your account is confirmed, our AI begins analysing your website and online presence straight away. You can typically expect your first alert within a few days. Each alert is checked before it reaches you — so while the intelligence is AI-driven, a human eye ensures what lands in your dashboard is accurate and genuinely useful. From there, alerts continue on an ongoing basis as new issues and opportunities emerge.",
  },
  {
    q: "Can I unsubscribe from email notifications?",
    a: "Yes. Every notification email includes an unsubscribe link at the bottom. You can also manage your email preferences from your account settings. Unsubscribing stops notification emails but does not delete your account — your alerts will still be visible in your dashboard.",
  },
  {
    q: "I need help understanding an alert — what do I do?",
    a: "Each alert detail page has a 'Get expert help' button at the bottom. Click it, describe what you need help with, and submit an enquiry. Our team will get back to you directly by email. You can also reach us at support@badgeralerts.live at any time.",
  },
  {
    q: "Can I update my account details?",
    a: "Yes. You can update your full name from the Settings page in your dashboard. Your email address and website URL are fixed at registration as they are tied to your account and the alerts we set up for you. If you need to change these, contact us directly.",
  },
  {
    q: "How do I delete my account?",
    a: "Go to Settings in your dashboard and scroll to the bottom. There is a 'Delete account' button which will permanently remove your account and all associated data. This action cannot be undone.",
  },
  {
    q: "Who is behind BadgerAlerts?",
    a: "BadgerAlerts was built by Matthew Boyle, a digital marketing and web professional based in England with over 20 years of experience working on websites and online presence. The tool was built to surface the kinds of issues Matthew kept spotting for clients — automatically, and without the need for an ongoing consultant.",
  },
];

export default function FAQPage() {
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
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Frequently asked questions</h1>
          <p className="text-slate-500">Everything you need to know about BadgerAlerts.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5">
              <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-slate-900 rounded-2xl p-6 md:p-8 text-center">
          <h3 className="text-lg font-extrabold text-white mb-2">Still have a question?</h3>
          <p className="text-slate-400 text-sm mb-4">We're happy to help. Drop us a message and we'll get back to you.</p>
          <Link
            href="/contact"
            className="inline-block bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition"
          >
            Get in touch
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
