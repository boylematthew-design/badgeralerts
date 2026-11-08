// "Things we could talk about" on the Book a call block of each services page (/services/[slug]),
// keyed by the guide's slug like lib/services.ts and lib/service-process.ts.
// Guides without an entry use getServiceCallTopics' generic wording.

const CALL_TOPICS: Record<string, string[]> = {
  "google-maps-marketing": [
    "Why competitors show up above you in the map pack",
    "Quick fixes for your Google Business Profile",
    "How to get more genuine reviews, within Google's rules",
    "Turning profile views into calls, directions and bookings",
  ],
  "local-seo": [
    "Which towns and searches to focus on first",
    "Whether your listings and directory details are holding you back",
    "Location and service pages that rank and bring in enquiries",
    "How to track the calls and leads that local search brings in",
  ],
  "technical-seo": [
    "A recent traffic drop and what might have caused it",
    "Pages that aren't being indexed, or are indexed when they shouldn't be",
    "Page speed and Core Web Vitals",
    "Planning a redesign or migration without losing rankings",
  ],
  aio: [
    "Whether ChatGPT, Gemini and Perplexity mention you today",
    "Why AI tools recommend a competitor instead",
    "How Google's AI Overviews affect your traffic",
    "The content and mentions that get you cited",
  ],
  "airbnb-listing-optimisation-guide": [
    "Why your listing isn't ranking in Airbnb search",
    "Photos, title and description changes that win more bookings",
    "Pricing and minimum stays for quiet and busy seasons",
    "Getting more five-star reviews and reaching Superhost",
  ],
  "youtube-search-optimisation": [
    "Why some videos take off and others don't",
    "Video topics people are actually searching for",
    "Titles and thumbnails that earn the click",
    "Turning views into subscribers, leads or sales",
  ],
  "x-optimisation": [
    "Sharpening your profile, bio and pinned post",
    "Content pillars that suit your business",
    "A reply and engagement routine that grows your audience",
    "Turning followers into leads and customers",
  ],
  "tiktok-search-optimisation": [
    "What your customers search for on TikTok",
    "Keywords for captions, on-screen text and your profile",
    "Video ideas you can film with what you have",
    "Turning views into website clicks and sales",
  ],
  "instagram-optimisation": [
    "Getting more from your profile, bio and highlights",
    "A Reels plan that fits the time you have",
    "Captions and keywords that help people find you",
    "Turning followers into enquiries and sales",
  ],
  "amazon-listing-optimisation": [
    "Why your products aren't ranking for key searches",
    "Titles, bullet points and images that convert",
    "Making Sponsored Products spend more efficient",
    "Planning for Prime Day, Christmas and new launches",
  ],
  "ecommerce-seo": [
    "Which categories and products have the most potential",
    "Duplicate pages, filters and other catalogue problems",
    "Product schema and rich results in Google",
    "Tracking the revenue organic search brings in",
  ],
  "reddit-marketing": [
    "Which subreddits your customers use",
    "What's already being said about your brand",
    "Taking part without breaking community rules",
    "Reddit threads that rank on Google for your searches",
  ],
  "jewellery-digital-marketing-services-seo": [
    "Getting your collections found for searches like engagement rings or gold necklaces",
    "Product photos, descriptions and schema that help pieces sell online",
    "Bringing local shoppers into your showroom or store",
    "Planning for Christmas, Valentine's Day and other gifting peaks",
  ],
  "restaurant-digital-marketing-services-seo": [
    "Showing up when people search for places to eat nearby",
    "Your Google Business Profile, menu and photos",
    "Getting more reviews and replying to them well",
    "Turning searches into table bookings and orders",
  ],
  "digital-marketing-for-plumbers": [
    "Showing up first for emergency and local plumbing searches",
    "Your Google Business Profile and getting more reviews",
    "Whether Local Services Ads or Google Ads are worth it for you",
    "Tracking which calls and jobs your marketing brings in",
  ],
  "digital-marketing-servics-seo-for-electricians": [
    "Ranking for electrician searches in the areas you cover",
    "Your Google Business Profile and getting more reviews",
    "Whether Local Services Ads or Google Ads are worth it for you",
    "Tracking which calls and jobs your marketing brings in",
  ],
};

export function getServiceCallTopics(guideSlug: string, serviceName: string): string[] {
  return (
    CALL_TOPICS[guideSlug] ?? [
      `Where your ${serviceName} stands today`,
      "Quick wins you could make straight away",
      "What your competitors are doing differently",
      "Whether a one-off audit or monthly support suits you",
    ]
  );
}
