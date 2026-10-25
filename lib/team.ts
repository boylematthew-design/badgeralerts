// Team profiles: used by the "Who we are" block at the top of each blog guide (/blog/[slug])
// and by each person's profile page at /author/[slug].
// To add a new person: add an object to TEAM (photo goes in /public) and they get a profile page
// automatically. Each person can have a short bio per guide slug in `guideBios`; guides without
// one use their `defaultBio`. To show someone only on certain guides, set `guides` to a list of
// slugs (leave it out to show on all).

export interface TopicExperience {
  guide: string; // guide slug on this site — linked from the profile once the guide is published
  topic: string;
  text: string;
  externalUrl?: string; // set when the topic's guide lives on another site
}

export interface TeamProfile {
  slug: string;
  name: string;
  role: string;
  photo: string;
  linkedin: string;
  otherProfiles?: string[]; // this person's profile pages on other sites (tells Google they're the same person)
  intro: string[];
  experience: TopicExperience[];
  defaultBio: string;
  guideBios: Record<string, string>;
  guides?: string[];
}

export const TEAM: TeamProfile[] = [
  {
    slug: "matthew-boyle",
    name: "Matthew Boyle",
    role: "Digital marketing consultant",
    photo: "/matthew-boyle-linkedin.jpg",
    linkedin: "https://www.linkedin.com/in/mattboyle3/",
    intro: [
      "I'm a digital marketing consultant with around 20 years' experience helping businesses get found online and turn that visibility into leads and sales.",
      "My background spans SEO, local search, social platforms, marketplaces and, more recently, AI search. I write the guides on this site from hands-on work, and I offer the same expertise as one-off audits or ongoing monthly support.",
    ],
    experience: [
      {
        guide: "local-seo",
        topic: "Local SEO",
        text: "I've helped local businesses rank higher in their area by fixing their Google Business Profiles, cleaning up citations and building location pages that convert. Local SEO is where a small business can beat much bigger competitors, and it's often the quickest win I see.",
      },
      {
        guide: "google-maps-marketing-guide",
        topic: "Google Maps marketing",
        text: "Maps marketing is a specialism of mine, covering Google Maps, Bing Maps and Apple Maps. I've helped businesses climb into the map pack with better profiles, regular posts and a steady flow of reviews.",
      },
      {
        guide: "technical-seo",
        topic: "Technical SEO",
        text: "I've audited sites of all sizes for crawling, indexing and speed problems that quietly hold back rankings. I turn the findings into a prioritised fix list that a developer can work through, so the biggest problems get fixed first.",
      },
      {
        guide: "aio",
        topic: "AIO and GEO optimisation",
        text: "As search shifts towards AI answers, I help businesses get cited by ChatGPT, Gemini, Perplexity and Google's AI Overviews. That means clear, well-structured content, strong entity signals and mentions on the sites AI tools trust.",
      },
      {
        guide: "ecommerce-seo",
        topic: "Ecommerce SEO",
        text: "I've worked on online stores where category and product pages are the main source of organic revenue. My focus is site structure, product schema and copy that ranks without harming conversion.",
      },
      {
        guide: "reddit-marketing",
        topic: "Reddit marketing",
        text: "Reddit rewards genuine contribution and punishes anything that looks like an advert. I help brands find the right subreddits, take part in a way the community welcomes, and pick up the search visibility Reddit threads now get on Google.",
      },
      {
        guide: "amazon-listing-optimisation",
        topic: "Amazon listing optimisation",
        text: "I've helped sellers improve their Amazon rankings and conversion rates through keyword research, better titles and bullet points, and A+ content that answers buyers' questions before they ask them.",
      },
      {
        guide: "airbnb-listing-optimisation-guide",
        topic: "Airbnb listing optimisation",
        text: "I help hosts rank higher in Airbnb search and win more bookings, using the same principles as any other marketplace: strong photos, clear copy, competitive pricing and great reviews.",
      },
      {
        guide: "youtube-search-optimisation",
        topic: "YouTube search optimisation",
        text: "YouTube is the world's second-biggest search engine. I help channels get found through keyword research, optimised titles and descriptions, chapters and thumbnails that earn the click.",
      },
      {
        guide: "tiktok-search-optimisation",
        topic: "TikTok search optimisation",
        text: "More and more people search on TikTok before Google. I help brands show up in those searches with the right keywords in captions, on-screen text and profiles, plus content built around what people are actually looking for.",
      },
      {
        guide: "instagram-optimisation",
        topic: "Instagram optimisation",
        text: "I help businesses grow their reach on Instagram with optimised profiles, keyword-rich captions, a Reels strategy and consistent engagement with their community.",
      },
      {
        guide: "x-optimisation",
        topic: "X optimisation",
        text: "I help brands and founders grow their reach on X with a clear profile, focused content pillars and an engagement routine that builds an audience over time.",
      },
    ],
    defaultBio:
      "Matthew Boyle is a seasoned digital marketing professional with around 20 years' experience helping businesses grow their traffic, leads and sales.",
    guideBios: {
      "google-maps-marketing-guide":
        "Matthew Boyle is a seasoned professional having helped multiple local businesses gain new leads and business. He has deep Google Maps marketing experience.",
      "reddit-marketing":
        "Matthew Boyle is a seasoned professional having helped brands reach new audiences on Reddit without getting downvoted. He has deep experience in community-led Reddit marketing.",
      "technical-seo":
        "Matthew Boyle is a seasoned professional having helped multiple websites fix crawling, indexing and speed issues that held back their rankings. He has deep technical SEO experience.",
      aio:
        "Matthew Boyle is a seasoned professional having helped businesses get cited in AI answers from ChatGPT, Gemini and Google AI Overviews. He has deep AIO and GEO optimisation experience.",
      "airbnb-listing-optimisation-guide":
        "Matthew Boyle is a seasoned professional having helped hosts rank their Airbnb listings higher and win more bookings. He has deep Airbnb listing optimisation experience.",
      "youtube-search-optimisation":
        "Matthew Boyle is a seasoned professional having helped channels get found and grow their views through YouTube search. He has deep YouTube search optimisation experience.",
      "x-optimisation":
        "Matthew Boyle is a seasoned professional having helped brands and founders grow their reach and engagement on X. He has deep X optimisation experience.",
      "tiktok-search-optimisation":
        "Matthew Boyle is a seasoned professional having helped brands get their videos found in TikTok search. He has deep TikTok search optimisation experience.",
      "instagram-optimisation":
        "Matthew Boyle is a seasoned professional having helped businesses grow their reach and followers on Instagram. He has deep Instagram optimisation experience.",
      "amazon-listing-optimisation":
        "Matthew Boyle is a seasoned professional having helped sellers rank their Amazon products higher and turn more views into sales. He has deep Amazon listing optimisation experience.",
      "local-seo":
        "Matthew Boyle is a seasoned professional having helped multiple local businesses rank higher in their area and gain new leads and business. He has deep local SEO experience.",
      "ecommerce-seo":
        "Matthew Boyle is a seasoned professional having helped online stores grow their organic traffic and revenue. He has deep ecommerce SEO experience.",
    },
  },
];

export function getTeamMember(slug: string) {
  return TEAM.find((person) => person.slug === slug);
}

export function getGuideTeam(slug: string) {
  return TEAM.filter((person) => !person.guides || person.guides.includes(slug)).map((person) => ({
    ...person,
    bio: person.guideBios[slug] ?? person.defaultBio,
  }));
}
