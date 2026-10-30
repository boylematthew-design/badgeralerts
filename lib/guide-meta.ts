// Meta titles and descriptions for each blog guide (/blog/[slug]), keyed by the guide's slug.
// Titles are sentence case (capitals only for the first word, proper nouns and acronyms).
// Keep titles to 60 characters and descriptions to 155 so Google shows them in full.
// Guides without an entry use their title and description from the admin.

export interface GuideMeta {
  title: string;
  description: string;
}

const GUIDE_META: Record<string, GuideMeta> = {
  "google-maps-marketing": {
    title: "Google Maps marketing guide: Ranking and optimisation tips",
    description:
      "Practical Google Maps marketing tips to get your business into the map pack, from Business Profile set-up and categories to reviews, photos and posts.",
  },
  "reddit-marketing": {
    title: "Reddit marketing guide: Strategy and community tips",
    description:
      "Practical Reddit marketing tips to find the right subreddits, join conversations without getting downvoted and win search visibility from Reddit threads.",
  },
  "technical-seo": {
    title: "Technical SEO guide: Search strategy and optimisation tips",
    description:
      "Practical technical SEO tips to fix crawling, indexing and site speed issues, from robots.txt and sitemaps to Core Web Vitals and schema markup.",
  },
  aio: {
    title: "AIO and GEO guide: AI search strategy and optimisation tips",
    description:
      "Practical AIO and GEO tips to get your brand cited by ChatGPT, Gemini, Perplexity and Google AI Overviews, with content structure and entity advice.",
  },
  "airbnb-listing-optimisation-guide": {
    title: "Airbnb listing guide: Search strategy and optimisation tips",
    description:
      "Practical Airbnb listing optimisation tips to rank higher in Airbnb search and win more bookings, covering photos, titles, pricing and guest reviews.",
  },
  "youtube-search-optimisation": {
    title: "YouTube SEO guide: Search strategy and optimisation tips",
    description:
      "Practical YouTube search optimisation tips to get your videos found, covering keyword research, titles, descriptions, chapters and thumbnails.",
  },
  "x-optimisation": {
    title: "X optimisation guide: Growth strategy and profile tips",
    description:
      "Practical X optimisation tips to grow your reach and following, from a sharper profile and pinned post to content pillars and an engagement routine.",
  },
  "tiktok-search-optimisation": {
    title: "TikTok SEO guide: Search strategy and optimisation tips",
    description:
      "Practical TikTok search optimisation tips to get your videos found when people search, with advice on keywords, captions, on-screen text and profiles.",
  },
  "instagram-optimisation": {
    title: "Instagram guide: Search strategy and optimisation tips",
    description:
      "Practical Instagram optimisation tips to grow your reach, covering profile set-up, keyword-rich captions, hashtags, Reels and community engagement.",
  },
  "amazon-listing-optimisation": {
    title: "Amazon listing guide: Search strategy and optimisation tips",
    description:
      "Practical Amazon listing optimisation tips to rank higher and sell more, covering keyword research, titles, bullet points, images and A+ content.",
  },
  "local-seo": {
    title: "Local SEO guide: Search strategy and optimisation tips",
    description:
      "Practical local SEO tips to rank higher in your area, covering your Google Business Profile, citations, reviews and location pages that convert.",
  },
  "ecommerce-seo": {
    title: "Ecommerce SEO guide: Search strategy and optimisation tips",
    description:
      "Practical ecommerce SEO tips to grow organic sales, covering site structure, category and product pages, product schema and internal linking.",
  },
};

export function getGuideMeta(slug: string): GuideMeta | undefined {
  return GUIDE_META[slug];
}
