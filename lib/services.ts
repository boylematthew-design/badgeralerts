// Services pages (/services/[slug]): one per published blog guide. Each blog guide links to its
// services page and the services page links back, so the tips stay on /blog and the sales
// content (who we are, pricing, FAQs) lives on /services.
// Entries are keyed by the guide's slug. A published guide without an entry still gets a page,
// using its slug minus "-guide" and its topic name from the admin.

export interface ServiceInfo {
  slug: string; // URL slug under /services
  title: string; // Title Case, used in the page title and H1
  name: string; // how the service reads mid-sentence, e.g. "technical SEO"
  pitch: string; // one or two sentences on what the work involves
}

const SERVICES: Record<string, ServiceInfo> = {
  "google-maps-marketing-guide": {
    slug: "google-maps-marketing",
    title: "Google Maps Marketing",
    name: "Google Maps marketing",
    pitch:
      "I get local businesses into the map pack with a fully optimised Google Business Profile, regular Google Posts, a steady flow of reviews and monthly ranking reports.",
  },
  "reddit-marketing": {
    slug: "reddit-marketing",
    title: "Reddit Marketing",
    name: "Reddit marketing",
    pitch:
      "I help brands find the subreddits their customers use, take part in a way the community welcomes, and pick up the Google visibility that Reddit threads now get.",
  },
  "technical-seo": {
    slug: "technical-seo",
    title: "Technical SEO",
    name: "technical SEO",
    pitch:
      "I find the crawling, indexing and speed problems that quietly hold back your rankings, then turn them into a prioritised fix list or fix them with your developer.",
  },
  aio: {
    slug: "aio-geo-optimisation",
    title: "AIO and GEO Optimisation",
    name: "AIO and GEO optimisation",
    pitch:
      "I help businesses get cited and recommended by ChatGPT, Gemini, Perplexity and Google's AI Overviews through clear content, strong entity signals and mentions on trusted sites.",
  },
  "airbnb-listing-optimisation-guide": {
    slug: "airbnb-listing-optimisation",
    title: "Airbnb Listing Optimisation",
    name: "Airbnb listing optimisation",
    pitch:
      "I help hosts rank higher in Airbnb search and win more bookings with stronger photos, better listing copy, competitive pricing and a plan for great reviews.",
  },
  "youtube-search-optimisation": {
    slug: "youtube-search-optimisation",
    title: "YouTube Search Optimisation",
    name: "YouTube search optimisation",
    pitch:
      "I help channels get found in YouTube search with keyword research, optimised titles and descriptions, chapters and thumbnails that earn the click.",
  },
  "x-optimisation": {
    slug: "x-optimisation",
    title: "X Optimisation",
    name: "X optimisation",
    pitch:
      "I help brands and founders grow their reach on X with a sharper profile, focused content pillars and an engagement routine that builds an audience.",
  },
  "tiktok-search-optimisation": {
    slug: "tiktok-search-optimisation",
    title: "TikTok Search Optimisation",
    name: "TikTok search optimisation",
    pitch:
      "I help brands show up when people search on TikTok, with the right keywords in captions, on-screen text and profiles, and videos built around real searches.",
  },
  "instagram-optimisation": {
    slug: "instagram-optimisation",
    title: "Instagram Optimisation",
    name: "Instagram optimisation",
    pitch:
      "I help businesses grow their reach on Instagram with an optimised profile, keyword-rich captions, a Reels strategy and consistent community engagement.",
  },
  "amazon-listing-optimisation": {
    slug: "amazon-listing-optimisation",
    title: "Amazon Listing Optimisation",
    name: "Amazon listing optimisation",
    pitch:
      "I help sellers rank higher and convert more on Amazon with keyword research, rewritten titles and bullet points, A+ content and Sponsored Products management.",
  },
  "local-seo": {
    slug: "local-seo",
    title: "Local SEO",
    name: "local SEO",
    pitch:
      "I help local businesses rank higher in their area by fixing their Google Business Profile, cleaning up citations and building location pages that convert.",
  },
  "ecommerce-seo": {
    slug: "ecommerce-seo",
    title: "Ecommerce SEO",
    name: "ecommerce SEO",
    pitch:
      "I grow organic revenue for online stores through better site structure, product schema, internal linking and category and product copy that ranks.",
  },
};

export function getServiceForGuide(guide: { slug: string; topic_name: string | null; title: string }): ServiceInfo {
  const known = SERVICES[guide.slug];
  if (known) return known;
  const topic = guide.topic_name || guide.title;
  return {
    slug: guide.slug.replace(/-guide$/, ""),
    title: topic,
    name: topic,
    pitch: `I offer ${topic} as a one-off audit or as ongoing, hands-on monthly support.`,
  };
}
