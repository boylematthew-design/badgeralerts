// Free tools listed on the /tools directory, in the sitemap, and as "Free tool" cards under the
// tips they help with (see lib/tool-tips.ts).
// To add a new tool: build it under app/tools/<slug>, then add an entry here (newest first).

export interface Tool {
  slug: string; // the tool lives at /tools/<slug>
  name: string;
  description: string;
  // Date the tool last changed (YYYY-MM-DD). Bump it whenever you change the tool so the
  // sitemap tells Google the page is worth re-crawling. Only bump for real changes.
  updated: string;
}

export const TOOLS: Tool[] = [
  {
    slug: "competitor-snapshot",
    updated: "2026-11-25",
    name: "Competitor snapshot",
    description:
      "Compare your pages with competitors' sitemaps, find pages you're missing, and jump to their ads, reviews and Reddit mentions.",
  },
  {
    slug: "question-finder",
    updated: "2026-11-20",
    name: "Question & topic finder",
    description:
      "Type a problem or product and find the questions and long, specific searches people type into Google and YouTube in the UK.",
  },
  {
    slug: "website-checker",
    updated: "2026-11-25",
    name: "Website checker: what Google & AI crawlers see",
    description:
      "See whether Googlebot, ChatGPT, Claude and Perplexity can reach your page, what they can read without JavaScript, and the technical basics.",
  },
  {
    slug: "customer-signup-kit",
    updated: "2026-11-25",
    name: "Birthday club sign-up kit",
    description:
      "Collect customers' birthdays and contact details with consent using a free Google Form you own, print QR cards, and see who to contact each month.",
  },
  {
    slug: "crawl-log-analyser",
    updated: "2026-11-20",
    name: "Crawl log analyser",
    description:
      "Upload your server access log to see which pages Googlebot and AI crawlers visit, how often, and where they hit errors.",
  },
  {
    slug: "catalogue-page-toolkit",
    updated: "2026-11-25",
    name: "Catalogue page toolkit",
    description:
      "Upload your product export to find filter pages with enough stock, and build quick links, gift guides by price and comparison tables.",
  },
  {
    slug: "image-seo-prep",
    updated: "2026-11-20",
    name: "Image SEO: rename, compress & alt text",
    description:
      "Batch rename photos to descriptive file names, compress and resize them, check they're big enough for zoom, and write alt text.",
  },
  {
    slug: "social-image-resizer",
    updated: "2026-11-20",
    name: "Social image resizer with text overlay",
    description:
      "Resize one photo for link previews, Pinterest, Instagram, TikTok covers and YouTube thumbnails, with padding, text and your logo.",
  },
  {
    slug: "favicon-generator",
    updated: "2026-11-20",
    name: "Favicon generator",
    description:
      "Turn your logo into favicon.ico, Apple and Android icons and a web manifest, with the HTML tags to add them.",
  },
  {
    slug: "schema-generator",
    updated: "2026-11-25",
    name: "Local business schema generator",
    description:
      "Fill in one form and get ready-to-paste price lists, services, hours, address and map, team and trust sections, with matching schema.",
  },
  {
    slug: "review-request-kit",
    updated: "2026-11-25",
    name: "Google review link & request kit",
    description:
      "Make your direct Google review link, ready-to-send review requests, printable QR table cards, and a log of who you've asked.",
  },
  {
    slug: "eli5-robots",
    updated: "2026-10-30",
    name: "ELI5 my robots.txt",
    description:
      "Upload or paste your robots.txt and get a plain-English explanation of what it's telling search engines and AI bots, line by line.",
  },
];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
