import Link from "next/link";
import Navbar from "@/components/Navbar";
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
    <div className="bg-white text-ink">
      <Navbar />
      <main className="max-w-[760px] mx-auto px-7 md:px-12 py-14 md:py-20">
        <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-4">Support</div>
        <h1 className="font-serif font-normal text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.02em] text-ink mb-3">
          Frequently asked <em className="italic text-accent-dark">questions</em>
        </h1>
        <p className="text-[15px] md:text-[16px] text-mid font-light leading-[1.6] mb-12">
          Everything you need to know about BadgerAlerts.
        </p>

        <div className="flex flex-col gap-3 mb-12">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-border rounded-[14px] px-6 py-5 hover:border-border-strong transition-colors">
              <h3 className="text-[14px] font-medium text-ink mb-2">{faq.q}</h3>
              <p className="text-[13.5px] text-mid leading-[1.7]">{faq.a}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-ink rounded-[20px] px-8 py-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_0%,rgba(29,185,115,0.10),transparent_50%)]" />
          <div className="relative">
            <h3 className="font-serif font-normal text-[22px] md:text-[28px] leading-[1.1] tracking-[-0.02em] text-white mb-2">
              Still have a question?
            </h3>
            <p className="text-[14px] text-white/55 font-light mb-6">
              We&apos;re happy to help. Drop us a message and we&apos;ll get back to you.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-medium px-6 py-2.5 rounded-[8px] text-[14px] transition-colors"
            >
              Get in touch
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
