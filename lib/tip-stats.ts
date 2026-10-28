// Stats shown under a tip in a "Stats" box, each with numbered source links ([1], [2]...).
// Keyed by the tip's id (the comment above each entry says which tip it is). A stat can cite
// more than one source; numbering runs across all the stats on a tip.

export interface StatSource {
  label: string;
  url: string;
}

export interface TipStat {
  text: string;
  sources: StatSource[];
}

const TIP_STATS: Record<string, TipStat[]> = {
  // Ecommerce SEO: Don't hide key product details behind JavaScript
  "a7c0b3d4-5a08-4596-a895-d802551f8864": [
    {
      text: "None of the major AI crawlers (ChatGPT's GPTBot, ClaudeBot, PerplexityBot) run JavaScript. They download JS files but don't execute them, so anything loaded by JavaScript is invisible to them.",
      sources: [
        { label: "Vercel, Dec 2024", url: "https://vercel.com/blog/the-rise-of-the-ai-crawler" },
      ],
    },
  ],
  // Ecommerce SEO: Leave no product question unanswered: Fill out your product pages with as much information as possible
  "8715e89d-e7e2-42f7-9a3d-85e32df193fa": [
    {
      text: "Baymard rates 52% of desktop and 62% of mobile ecommerce product pages 'mediocre' or worse. 60% of shoppers look for the returns policy on the product page, and 42% try to judge size from the product photos.",
      sources: [
        { label: "Baymard Institute, updated Mar 2026", url: "https://baymard.com/blog/current-state-ecommerce-product-page-ux" },
      ],
    },
  ],
  // Ecommerce SEO: Get into Google Shopping to reach AI shoppers
  "86d66f03-6516-4221-93a7-1e5cbd6f0b28": [
    {
      text: "Traffic from generative AI tools to US retail websites rose 693% year on year over the 2025 Christmas shopping season.",
      sources: [
        { label: "Adobe Analytics 2025 holiday season, Jan 2026", url: "https://news.adobe.com/news/downloads/pdfs/2026/01/010726-2025-holiday-shopping-season.pdf" },
      ],
    },
  ],
  // Ecommerce SEO: Make your shop easy for AI agents to buy from
  "5ce5252b-11d8-455f-bc4b-ce03c0902cca": [
    {
      text: "Traffic from generative AI tools to US retail websites rose 693% year on year over the 2025 Christmas shopping season.",
      sources: [
        { label: "Adobe Analytics 2025 holiday season, Jan 2026", url: "https://news.adobe.com/news/downloads/pdfs/2026/01/010726-2025-holiday-shopping-season.pdf" },
      ],
    },
  ],
  // Local SEO: Get the basics right first: Don't run before you can walk
  "e4fd94df-30a3-48ea-92a0-d61e591bc1bd": [
    {
      text: "Google says customers are 2.7x more likely to consider a business reputable, and 70% more likely to visit, if it has a complete Business Profile.",
      sources: [
        { label: "Google Business Profile Help", url: "https://support.google.com/business/answer/10515606" },
      ],
    },
  ],
  // Local SEO: Set up a WhatsApp Business profile where your customers can contact you
  "48f3e788-234a-4d32-8f57-bd052d96c93a": [
    {
      text: "90% of UK adults use WhatsApp.",
      sources: [
        { label: "Ofcom Online Nation 2025", url: "https://www.ofcom.org.uk/media-use-and-attitudes/online-habits/from-apps-to-ai-search-how-the-uk-goes-online-in-2025" },
      ],
    },
  ],
  // Local SEO: Apple Maps reviews are sourced from third-party sites so make sure you are active on them: Yelp, TripAdsior etc
  "590490c2-aeb3-467d-9c47-194d1f6fa3ea": [
    {
      text: "The share of consumers using Apple Maps to read reviews nearly doubled in a year, from 14% to 27%.",
      sources: [
        { label: "BrightLocal Local Consumer Review Survey 2026 (1,002 US adults, Feb 2026)", url: "https://www.brightlocal.com/learn/local-consumer-review-survey/" },
      ],
    },
  ],
  // Local SEO: Don't fake reviews; AI systems are becoming more advanced at detecting them and it will hurt you in the long run
  "438c2f75-f604-470b-886f-1b32f79d2dad": [
    {
      text: "Google blocked or removed over 292 million policy-breaking reviews and over 13 million fake Business Profiles in 2025.",
      sources: [
        { label: "Google, Apr 2026, via Search Engine Roundtable", url: "https://www.seroundtable.com/google-maps-spam-fighting-2025-41176.html" },
      ],
    },
    {
      text: "In the UK, fake reviews and hidden incentivised reviews have been illegal since 6 April 2025 under the DMCC Act, with CMA fines of up to 10% of global turnover.",
      sources: [
        { label: "CMS Law, Apr 2025", url: "https://cms.law/en/gbr/legal-updates/no-more-faux-five-stars-the-dmcc-act-bans-fake-reviews" },
      ],
    },
  ],
  // Local SEO: Reply fast to any communications you get from a classified ad
  "d4d042cb-99ba-40ed-9310-f9d4093d8a35": [
    {
      text: "Firms that contacted a web lead within an hour were nearly 7x more likely to have a meaningful conversation with a decision maker than those that waited longer. Only 37% replied within an hour, and 23% never replied. Note: an older study.",
      sources: [
        { label: "Harvard Business Review 'The Short Life of Online Sales Leads' (2011, 2,000+ US firms), via HackerNoon", url: "https://hackernoon.com/responding-to-leads-are-you-moving-fast-enough-2facfa8b75f3" },
      ],
    },
  ],
  // Local SEO: Get reviewed beyond Google
  "7b647e0f-e5f3-4803-bcc5-17e6b7292210": [
    {
      text: "Google's share of consumers using it for reviews fell from 83% to 71% in a year, and the average consumer now uses six review sites.",
      sources: [
        { label: "BrightLocal Local Consumer Review Survey 2026 (1,002 US adults, Feb 2026)", url: "https://www.brightlocal.com/learn/local-consumer-review-survey/" },
      ],
    },
  ],
  // Local SEO: Don't let your reviews get deleted because of spam and review manipulation even if they had good intention.
  "75656e8e-e33d-41be-a227-4c71f31d9870": [
    {
      text: "Google blocked or removed over 292 million policy-breaking reviews in 2025.",
      sources: [
        { label: "Google, Apr 2026, via Search Engine Roundtable", url: "https://www.seroundtable.com/google-maps-spam-fighting-2025-41176.html" },
      ],
    },
    {
      text: "Google Maps has also started asking reviewers 'Does this business offer rewards in exchange for reviews?', and reviews are reportedly deleted when they answer yes, including old ones.",
      sources: [
        { label: "PPC Land, Jun 2026", url: "https://ppc.land/google-maps-is-now-asking-users-if-businesses-paid-for-their-reviews/" },
      ],
    },
  ],
  // Local SEO: Keep a steady stream of fresh reviews
  "5f4640af-49de-48e9-92cf-320141acec7a": [
    {
      text: "74% of consumers only consider reviews from the last three months, and 32% look for reviews from the last two weeks (up from 20% a year earlier).",
      sources: [
        { label: "BrightLocal Local Consumer Review Survey 2026 (1,002 US adults, Feb 2026)", url: "https://www.brightlocal.com/learn/local-consumer-review-survey/" },
      ],
    },
  ],
  // Amazon listing optimisation: Answer every customer question on Amazon
  "6f3bd86b-491f-44f5-8298-fec33a9f5d2e": [
    {
      text: "Amazon says over 300 million customers used Rufus, its AI shopping assistant, in 2025.",
      sources: [
        { label: "Amazon Q4 2025 earnings call (Andy Jassy), via Digital Commerce 360", url: "https://www.digitalcommerce360.com/2026/02/06/amazon-sales-aws-ai-fiscal-q4-2025/" },
      ],
    },
  ],
  // Amazon listing optimisation: Write product titles that say what it is including the keyword variations that people use to search
  "93e28686-efc1-4bda-9241-b46c4a5af5c0": [
    {
      text: "57% of US online shoppers start their product searches on Amazon. Note: 2023 data.",
      sources: [
        { label: "Jungle Scout Consumer Trends Q2 2023 (1,000 US adults), via eMarketer", url: "https://www.emarketer.com/content/prime-day-us-online-shoppers-start-product-searches-amazon" },
      ],
    },
  ],
  // Instagram optimisation: See how your Instagram channel performs in Google search
  "7a43a9da-3397-405f-ba88-dd2cc58cd1bd": [
    {
      text: "Since 10 July 2025, public posts, Reels and carousels from Instagram business and creator accounts can appear in Google search results. It's switched on by default and can be turned off in Settings > Privacy.",
      sources: [
        { label: "PPC Land, Jul 2025", url: "https://ppc.land/instagram-content-becomes-searchable-on-google-starting-july-10/" },
      ],
    },
  ],
  // TikTok search optimisation: Treat the For You page like a search result you can get yourself into
  "9ac8b595-07ee-4734-8868-75ba16817a06": [
    {
      text: "65% of Gen Z have used TikTok as a search engine, but only 4% now rely on it more than Google (down from 8% in 2024), and 12% rely more on ChatGPT than Google.",
      sources: [
        { label: "Adobe Express survey (807 US consumers), Feb 2026, via Search Engine Journal", url: "https://www.searchenginejournal.com/gen-z-preference-for-tiktok-over-google-drops-50-data-shows/568267/" },
      ],
    },
  ],
  // Google Maps marketing: Keep your listing accurate and check it regularly
  "37474e83-dd5d-44ed-9e8a-256b07182ee7": [
    {
      text: "Google says customers are 2.7x more likely to consider a business reputable, and 50% more likely to consider buying from it, if it has a complete Business Profile.",
      sources: [
        { label: "Google Business Profile Help", url: "https://support.google.com/business/answer/10515606" },
      ],
    },
  ],
  // Google Maps marketing: Add a WhatsApp number to your listing
  "e56d6c8a-ae46-4832-bb10-c2b02428920b": [
    {
      text: "90% of UK adults use WhatsApp.",
      sources: [
        { label: "Ofcom Online Nation 2025", url: "https://www.ofcom.org.uk/media-use-and-attitudes/online-habits/from-apps-to-ai-search-how-the-uk-goes-online-in-2025" },
      ],
    },
  ],
  // Google Maps marketing: Respond to positive reviews
  "fffe9085-d526-48bb-96c9-262b8914a764": [
    {
      text: "80% of consumers are more likely to use a business that responds to all its reviews, and 89% expect owners to reply.",
      sources: [
        { label: "BrightLocal Local Consumer Review Survey 2026 (1,002 US adults, Feb 2026)", url: "https://www.brightlocal.com/learn/local-consumer-review-survey/" },
      ],
    },
  ],
  // Google Maps marketing: Respond to negative reviews
  "7aac3b53-2e72-4e98-b65c-79875ac7f73d": [
    {
      text: "42% of consumers are unlikely to use a business that never replies to reviews, and 50% are put off by templated, generic replies. 32% expect a reply by the next day (up from 18%).",
      sources: [
        { label: "BrightLocal Local Consumer Review Survey 2026 (1,002 US adults, Feb 2026)", url: "https://www.brightlocal.com/learn/local-consumer-review-survey/" },
      ],
    },
  ],
  // Google Maps marketing: Share your review link with customers
  "66eb986a-4802-48c5-8495-354e568108e7": [
    {
      text: "Google now gives every Business Profile its own review link and downloadable QR code, under Read reviews > Get more reviews (QR code from a computer browser only).",
      sources: [
        { label: "Google Business Profile Help", url: "https://support.google.com/business/answer/16816815" },
      ],
    },
  ],
  // Google Maps marketing: The quality of your reviews matters as much as the quantity
  "9355a379-8106-468c-8ef3-37fd8d41e0fc": [
    {
      text: "31% of consumers will only use a business rated 4.5 stars or higher (up from 17% a year earlier), and 68% need at least four stars. 47% won't use a business with fewer than 20 reviews.",
      sources: [
        { label: "BrightLocal Local Consumer Review Survey 2026 (1,002 US adults, Feb 2026)", url: "https://www.brightlocal.com/learn/local-consumer-review-survey/" },
      ],
    },
  ],
  // Google Maps marketing: Old reviews won’t keep you on Google Maps: Always be chasing new reviews for recency
  "812ec860-ed03-4b6b-883c-0de5ac044f21": [
    {
      text: "74% of consumers only consider reviews from the last three months, and 18% are only swayed by reviews from the last week.",
      sources: [
        { label: "BrightLocal Local Consumer Review Survey 2026 (1,002 US adults, Feb 2026)", url: "https://www.brightlocal.com/learn/local-consumer-review-survey/" },
      ],
    },
  ],
  // Google Maps marketing: Don't fake reviews; AI systems are becoming more advanced at detecting them and it will hurt you in the long run
  "d71b1682-3039-43c7-bd5d-4ec86912620d": [
    {
      text: "Google blocked or removed over 292 million policy-breaking reviews and over 13 million fake Business Profiles in 2025.",
      sources: [
        { label: "Google, Apr 2026, via Search Engine Roundtable", url: "https://www.seroundtable.com/google-maps-spam-fighting-2025-41176.html" },
      ],
    },
    {
      text: "97% of consumers think businesses caught faking reviews should be punished.",
      sources: [
        { label: "BrightLocal Local Consumer Review Survey 2026 (1,002 US adults, Feb 2026)", url: "https://www.brightlocal.com/learn/local-consumer-review-survey/" },
      ],
    },
  ],
  // Google Maps marketing: Don't incentivise customers with rewards to leave positive reviews
  "35b09456-5cc0-46b6-94a6-0eea93ffbe78": [
    {
      text: "UK law: since 6 April 2025 (DMCC Act) it's illegal to post or commission a review that hides an incentive, with CMA fines of up to 10% of global turnover.",
      sources: [
        { label: "CMS Law, Apr 2025", url: "https://cms.law/en/gbr/legal-updates/no-more-faux-five-stars-the-dmcc-act-bans-fake-reviews" },
      ],
    },
    {
      text: "Google also bans offering discounts or free goods for reviews, and now asks reviewers whether a business offered rewards.",
      sources: [
        { label: "Google Business Profile Help", url: "https://support.google.com/business/answer/16816815" },
        { label: "PPC Land, Jun 2026", url: "https://ppc.land/google-maps-is-now-asking-users-if-businesses-paid-for-their-reviews/" },
      ],
    },
  ],
  // Airbnb listing: Switch on Instant Book and self check-in for an algorithmic boost
  "f0b120db-0545-4566-b020-59fd833d13b9": [
    {
      text: "Airbnb's Instant Book team says more than 60% of Airbnb bookings are made instantly, and hosts using Instant Book often get up to 2x as many bookings.",
      sources: [
        { label: "Airbnb Instant Book team Q&A, Airbnb Community Center (undated)", url: "https://community.withairbnb.com/t5/English-Language-Archive/Answers-to-your-top-Instant-Book-questions/m-p/515653" },
      ],
    },
  ],
  // AIO optimisation: Build your brand, not just your website
  "4f98c28d-63a6-4805-9d7f-40ff963328e8": [
    {
      text: "Branded web mentions had the strongest link to appearing in Google's AI Overviews (correlation 0.664), roughly three times stronger than the number of backlinks (0.218).",
      sources: [
        { label: "Ahrefs, 75,000 brands, May 2025", url: "https://ahrefs.com/blog/ai-overview-brand-correlation/" },
      ],
    },
  ],
  // AIO optimisation: Get on the pages AI keeps quoting
  "4914c846-b16c-43ad-b85f-fb0c2a0432fe": [
    {
      text: "Reddit makes up 46.7% of Perplexity's top-10 cited sources and 21% of Google AI Overviews', while Wikipedia makes up 47.9% of ChatGPT's.",
      sources: [
        { label: "Profound, 680m citations Aug 2024 to Jun 2025", url: "https://www.tryprofound.com/blog/ai-platform-citation-patterns" },
      ],
    },
  ],
  // AIO optimisation: Being mentioned isn't being recommended
  "fa0d4578-f409-4c09-bea7-2520a401c2e4": [
    {
      text: "In a test of nearly 3,000 AI answers, the odds of getting the same list of recommended brands twice were under 1 in 100, but some brands still appeared in 60% to 90% of answers for a given question.",
      sources: [
        { label: "SparkToro & Gumshoe, ~3,000 runs of 12 prompts, Jan 2026", url: "https://searchengineland.com/ai-recommendation-lists-rarely-repeat-study-468076" },
      ],
    },
  ],
  // AIO optimisation: Check the same questions every month
  "4f066a77-6c82-4020-92f2-87649f79dad8": [
    {
      text: "Ask the same question twice and the odds of ChatGPT, Claude or Google's AI giving the same list of recommendations are under 1 in 100, and the same order closer to 1 in 1,000. Track how often you appear, not your position.",
      sources: [
        { label: "SparkToro & Gumshoe, ~3,000 runs of 12 prompts, Jan 2026", url: "https://searchengineland.com/ai-recommendation-lists-rarely-repeat-study-468076" },
      ],
    },
  ],
  // AIO optimisation: Don't judge AI by clicks alone
  "92b4c45c-4f2f-4a15-856c-fd27fc28fff8": [
    {
      text: "When a Google AI summary appears, people click a normal result on 8% of visits versus 15% without one, and click a link inside the summary just 1% of the time.",
      sources: [
        { label: "Pew Research Center, Jul 2025 (900 US adults, 68,879 searches)", url: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/" },
      ],
    },
    {
      text: "The average AI search visitor is worth 4.4x a traditional organic visitor, based on conversion rate.",
      sources: [
        { label: "Semrush, Jul 2025", url: "https://www.semrush.com/blog/ai-search-seo-traffic-study/" },
      ],
    },
  ],
  // AIO optimisation: Start a YouTube channel for your brand or leverage your existing one
  "0a996df1-4bc4-4874-a3b7-4687d00a593e": [
    {
      text: "YouTube makes up 18.8% of Google AI Overviews' top-10 cited sources.",
      sources: [
        { label: "Profound, 680m citations Aug 2024 to Jun 2025", url: "https://www.tryprofound.com/blog/ai-platform-citation-patterns" },
      ],
    },
    {
      text: "94% of UK adults use YouTube, for an average of 51 minutes a day.",
      sources: [
        { label: "Ofcom Online Nation 2025", url: "https://www.ofcom.org.uk/media-use-and-attitudes/online-habits/from-apps-to-ai-search-how-the-uk-goes-online-in-2025" },
      ],
    },
  ],
  // AIO optimisation: Create a subreddit for your brand
  "b924e7c1-1f7a-4b9c-a2ae-6c2da3ec4f76": [
    {
      text: "Reddit makes up 46.7% of Perplexity's top-10 cited sources and 21% of Google AI Overviews'.",
      sources: [
        { label: "Profound, 680m citations Aug 2024 to Jun 2025", url: "https://www.tryprofound.com/blog/ai-platform-citation-patterns" },
      ],
    },
  ],
  // AIO optimisation: Check that your FAQ sections that are hidden in accordions on your website aren't invisible to search and AI crawlers
  "2e3324aa-ad71-4f89-96d6-861d52b920fc": [
    {
      text: "None of the major AI crawlers run JavaScript, so FAQ answers loaded by JavaScript when an accordion opens won't be seen by them.",
      sources: [
        { label: "Vercel, Dec 2024", url: "https://vercel.com/blog/the-rise-of-the-ai-crawler" },
      ],
    },
  ],
  // Technical SEO: Compress any images before publishing them
  "ef7aa020-319d-4865-bb33-d6e3711ef312": [
    {
      text: "Images are the biggest single part of a typical web page: about 911 KB of the median 2.56 MB mobile home page in 2025.",
      sources: [
        { label: "HTTP Archive Web Almanac 2025", url: "https://almanac.httparchive.org/en/2025/page-weight" },
      ],
    },
  ],
  // Technical SEO: Check that your FAQ sections that are hidden in accordions on your website aren't invisible to search and AI crawlers
  "8b85eb96-16b5-479a-aa2a-7acabb7fec99": [
    {
      text: "None of the major AI crawlers run JavaScript, so FAQ answers loaded by JavaScript when an accordion opens won't be seen by them.",
      sources: [
        { label: "Vercel, Dec 2024", url: "https://vercel.com/blog/the-rise-of-the-ai-crawler" },
      ],
    },
  ],
  // Technical SEO: Set up hreflang tags
  "44c14c98-6f81-490f-a248-aba373989c1f": [
    {
      text: "31% of international websites have hreflang errors. 48% of multilingual sites don't use x-default and 16% of hreflang groups are missing self-referencing tags.",
      sources: [
        { label: "SALT.agency/NerdyData study of 18,786 sites, via Search Engine Land", url: "https://searchengineland.com/study-31-of-international-websites-contain-hreflang-errors-395161" },
      ],
    },
  ],
  // Technical SEO: Check your crawl logs
  "09233e8f-c475-43ed-92e8-17fad11ddb48": [
    {
      text: "ChatGPT's and Claude's crawlers hit 404 (page not found) pages on about 35% of their requests, against 8% for Googlebot. Your logs show whether they're wasting visits on broken pages.",
      sources: [
        { label: "Vercel, Dec 2024", url: "https://vercel.com/blog/the-rise-of-the-ai-crawler" },
      ],
    },
  ],
  // Reddit Marketing: Answer questions about your own business on your own site that get asked on Reddit (Control the narrative!)
  "7f50ddc0-3d45-4902-8dd8-5fb8512d5025": [
    {
      text: "More than 1 in 5 shoppers add 'Reddit' to their search queries, and more than half do a final Reddit check before buying. Note: Reddit-commissioned research.",
      sources: [
        { label: "Reddit Path to Purchase 2026 (Attest, 6,485 UK + 13,956 US adults; Reddit-commissioned), via PPC Land", url: "https://ppc.land/half-of-us-shoppers-fact-check-ai-on-reddit-before-buying-survey-finds/" },
      ],
    },
  ],
  // Reddit Marketing: New to Reddit? Don't run a campaign there yet
  "5ad2dc56-4c2e-4504-b063-4b896ca7722c": [
    {
      text: "Reddit was the fastest-growing social platform in the UK: 22.9 million UK adults (48% of those online) visited in May 2024, up 47% in a year.",
      sources: [
        { label: "Ofcom Online Nation 2024, via The Drop", url: "https://www.dropmedia.co.uk/?p=3084" },
      ],
    },
    {
      text: "Globally it had 130 million daily users in Q2 2026, up 18%.",
      sources: [
        { label: "Reddit Q2 2026 results (SEC filing)", url: "https://www.sec.gov/Archives/edgar/data/0001713445/000171344526000098/earningspressreleaseq226.htm" },
      ],
    },
  ],
  // Reddit Marketing: Use Reddit as free customer research
  "31a270e5-8a63-4ec1-8e04-70ab7c0708f7": [
    {
      text: "Over 1 in 3 UK shoppers (and half of US shoppers) check AI product recommendations on Reddit before buying. Note: Reddit-commissioned research.",
      sources: [
        { label: "Reddit Path to Purchase 2026 (Attest, 6,485 UK + 13,956 US adults; Reddit-commissioned), via PPC Land", url: "https://ppc.land/half-of-us-shoppers-fact-check-ai-on-reddit-before-buying-survey-finds/" },
      ],
    },
  ],
  // Reddit Marketing: Ask Reddit Answers what people think of you
  "23baeaea-cb15-4142-9228-3c3c3a025cca": [
    {
      text: "Reddit Answers grew from 1 million to 15 million weekly users between Q1 and Q4 2025, and 80 million people a week use Reddit's search.",
      sources: [
        { label: "Reddit Q4 2025 earnings call, via Dataconomy Feb 2026", url: "https://dataconomy.com/2026/02/06/reddit-search-traffic-jumps-to-80-million-weekly-active-users/" },
      ],
    },
  ],
};

export function getTipStats(tipId: string): TipStat[] {
  return TIP_STATS[tipId] ?? [];
}
