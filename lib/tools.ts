// Free tools listed on the /tools directory, in the sitemap, and as "Free tool" cards under the
// tips they help with (see lib/tool-tips.ts).
// To add a new tool: build it under app/tools/<slug>, then add an entry here (newest first).

export interface Tool {
  slug: string; // the tool lives at /tools/<slug>
  name: string;
  description: string;
}

export const TOOLS: Tool[] = [
  {
    slug: "customer-signup-kit",
    name: "Birthday club sign-up kit",
    description:
      "Collect customers' birthdays and contact details with consent using a free Google Form you own, print QR cards, and see who to contact each month.",
  },
  {
    slug: "crawl-log-analyser",
    name: "Crawl log analyser",
    description:
      "Upload your server access log to see which pages Googlebot and AI crawlers visit, how often, and where they hit errors.",
  },
  {
    slug: "catalogue-page-toolkit",
    name: "Catalogue page toolkit",
    description:
      "Upload your product export to find filter pages with enough stock, and build quick links, gift guides by price and comparison tables.",
  },
  {
    slug: "image-seo-prep",
    name: "Image SEO: rename, compress & alt text",
    description:
      "Batch rename photos to descriptive file names, compress and resize them, check they're big enough for zoom, and write alt text.",
  },
  {
    slug: "social-image-resizer",
    name: "Social image resizer with text overlay",
    description:
      "Resize one photo for link previews, Pinterest, Instagram, TikTok covers and YouTube thumbnails, with padding, text and your logo.",
  },
  {
    slug: "favicon-generator",
    name: "Favicon generator",
    description:
      "Turn your logo into favicon.ico, Apple and Android icons and a web manifest, with the HTML tags to add them.",
  },
  {
    slug: "schema-generator",
    name: "Local business schema generator",
    description:
      "Fill in one form and get ready-to-paste price lists, services, hours, address and map, team and trust sections, with matching schema.",
  },
  {
    slug: "review-request-kit",
    name: "Google review link & request kit",
    description:
      "Make your direct Google review link, ready-to-send review requests, printable QR table cards, and a log of who you've asked.",
  },
  {
    slug: "eli5-robots",
    name: "ELI5 my robots.txt",
    description:
      "Upload or paste your robots.txt and get a plain-English explanation of what it's telling search engines and AI bots, line by line.",
  },
];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
