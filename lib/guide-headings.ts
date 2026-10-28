// Hand-written H3 headings for each blog guide (/blog/[slug]), keyed by the guide's slug.
// `pricing` heads the pricing table on the services page; `guide` heads the tips (above the table of contents).
// Guides without an entry fall back to getGuideHeadings' generic wording.

export interface GuideHeadings {
  pricing: string;
  guide: string;
}

const GUIDE_HEADINGS: Record<string, GuideHeadings> = {
  "google-maps-marketing-guide": {
    pricing: "What a Google Maps marketing expert or agency costs",
    guide: "The complete guide to Google Maps marketing",
  },
  "reddit-marketing": {
    pricing: "How much Reddit marketing expert and agency services cost",
    guide: "A guide to Reddit marketing that doesn't get downvoted",
  },
  "technical-seo": {
    pricing: "What it costs to hire a technical SEO expert or agency",
    guide: "A practical guide to technical SEO, tip by tip",
  },
  aio: {
    pricing: "What AIO optimisation costs with an expert agency",
    guide: "A guide to AIO and GEO optimisation for AI search",
  },
  "airbnb-listing-optimisation-guide": {
    pricing: "What it costs to hire an Airbnb listing optimisation expert",
    guide: "A guide to optimising your Airbnb listing for more bookings",
  },
  "youtube-search-optimisation": {
    pricing: "How much a YouTube search optimisation expert or agency costs",
    guide: "A guide to ranking higher in YouTube search",
  },
  "x-optimisation": {
    pricing: "What X optimisation costs with an expert agency",
    guide: "A guide to growing your reach with X optimisation",
  },
  "tiktok-search-optimisation": {
    pricing: "How much TikTok search optimisation expert services cost",
    guide: "A guide to getting found in TikTok search",
  },
  "instagram-optimisation": {
    pricing: "What an Instagram optimisation expert or agency costs",
    guide: "A guide to Instagram optimisation that grows your reach",
  },
  "amazon-listing-optimisation": {
    pricing: "How much Amazon listing optimisation agency services cost",
    guide: "A guide to Amazon listing optimisation that lifts sales",
  },
  "local-seo": {
    pricing: "What a local SEO expert or agency costs",
    guide: "A practical guide to local SEO for your business",
  },
  "ecommerce-seo": {
    pricing: "How much ecommerce SEO expert and agency services cost",
    guide: "A guide to ecommerce SEO that drives more sales",
  },
};

export function getGuideHeadings(slug: string, topicName: string): GuideHeadings {
  return (
    GUIDE_HEADINGS[slug] ?? {
      pricing: `What ${topicName} expert and agency services cost`,
      guide: `A practical guide to ${topicName}`,
    }
  );
}
