// "What I do" and "How I work" copy for each services page (/services/[slug]), keyed by the
// guide's slug like lib/services.ts. Every topic follows the same eight steps (STEP_TITLES); only
// the text under each step changes, so it reflects the work that topic involves.
// Guides without an entry use getServiceProcess' generic wording.

export const STEP_TITLES = [
  "I send you a brief",
  "We talk options and agree goals",
  "I get access and record a baseline",
  "I research your business",
  "I size up the competition",
  "I get to work",
  "I report back clearly",
  "We check in regularly",
] as const;

// Steps 1 to 5 are the one-off audit; monthly support carries on from step 6.
export const AUDIT_STEP_COUNT = 5;

type Steps = [string, string, string, string, string, string, string, string];

// A covered item is either a short label, or a label with a one-line explanation under it.
export type CoverItem = string | { label: string; detail: string };

export interface ServiceProcess {
  heading?: string; // defaults to "What I do"
  whatWeDo: string;
  covers: CoverItem[];
  steps: Steps;
}

const SERVICE_PROCESS: Record<string, ServiceProcess> = {
  "google-maps-marketing": {
    heading: "What a Google Maps marketing expert does",
    whatWeDo:
      "I help local businesses show up in the Google map pack, the box of three businesses Google shows for searches like “plumber near me”, and turn those views into calls, direction requests and bookings.",
    covers: [
      {
        label: "Building a steady flow of genuine reviews",
        detail: "A simple routine for asking happy customers, and reply templates, so reviews keep coming within Google's rules.",
      },
      {
        label: "Competitor research",
        detail: "Why the businesses above you rank there: their categories, reviews, photos, posting and links.",
      },
      {
        label: "Keeping your profile up to date",
        detail: "Hours, services, photos and Posts kept current, so Google and customers see an active business.",
      },
      {
        label: "Help with paid ads",
        detail: "Advice and set-up for Local Services Ads and Google Ads location campaigns, when paid visibility makes sense.",
      },
      {
        label: "Local citations and links",
        detail: "Consistent listings on trusted directories, plus links from local partners, suppliers and community sites.",
      },
      {
        label: "Website optimisation",
        detail: "Your website matched to your profile, with service and location pages built to turn visitors into enquiries.",
      },
      {
        label: "Business schema markup",
        detail: "Structured data that tells Google your name, address, hours and services in a format it reads easily.",
      },
      {
        label: "Fighting competitor spam",
        detail: "Reporting fake listings, keyword-stuffed names and fake reviews that push genuine businesses down the map.",
      },
      {
        label: "Reinstating suspended profiles",
        detail: "If Google suspends your profile, I work out why, fix the cause and handle the reinstatement request.",
      },
      {
        label: "Rankings and geo-grid tracking",
        detail: "Ranking grids that show where you appear across your service area, street by street, for the searches that matter.",
      },
      {
        label: "Message and call tracking",
        detail: "Calls and messages from your profile tracked, so you know which enquiries Google Maps brings in.",
      },
      {
        label: "Advanced conversion tracking",
        detail: "Bookings, form fills and direction requests tracked through to your analytics, not just profile views.",
      },
      {
        label: "Clear reporting",
        detail: "Simple reports on impressions, visitors and conversions, and what changed them.",
      },
      {
        label: "Multi-location management",
        detail: "One consistent approach across every branch, with each location's profile, page and reviews looked after.",
      },
      {
        label: "Training your staff",
        detail: "Showing your team how to ask for reviews, reply well and keep the profile fresh, so results last.",
      },
    ],
    steps: [
      "My brief asks about your services, service area, opening hours, best customers and the searches you want to win.",
      "On a call we go through the brief, talk through options and agree which searches and areas matter most.",
      "I get manager access to your Google Business Profile and run a ranking grid, so I know exactly where you appear on the map today.",
      "I review your profile, website and reviews to see how clearly Google understands what you do and where you do it.",
      "I compare your profile with the businesses ranking above you: their categories, reviews, photos and posting habits.",
      "Quick fixes come first, like categories, services and attributes, then weekly Posts, photo uploads, a review routine for your team and listing clean-up.",
      "Each month you get a ranking grid and a simple report on calls, direction requests and website clicks from your profile, and what moved them.",
      "Regular check-ins to look at new reviews, seasonal offers and new areas or services worth targeting.",
    ],
  },
  "local-seo": {
    whatWeDo:
      "I help local businesses rank higher in their area, in both Google's map results and the normal search results, so nearby customers find you before a competitor.",
    covers: [
      "Google Business Profile optimisation",
      "Citation clean-up and directory listings",
      "Location and service pages that rank and convert",
      "Local links and review generation",
      "Local schema markup",
    ],
    steps: [
      "My brief covers your services, the towns and postcodes you serve, your website and anything you've tried before.",
      "On a call we talk through options and agree the areas, services and searches to focus on first.",
      "I get access to your Business Profile, Search Console and Analytics, and record your current local rankings and traffic.",
      "I audit your website, profile and listings to see how consistently your business is described online.",
      "I look at who ranks in your area, where they're listed, what pages they have and where the gaps are.",
      "Quick wins first, such as profile fixes and mismatched listings, then location pages, local links, reviews and schema.",
      "Clear monthly reports and a dashboard showing rankings by area, calls and enquiries, and what drove them.",
      "Regular check-ins to plan new location pages, seasonal pushes and the next areas to expand into.",
    ],
  },
  "technical-seo": {
    whatWeDo:
      "I find and fix the technical problems that stop search engines crawling, indexing and ranking your site, from slow pages and broken links to duplicate content and missing schema.",
    covers: [
      "Full site crawls and error reports",
      "Core Web Vitals and page speed",
      "Indexing, robots.txt and XML sitemaps",
      "Redirects, canonicals and site structure",
      "Schema markup",
    ],
    steps: [
      "My brief asks about your platform, developer set-up, recent site changes or migrations, and any traffic drops you've noticed.",
      "On a call we talk through options and agree priorities, and whether fixes are made by me or your developer.",
      "I get access to Search Console, Analytics and your CMS, and record your current indexing, speed and traffic figures.",
      "I crawl the whole site and check how Google renders, indexes and understands your key pages.",
      "I benchmark your speed and site health against competitors to show where you're losing ground.",
      "High-impact fixes come first, like indexing blocks and broken redirects, then speed, structure, internal links and schema.",
      "Regular technical health reports and a dashboard tracking indexed pages, errors, Core Web Vitals and organic traffic.",
      "Regular check-ins, plus a review before any redesign, migration or big release so nothing breaks.",
    ],
  },
  aio: {
    whatWeDo:
      "I help your business get cited and recommended by AI tools like ChatGPT, Gemini, Perplexity and Google's AI Overviews, so you're the answer when customers ask for a recommendation.",
    covers: [
      "AI search visibility checks",
      "Content that answers real customer questions",
      "Consistent brand details across the web",
      "Mentions on trusted sites and directories",
      "Structured data that AI tools can read",
    ],
    steps: [
      "My brief asks what you sell, who you sell to, the questions customers ask before buying and where your brand already appears online.",
      "On a call we talk through options and agree the questions and topics you most want AI tools to recommend you for.",
      "I test a set of prompts across the main AI tools and record whether, and how, you're mentioned today.",
      "I review how clearly your website and profiles explain what you do, who it's for, where you work and what it costs.",
      "I find which competitors AI tools recommend instead, and which sources they're quoting.",
      "I start with clear answers and structured data on your own site, then build consistent listings and mentions on the sites AI tools trust.",
      "Regular reports on your visibility across AI tools and prompts, plus the visits AI tools send to your site.",
      "Regular check-ins to add new prompts, track new AI features and decide where to earn the next mentions.",
    ],
  },
  "airbnb-listing-optimisation-guide": {
    whatWeDo:
      "I help hosts rank higher in Airbnb search and turn more views into bookings, with stronger photos, better listing copy, smarter pricing and a plan for great reviews.",
    covers: [
      "Listing title, description and amenities",
      "Photo order and shot list",
      "Pricing and minimum-stay strategy",
      "Guest messaging and review strategy",
      "Search ranking and booking tracking",
    ],
    steps: [
      "My brief asks about your property, location, guest types, current pricing and occupancy, and the reviews you've had so far.",
      "On a call we talk through options and agree targets, such as occupancy, nightly rate or Superhost status.",
      "I get co-host access and record your current search position, views, booking rate and occupancy.",
      "I review your listing as a guest would, from the first photo through to the house rules.",
      "I compare you with similar listings nearby on price, photos, amenities and reviews to find where you can win.",
      "Quick wins first, like the title, photo order and missing amenities, then pricing, messaging templates and a review plan.",
      "Simple monthly reports on views, bookings, occupancy, nightly rate and reviews, and what changed them.",
      "Regular check-ins ahead of busy seasons, local events and quiet periods to adjust pricing and offers.",
    ],
  },
  "youtube-search-optimisation": {
    whatWeDo:
      "I help channels get found in YouTube search and suggested videos, with keyword research, optimised titles and descriptions, chapters and thumbnails that earn the click.",
    covers: [
      "Keyword and topic research",
      "Titles, descriptions and tags",
      "Thumbnail testing",
      "Chapters, playlists and channel structure",
      "Retention and analytics reviews",
    ],
    steps: [
      "My brief asks about your channel, audience, goals and upload schedule, and which videos have done well or badly.",
      "On a call we talk through options and agree what success looks like, whether that's views, subscribers or leads.",
      "I get YouTube Studio access and record your current impressions, click-through rate, watch time and search traffic.",
      "I review your channel, playlists and back catalogue to see which topics and formats work for you.",
      "I study the channels ranking for your target searches: their titles, thumbnails, lengths and formats.",
      "I re-optimise older videos with potential first, then plan new videos around real searches, with titles, thumbnails and chapters built in.",
      "Regular reports on search traffic, click-through rate, retention and subscribers, and which changes made the difference.",
      "Regular check-ins to plan upcoming videos, test thumbnails and jump on trending topics in your niche.",
    ],
  },
  "x-optimisation": {
    whatWeDo:
      "I help brands and founders grow a relevant audience on X with a sharper profile, focused content pillars and an engagement routine that turns followers into customers.",
    covers: [
      "Profile, bio and pinned post",
      "Content pillars and a posting plan",
      "Engagement and reply strategy",
      "Threads and long-form posts",
      "Audience and analytics reviews",
    ],
    steps: [
      "My brief asks about your business, who you want to reach, your voice and the accounts you admire.",
      "On a call we talk through options and agree goals, such as followers, profile visits, leads or sign-ups.",
      "I get access to your account and analytics, and record your current followers, reach and engagement.",
      "I review your profile and past posts to see which topics and formats get traction.",
      "I look at competitors and leading voices in your space to find the conversations worth joining.",
      "Profile fixes come first, then content pillars, a posting schedule, threads and a daily reply routine.",
      "Regular reports on reach, engagement, follower growth and clicks, and which posts drove them.",
      "Regular check-ins to plan around launches, news and events in your industry.",
    ],
  },
  "tiktok-search-optimisation": {
    whatWeDo:
      "I help brands show up when people search on TikTok, by putting the right keywords in captions, on-screen text and profiles, and building videos around what people actually search for.",
    covers: [
      "TikTok keyword research",
      "Profile and bio optimisation",
      "Captions, on-screen text and spoken keywords",
      "Video ideas built around real searches",
      "Search and analytics tracking",
    ],
    steps: [
      "My brief asks about your products, audience, current TikTok activity and the content you're able to film.",
      "On a call we talk through options and agree goals, whether that's views, followers, website clicks or sales.",
      "I get access to your account and analytics, and record your current views, followers and search traffic.",
      "I review your profile and videos to see what's already being found through search.",
      "I look at who ranks for your target searches and what their videos have in common.",
      "Profile and keyword fixes first, then a content plan built around real searches, with captions and on-screen text written for you.",
      "Regular reports on views from search, followers and clicks, and which videos drove them.",
      "Regular check-ins to plan new videos and catch trends and seasonal searches early.",
    ],
  },
  "instagram-optimisation": {
    whatWeDo:
      "I help businesses grow their reach on Instagram with an optimised profile, keyword-rich captions, a Reels strategy and consistent community engagement.",
    covers: [
      "Profile, bio and highlights",
      "Keyword-rich captions and alt text",
      "Reels and content planning",
      "Community engagement",
      "Insights and growth reporting",
    ],
    steps: [
      "My brief asks about your brand, audience, goals and the content you can produce, from photos to Reels.",
      "On a call we talk through options and agree goals, such as reach, followers, enquiries or sales.",
      "I get access to your account and Insights, and record your current reach, engagement and follower growth.",
      "I review your profile, grid and recent posts to see what your audience responds to.",
      "I look at competitors and the accounts your customers follow to find gaps and content ideas.",
      "Profile and highlight fixes first, then a content calendar, a Reels plan, optimised captions and an engagement routine.",
      "Regular reports on reach, engagement, followers and link clicks, and the posts behind them.",
      "Regular check-ins to plan launches, campaigns and seasonal content.",
    ],
  },
  "amazon-listing-optimisation": {
    whatWeDo:
      "I help sellers rank higher and convert more on Amazon with keyword research, rewritten titles and bullet points, A+ content and Sponsored Products management.",
    covers: [
      "Amazon keyword research",
      "Titles, bullet points and backend search terms",
      "Images and A+ content",
      "Sponsored Products campaigns",
      "Review and conversion tracking",
    ],
    steps: [
      "My brief asks about your products, margins, marketplaces, current sales and advertising spend.",
      "On a call we talk through options and agree targets, such as sales, rankings, conversion rate or ad efficiency.",
      "I get Seller Central access and record your current rankings, sessions, conversion rate and ad performance.",
      "I review your listings, images, A+ content and reviews the way a shopper sees them.",
      "I compare you with the top competitors for your keywords on price, images, reviews and copy.",
      "Listing fixes come first, like titles, bullets and backend keywords, then images, A+ content and Sponsored Products.",
      "Regular reports and a dashboard on rankings, sessions, conversion, sales and ad spend, and what moved them.",
      "Regular check-ins to plan for Prime Day, the Christmas rush and new product launches.",
    ],
  },
  "ecommerce-seo": {
    whatWeDo:
      "I grow organic revenue for online stores through better site structure, product schema, internal linking and category and product copy that ranks.",
    covers: [
      "Category and product page optimisation",
      "Site structure and internal linking",
      "Product schema and rich results",
      "Technical health for large catalogues",
      "Organic revenue tracking",
    ],
    steps: [
      "My brief asks about your platform, catalogue size, best sellers, margins and where organic traffic stands today.",
      "On a call we talk through options and agree priorities, whether that's revenue, key categories or a new range.",
      "I get access to Search Console, Analytics and your store, and record your current rankings, traffic and organic revenue.",
      "I crawl your store and review categories, products, filters and internal links.",
      "I compare your category and product pages with the stores ranking above you.",
      "Quick wins first, like duplicate pages and missing schema, then category copy, product content, internal linking and structure.",
      "Regular reports and a dashboard on rankings, organic traffic and revenue by category, and what drove them.",
      "Regular check-ins ahead of sales, new ranges and seasonal peaks.",
    ],
  },
  "reddit-marketing": {
    whatWeDo:
      "I help brands find the subreddits their customers use, take part in a way the community welcomes, and pick up the Google visibility that Reddit threads now get.",
    covers: [
      "Subreddit and conversation research",
      "Brand mention and sentiment monitoring",
      "Community engagement",
      "Reddit Ads",
      "Traffic and reach reporting",
    ],
    steps: [
      "My brief asks about your product, customers and competitors, and how your brand is already talked about on Reddit.",
      "On a call we talk through options and agree goals, such as awareness, traffic, leads or reputation.",
      "I get access to your accounts and record your current mentions, sentiment and traffic from Reddit.",
      "I find the subreddits and threads where your customers ask questions, including the ones ranking on Google.",
      "I look at how competitors are discussed and where they're active, or missing.",
      "I start with account set-up and helpful, rule-friendly participation, then build up threads, AMAs and Reddit Ads where they fit.",
      "Regular reports on mentions, sentiment, traffic and leads from Reddit.",
      "Regular check-ins to react to new threads and plan the next conversations to join.",
    ],
  },
};

export function getServiceProcess(guideSlug: string, serviceName: string): ServiceProcess {
  const known = SERVICE_PROCESS[guideSlug];
  if (known) return known;
  return {
    whatWeDo: `I help businesses grow through ${serviceName}, from a one-off audit to hands-on monthly support.`,
    covers: ["A full audit of your current set-up", "Competitor benchmarking", "A prioritised action plan", "Hands-on implementation", "Monthly reporting"],
    steps: [
      "My brief asks about your business, customers, goals and what you've tried so far.",
      "On a call we talk through options and agree goals and priorities.",
      "I get access to the accounts I need and record where you stand today.",
      `I research your business, brand and current ${serviceName} set-up.`,
      "I look at your competitors and where you fit in the market.",
      "Quick wins come first, then the bigger changes and recommendations.",
      "Regular, easy-to-read reports and dashboards on what worked and what didn't.",
      "Regular check-ins with new ideas and next steps.",
    ],
  };
}
