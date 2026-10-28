// FAQs shown in accordions at the end of each services page (/services/[slug]).
// The questions are the same on every guide; the answers are tailored per topic using the
// wording in FAQ_TOPICS below, plus the prices and features from lib/guide-pricing.ts —
// so if you change a price or a feature, the FAQ answers update to match automatically.
// Guides without an entry in FAQ_TOPICS use DEFAULT_TOPIC.

import { GUIDE_PRICES, getGuidePricingFeatures } from "@/lib/guide-pricing";

export type FaqBlock = { type: "p"; text: string } | { type: "list"; heading: string; items: string[] };

export interface Faq {
  question: string;
  answer: FaqBlock[];
}

interface FaqTopic {
  service: string; // how the service reads mid-sentence, e.g. "local SEO"
  briefing: string; // what the briefing form asks about
  quickWins: string; // what can move within days
  longerTerm: string; // what takes months
  reviewThing: string; // what I review before giving a timeline
}

const DEFAULT_TOPIC: FaqTopic = {
  service: "digital marketing",
  briefing: "your business, your goals, your main competitors and what you've tried so far",
  quickWins: "fixing clear errors or gaps in your current setup",
  longerTerm: "building authority and growing your audience",
  reviewThing: "current setup",
};

const FAQ_TOPICS: Record<string, FaqTopic> = {
  "google-maps-marketing-guide": {
    service: "Google Maps marketing",
    briefing: "your business, the areas you serve, your Google Business Profile and your main local competitors",
    quickWins: "fixing your Business Profile categories or adding missing services",
    longerTerm: "building up reviews and climbing the map pack in competitive areas",
    reviewThing: "Business Profile and local competition",
  },
  "reddit-marketing": {
    service: "Reddit marketing",
    briefing: "your brand, your audience, any existing Reddit accounts and the communities you think your customers use",
    quickWins: "joining the right threads with genuinely useful replies",
    longerTerm: "building a trusted presence in a community and earning search visibility from Reddit threads",
    reviewThing: "niche and the subreddits around it",
  },
  "technical-seo": {
    service: "technical SEO",
    briefing: "your website, the platform it's built on, who makes changes to it and any known issues",
    quickWins: "fixing a robots.txt block or a broken redirect",
    longerTerm: "site-wide speed improvements and getting large sections of a site re-crawled and re-indexed",
    reviewThing: "site crawl",
  },
  aio: {
    service: "AIO and GEO optimisation",
    briefing: "your business, the questions your customers ask, your key content and where your brand is already mentioned online",
    quickWins: "restructuring key pages so AI tools can pick out clear answers",
    longerTerm: "earning citations on the sites AI tools trust and becoming the brand they recommend",
    reviewThing: "current visibility in AI answers",
  },
  "airbnb-listing-optimisation-guide": {
    service: "Airbnb listing optimisation",
    briefing: "your property, your listing, your pricing and the guests you want to attract",
    quickWins: "a new title, better photo order or a pricing tweak",
    longerTerm: "building up reviews and ranking consistently across the seasons",
    reviewThing: "listing and local competition",
  },
  "youtube-search-optimisation": {
    service: "YouTube search optimisation",
    briefing: "your channel, your audience, the topics you cover and your upload schedule",
    quickWins: "improving the titles, descriptions and thumbnails of existing videos",
    longerTerm: "growing a channel that ranks for its core topics",
    reviewThing: "channel",
  },
  "x-optimisation": {
    service: "X optimisation",
    briefing: "your account, your audience, your goals on X and the accounts you see as competitors",
    quickWins: "a sharper profile and pinned post",
    longerTerm: "building a following and a reputation in your niche",
    reviewThing: "account",
  },
  "tiktok-search-optimisation": {
    service: "TikTok search optimisation",
    briefing: "your brand, your audience, your TikTok account and the searches you want to show up for",
    quickWins: "adding the right keywords to captions and on-screen text",
    longerTerm: "building a library of videos that rank for your key searches",
    reviewThing: "account and niche",
  },
  "instagram-optimisation": {
    service: "Instagram optimisation",
    briefing: "your brand, your audience, your Instagram account and your content so far",
    quickWins: "an optimised profile and keyword-rich captions",
    longerTerm: "growing reach and followers through a consistent Reels strategy",
    reviewThing: "account",
  },
  "amazon-listing-optimisation": {
    service: "Amazon listing optimisation",
    briefing: "your products, your listings, your best sellers and your main competitors on Amazon",
    quickWins: "updating titles and backend keywords",
    longerTerm: "building sales history and reviews that lift your rankings",
    reviewThing: "listings and category",
  },
  "local-seo": {
    service: "local SEO",
    briefing: "your business, the areas you serve, your Google Business Profile and your main local competitors",
    quickWins: "fixing your Google Business Profile or inconsistent business details",
    longerTerm: "building citations, reviews and location pages that rank",
    reviewThing: "local search presence",
  },
  "ecommerce-seo": {
    service: "ecommerce SEO",
    briefing: "your store, the platform it runs on, your key product categories and your main competitors",
    quickWins: "fixing indexing issues or improving key category pages",
    longerTerm: "growing organic revenue across your whole catalogue",
    reviewThing: "store",
  },
};

export function getGuideFaqHeading(slug: string) {
  const t = FAQ_TOPICS[slug] ?? DEFAULT_TOPIC;
  return `Frequently asked questions about ${t.service}`;
}

export function getGuideFaqs(slug: string): Faq[] {
  const t = FAQ_TOPICS[slug] ?? DEFAULT_TOPIC;
  const features = getGuidePricingFeatures(slug);
  const auditItems = features.filter((f) => f.audit).map((f) => f.label);
  const retainerExtras = features.filter((f) => f.monthly && !f.audit).map((f) => f.label);

  return [
    {
      question: `Do you charge for ${t.service} on a fixed-project, hourly or monthly retainer basis?`,
      answer: [
        {
          type: "p",
          text: `I don't charge by the hour. My ${t.service} services come in two fixed-price options: a one-off audit for ${GUIDE_PRICES.audit}, or a monthly retainer at ${GUIDE_PRICES.monthly} per month.`,
        },
        {
          type: "p",
          text: "The audit is a fixed project with a clear end result, so you know the full cost up front. The retainer is a monthly fee for ongoing, hands-on work. If you're not sure which suits you, get in touch and I'll recommend one.",
        },
      ],
    },
    {
      question: "How much time and resources will you need from our team during the research phase?",
      answer: [
        {
          type: "p",
          text: `Very little. Before I start, I'll send you a briefing form with questions about ${t.briefing}. Once you've filled that in, I'll take care of the research and only come back to you if I need access to something or have a question.`,
        },
      ],
    },
    {
      question: `How long will it take to see results from ${t.service}?`,
      answer: [
        {
          type: "p",
          text: `How long is a piece of string? It depends on the campaign, and it can take anywhere from a few days to several months. Some changes, such as ${t.quickWins}, can make a difference within days. Others, such as ${t.longerTerm}, take months.`,
        },
        {
          type: "p",
          text: `Once I've reviewed your ${t.reviewThing}, I'll give you a realistic timeline for your situation.`,
        },
      ],
    },
    {
      question: `What's the difference between the ${t.service} audit and the monthly retainer?`,
      answer: [
        {
          type: "p",
          text: "With the audit, I'll present you with an audit document full of recommendations, which you or your team can then put into action.",
        },
        { type: "list", heading: "The audit covers:", items: auditItems },
        {
          type: "p",
          text: `With the retainer, I'm hands-on. I'll help with the day-to-day management of your ${t.service} and we'll have regular check-ins to review progress.`,
        },
        { type: "list", heading: "On top of everything in the audit, the retainer includes:", items: retainerExtras },
      ],
    },
  ];
}
