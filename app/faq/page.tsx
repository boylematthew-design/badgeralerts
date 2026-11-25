import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import { GUIDE_PRICES } from "@/lib/guide-pricing";
import { BUSINESS_PHONE } from "@/lib/footer-links";
import { BASE_URL, ORGANIZATION_ID, jsonLd } from "@/lib/business-schema";

export const metadata = {
  title: "FAQ: Working with Compounding Wins",
  description:
    "Answers to common questions about working with Compounding Wins, covering services, prices, audits and monthly support, timelines and getting started.",
  alternates: { canonical: "/faq" },
};

const faqs = [
  {
    q: "What is Compounding Wins?",
    a: "Compounding Wins is a London-based digital marketing agency run by Matthew Boyle, who has over 20 years' experience. It helps businesses get found online and turn that visibility into leads and sales. Alongside client work, the site has free guides and tools you can use yourself.",
  },
  {
    q: "What services do you offer?",
    a: "Local SEO and Google Maps marketing, technical SEO, ecommerce SEO and AI search optimisation (AIO and GEO), so tools like ChatGPT and Google's AI Overviews recommend you. I also cover Reddit, YouTube, TikTok, Instagram and X, Amazon and Airbnb listing optimisation, and paid media across Google, Meta and Reddit Ads.",
  },
  {
    q: "How much does it cost?",
    a: `I don't charge by the hour. Every service comes in two fixed-price options: a one-off audit for ${GUIDE_PRICES.audit}, or monthly support for ${GUIDE_PRICES.monthly} a month. One-to-one consulting is tailored to what you need, so get in touch for a price.`,
  },
  {
    q: "What's the difference between an audit and monthly support?",
    a: "The audit is a fixed project with a clear end result: a document full of recommendations that you or your team can put into action. Monthly support is hands-on. I help with the day-to-day work and we have regular check-ins to review progress. If you're not sure which suits you, get in touch and I'll recommend one.",
  },
  {
    q: "Who do you work with?",
    a: "Mostly small and growing businesses that want more customers from search, maps, social platforms and AI tools. That includes local trades, restaurants, shops, ecommerce brands, jewellers and holiday let hosts.",
  },
  {
    q: "Where are you based? Do you work remotely?",
    a: "I'm based in London and work with businesses across London, including Croydon and Lewisham. Most of the work can be done remotely, so I also work with businesses anywhere in the UK.",
  },
  {
    q: "How much of my time will it take?",
    a: "Very little. Before I start, I'll send you a short briefing form about your business, your customers and your goals. Once you've filled that in, I'll take care of the research and only come back to you if I need access to something or have a question.",
  },
  {
    q: "How long until I see results?",
    a: "It depends on the work. Some changes, such as fixing your Google Business Profile or a technical error on your website, can make a difference within days. Others, such as building reviews or getting new pages to rank, take months. Once I've reviewed where you are, I'll give you a realistic timeline.",
  },
  {
    q: "How do I get started?",
    a: `Book a free 30-minute call on Google Meet, call ${BUSINESS_PHONE.display}, or send a message through the contact page. I reply within 1 business day.`,
  },
  {
    q: "Are the guides and tools really free?",
    a: "Yes. The guides and tools are free to use. The website monitoring tool needs a free account, because it emails you alerts when something on your website needs attention.",
  },
  {
    q: "I have a website monitoring account. How do I manage it?",
    a: "Log in and go to Settings. From there you can update your name, manage your email notifications or delete your account and all its data. Every alert email also has an unsubscribe link at the bottom.",
  },
];

// FAQPage structured data, published by the Organization, so AI tools and search engines can read
// the answers directly.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${BASE_URL}/faq#faq`,
  url: `${BASE_URL}/faq`,
  publisher: { "@id": ORGANIZATION_ID },
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function FAQPage() {
  return (
    <div className="bg-paper text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema)} />
      <Navbar />
      <PageHero
        eyebrow="FAQ"
        title={<>Frequently asked <em>questions</em></>}
        intro={<>Everything you need to know about working with Compounding Wins.</>}
      />
      <main className="max-w-[760px] mx-auto px-7 md:px-12 py-14 md:py-20">

        <div className="flex flex-col gap-3 mb-12">
          {faqs.map((faq) => (
            <div key={faq.q} className="border border-border rounded-[14px] px-6 py-5 hover:border-border-strong transition-colors">
              <h2 className="text-[14px] font-medium text-ink mb-2">{faq.q}</h2>
              <p className="text-[13.5px] text-mid leading-[1.7]">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>
      <CtaBand
        title={<>Still have a question?</>}
        body={<>Book a free call or send a message, and I&apos;ll get back to you within 1 business day.</>}
        href="/contact"
        label="Get in touch"
      />
      <Footer />
    </div>
  );
}
