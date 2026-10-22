// Team profiles shown in the "Who we are" block at the top of each blog guide (/blog/[slug]).
// To add a new person: add an object to TEAM (photo goes in /public). Each person can have a
// bio per guide slug in `guideBios`; guides without one use their `defaultBio`.
// To show someone only on certain guides, set `guides` to a list of slugs (leave it out to show on all).

export interface TeamProfile {
  name: string;
  photo: string;
  linkedin: string;
  defaultBio: string;
  guideBios: Record<string, string>;
  guides?: string[];
}

export const TEAM: TeamProfile[] = [
  {
    name: "Matthew Boyle",
    photo: "/matthew-boyle-linkedin.jpg",
    linkedin: "https://www.linkedin.com/in/mattboyle3/",
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

export function getGuideTeam(slug: string) {
  return TEAM.filter((person) => !person.guides || person.guides.includes(slug)).map((person) => ({
    ...person,
    bio: person.guideBios[slug] ?? person.defaultBio,
  }));
}
