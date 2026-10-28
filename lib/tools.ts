// Free tools listed on the /tools directory and in the sitemap.
// To add a new tool: build it under app/tools/<slug>, then add an entry here (newest first).

export interface Tool {
  slug: string; // the tool lives at /tools/<slug>
  name: string;
  description: string;
}

export const TOOLS: Tool[] = [
  {
    slug: "eli5-robots",
    name: "ELI5 my robots.txt",
    description:
      "Upload or paste your robots.txt and get a plain-English explanation of what it's telling search engines and AI bots, line by line.",
  },
];
