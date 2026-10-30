import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";

export const metadata = {
  title: "FAQ | Compounding Wins",
};

const faqs = [
  {
    q: "What is Compounding Wins?",
    a: "Compounding Wins is a digital marketing monitoring tool that automatically scans your website and online presence for issues and opportunities. When something is found — whether it's a drop in page speed, a competitor making moves, or an SEO opportunity — you receive a personalised alert in your dashboard and by email.",
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
    a: "Each alert detail page has a 'Get expert help' button at the bottom. Click it, describe what you need help with, and submit an enquiry. Our team will get back to you directly by email. You can also reach us at hello@compoundingwins.com at any time.",
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
    q: "Who is behind Compounding Wins?",
    a: "Compounding Wins was built by Matthew Boyle, a digital marketing and web professional based in England with over 20 years of experience working on websites and online presence. The tool was built to surface the kinds of issues Matthew kept spotting for clients — automatically, and without the need for an ongoing consultant.",
  },
];

export default function FAQPage() {
  return (
    <div className="bg-paper text-ink">
      <Navbar />
      <PageHero
        eyebrow="Support"
        title={<>Frequently asked <em>questions</em></>}
        intro={<>Everything you need to know about Compounding Wins.</>}
      />
      <main className="max-w-[760px] mx-auto px-7 md:px-12 py-14 md:py-20">

        <div className="flex flex-col gap-3 mb-12">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-border rounded-[14px] px-6 py-5 hover:border-border-strong transition-colors">
              <h3 className="text-[14px] font-medium text-ink mb-2">{faq.q}</h3>
              <p className="text-[13.5px] text-mid leading-[1.7]">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>
      <CtaBand
        title={<>Still have a question?</>}
        body={<>We&apos;re happy to help. Drop us a message and we&apos;ll get back to you.</>}
        href="/contact"
        label="Get in touch"
      />
      <Footer />
    </div>
  );
}
