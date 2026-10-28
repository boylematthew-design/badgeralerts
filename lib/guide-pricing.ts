// Pricing shown on each services page (/services/[slug]).
// To change prices, edit GUIDE_PRICES. To change what's included for a topic, edit its entry
// in GUIDE_PRICING_FEATURES (keyed by the guide's slug). Guides without an entry use DEFAULT_FEATURES.

export const GUIDE_PRICES = {
  audit: "£500",
  monthly: "£1,500",
};

export interface PricingFeature {
  label: string;
  audit: boolean;
  monthly: boolean;
}

const DEFAULT_FEATURES: PricingFeature[] = [
  { label: "Full audit of your current setup", audit: true, monthly: true },
  { label: "Competitor benchmarking", audit: true, monthly: true },
  { label: "Prioritised action plan", audit: true, monthly: true },
  { label: "Recorded walkthrough of findings", audit: true, monthly: false },
  { label: "Hands-on implementation of fixes", audit: false, monthly: true },
  { label: "Ongoing optimisation and testing", audit: false, monthly: true },
  { label: "Monthly performance report", audit: false, monthly: true },
  { label: "Monthly strategy call", audit: false, monthly: true },
];

export const GUIDE_PRICING_FEATURES: Record<string, PricingFeature[]> = {
  "google-maps-marketing-guide": [
    { label: "Google Business Profile audit", audit: true, monthly: true },
    { label: "Map pack ranking check for your key searches", audit: true, monthly: true },
    { label: "Competitor profile comparison", audit: true, monthly: true },
    { label: "Category, services and attributes review", audit: true, monthly: true },
    { label: "Weekly Google Posts written and published", audit: false, monthly: true },
    { label: "Photo uploads and profile updates", audit: false, monthly: true },
    { label: "Review request strategy and replies", audit: false, monthly: true },
    { label: "Monthly local ranking grid report", audit: false, monthly: true },
  ],
  "reddit-marketing": [
    { label: "Subreddit research for your niche", audit: true, monthly: true },
    { label: "Brand mention and sentiment check", audit: true, monthly: true },
    { label: "Account and karma health review", audit: true, monthly: true },
    { label: "Reddit content strategy document", audit: true, monthly: true },
    { label: "Community engagement on your behalf", audit: false, monthly: true },
    { label: "Thread monitoring and response alerts", audit: false, monthly: true },
    { label: "Reddit Ads setup and management", audit: false, monthly: true },
    { label: "Monthly traffic and reach report", audit: false, monthly: true },
  ],
  "technical-seo": [
    { label: "Full site crawl and error report", audit: true, monthly: true },
    { label: "Core Web Vitals and page speed review", audit: true, monthly: true },
    { label: "Indexing, robots.txt and sitemap check", audit: true, monthly: true },
    { label: "Prioritised fix list for your developer", audit: true, monthly: true },
    { label: "Schema markup implementation", audit: false, monthly: true },
    { label: "Fixes implemented or managed with your dev team", audit: false, monthly: true },
    { label: "Ongoing crawl monitoring and alerts", audit: false, monthly: true },
    { label: "Monthly technical health report", audit: false, monthly: true },
  ],
  aio: [
    { label: "AI search visibility check (ChatGPT, Gemini, Perplexity)", audit: true, monthly: true },
    { label: "Google AI Overviews presence review", audit: true, monthly: true },
    { label: "Brand mention and citation analysis", audit: true, monthly: true },
    { label: "Content structure recommendations", audit: true, monthly: true },
    { label: "Content rewritten for AI answers", audit: false, monthly: true },
    { label: "Entity and schema optimisation", audit: false, monthly: true },
    { label: "Third-party citation building", audit: false, monthly: true },
    { label: "Monthly AI visibility tracking report", audit: false, monthly: true },
  ],
  "airbnb-listing-optimisation-guide": [
    { label: "Listing title and description review", audit: true, monthly: true },
    { label: "Photo order and quality review", audit: true, monthly: true },
    { label: "Pricing comparison against local competitors", audit: true, monthly: true },
    { label: "Amenities and settings checklist", audit: true, monthly: true },
    { label: "Listing copy rewritten and tested", audit: false, monthly: true },
    { label: "Seasonal pricing and availability adjustments", audit: false, monthly: true },
    { label: "Review response strategy", audit: false, monthly: true },
    { label: "Monthly search ranking and bookings report", audit: false, monthly: true },
  ],
  "youtube-search-optimisation": [
    { label: "Channel and playlist audit", audit: true, monthly: true },
    { label: "Video title, description and tag review", audit: true, monthly: true },
    { label: "Keyword research for YouTube search", audit: true, monthly: true },
    { label: "Thumbnail and click-through analysis", audit: true, monthly: true },
    { label: "Optimised metadata for every new upload", audit: false, monthly: true },
    { label: "Chapters, captions and end screens set up", audit: false, monthly: true },
    { label: "Thumbnail A/B testing", audit: false, monthly: true },
    { label: "Monthly views and search traffic report", audit: false, monthly: true },
  ],
  "x-optimisation": [
    { label: "Profile, bio and pinned post review", audit: true, monthly: true },
    { label: "Past post performance analysis", audit: true, monthly: true },
    { label: "Competitor and audience research", audit: true, monthly: true },
    { label: "Content pillars and posting plan", audit: true, monthly: true },
    { label: "Posts and threads written for you", audit: false, monthly: true },
    { label: "Engagement and reply management", audit: false, monthly: true },
    { label: "X Ads setup and management", audit: false, monthly: true },
    { label: "Monthly growth and impressions report", audit: false, monthly: true },
  ],
  "tiktok-search-optimisation": [
    { label: "Profile and bio keyword review", audit: true, monthly: true },
    { label: "TikTok search keyword research", audit: true, monthly: true },
    { label: "Past video performance analysis", audit: true, monthly: true },
    { label: "Trend and competitor review", audit: true, monthly: true },
    { label: "Captions, on-screen text and hashtags for each video", audit: false, monthly: true },
    { label: "Video ideas and hook scripts", audit: false, monthly: true },
    { label: "Posting schedule management", audit: false, monthly: true },
    { label: "Monthly search ranking and views report", audit: false, monthly: true },
  ],
  "instagram-optimisation": [
    { label: "Profile, bio and highlights review", audit: true, monthly: true },
    { label: "Instagram search keyword research", audit: true, monthly: true },
    { label: "Content and engagement analysis", audit: true, monthly: true },
    { label: "Hashtag and competitor review", audit: true, monthly: true },
    { label: "Captions and alt text written for each post", audit: false, monthly: true },
    { label: "Reels strategy and content calendar", audit: false, monthly: true },
    { label: "Community and DM engagement plan", audit: false, monthly: true },
    { label: "Monthly reach and follower growth report", audit: false, monthly: true },
  ],
  "amazon-listing-optimisation": [
    { label: "Product title, bullets and description review", audit: true, monthly: true },
    { label: "Amazon keyword research", audit: true, monthly: true },
    { label: "Image and A+ content review", audit: true, monthly: true },
    { label: "Competitor listing comparison", audit: true, monthly: true },
    { label: "Listings rewritten and backend keywords updated", audit: false, monthly: true },
    { label: "A+ content and storefront updates", audit: false, monthly: true },
    { label: "Sponsored Products ad management", audit: false, monthly: true },
    { label: "Monthly ranking and sales report", audit: false, monthly: true },
  ],
  "local-seo": [
    { label: "Google Business Profile audit", audit: true, monthly: true },
    { label: "Local citation and NAP consistency check", audit: true, monthly: true },
    { label: "Local keyword and competitor research", audit: true, monthly: true },
    { label: "Location page review", audit: true, monthly: true },
    { label: "Citation building and clean-up", audit: false, monthly: true },
    { label: "Location pages written and optimised", audit: false, monthly: true },
    { label: "Review generation strategy", audit: false, monthly: true },
    { label: "Monthly local rankings report", audit: false, monthly: true },
  ],
  "ecommerce-seo": [
    { label: "Category and product page audit", audit: true, monthly: true },
    { label: "Site structure and faceted navigation review", audit: true, monthly: true },
    { label: "Product schema and rich results check", audit: true, monthly: true },
    { label: "Keyword gap analysis vs competitors", audit: true, monthly: true },
    { label: "Category and product copy written", audit: false, monthly: true },
    { label: "Internal linking improvements", audit: false, monthly: true },
    { label: "Out-of-stock and seasonal page handling", audit: false, monthly: true },
    { label: "Monthly organic revenue report", audit: false, monthly: true },
  ],
};

export function getGuidePricingFeatures(slug: string): PricingFeature[] {
  return GUIDE_PRICING_FEATURES[slug] ?? DEFAULT_FEATURES;
}
