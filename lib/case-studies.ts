// Client case studies shown on the services pages (/services/[slug]). Each one lists the service
// slugs it appears on, so adding a slug to `services` is all it takes to show it on another page.

export interface CaseStudyImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
}

export interface CaseStudySection {
  heading: string;
  paragraphs: string[];
  image?: CaseStudyImage;
}

export interface CaseStudy {
  id: string;
  client: string;
  shortName: string; // used in "Visit Gallows Pole"
  summary: string; // one line under the client name in the closed accordion
  website: string;
  services: string[];
  intro: string[];
  sections: CaseStudySection[];
}

const IMG = "/case-studies/gallows-pole";

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "gallows-pole",
    client: "Gallows Pole London Art Hanging Services",
    shortName: "Gallows Pole",
    summary: "Top of the map pack for “art hanging in London” and ChatGPT’s first recommendation.",
    website: "https://www.gallowspole.co.uk",
    services: ["local-seo", "google-maps-marketing"],
    intro: [
      "Gallows Pole is a specialist picture and art hanging business based in London, founded by Cahlain Healy and officially launched in October 2024. It brings museum-standard art hanging and exhibition installation to homes, galleries and businesses across Central and Greater London, from single paintings and mirrors to full gallery walls, feature walls and exhibition builds. I started working with Gallows Pole in 2025, with one goal: make sure that when someone in London needs art hung properly, they find Gallows Pole first.",
    ],
    sections: [
      {
        heading: "Building a strong online presence",
        paragraphs: [
          "The first job was laying the foundations. We made the website SEO-friendly, with clear pages for each service, such as home art hanging, picture hanging, mirror hanging and exhibition installation, each written around what London customers actually search for. Prices and common questions went on the site where anyone could read them. Alongside the website, we got the social media profiles live and listed the brand on trusted directory sites, with the same name, address and phone number everywhere, so Google and customers saw one consistent, credible business.",
        ],
        image: {
          src: `${IMG}/branded-search.webp`,
          alt: "Google results for “Gallows pole art hanging” showing the Gallows Pole website with sitelinks, its Instagram and Yell listings, and its Google Business Profile panel",
          width: 1600,
          height: 1008,
          caption: "A search for the brand returns the website, sitelinks, social profiles, directory listings and the Google Business Profile.",
        },
      },
      {
        heading: "Working on a strong review profile",
        paragraphs: [
          "Reviews are what turn a search into an enquiry, so we built asking for them into every job. Once a hang was finished, Cahlain asked the customer if they’d be happy to leave a genuine, fair review, and to add photos of the finished work if they felt comfortable. No incentives, no review blitzes, just a steady stream of honest feedback from real customers. The result is a perfect 5.0 rating on Google, with reviews that praise the professionalism, tidiness and quality of the work, often with photos of the finished artwork on the wall.",
        ],
        image: {
          src: `${IMG}/google-reviews.webp`,
          alt: "Gallows Pole’s Google reviews: a 5.0 star rating, with a five-star review praising Cahlain as professional and tidy, plus two photos of hung artwork",
          width: 1339,
          height: 1174,
          caption: "A 5.0 rating on Google, with customers adding photos of the finished hang.",
        },
      },
      {
        heading: "Getting listed in the map pack",
        paragraphs: [
          "For a local service business, the Google map pack is huge. It’s the first thing people see when they search for something like “art hanging in London” or “picture hanging London”. We made sure the Google Business Profile was complete and accurate, with the right services, opening hours, contact details and service area across London, and that it matched the website. Today, Gallows Pole appears at the top of the local results for “art hanging in London”, above established competitors with far more reviews.",
        ],
        image: {
          src: `${IMG}/map-pack.webp`,
          alt: "Google local results for “art hanging in London” with Gallows Pole London Art Hanging Services listed first, above Saatchi Gallery, Seido Art Services and Gilbert Art Services",
          width: 1600,
          height: 971,
          caption: "Gallows Pole at the top of the local results for “art hanging in London”.",
        },
      },
      {
        heading: "Helping AI tools recommend Gallows Pole",
        paragraphs: [
          "More and more people now ask AI tools like ChatGPT for recommendations instead of searching Google. AI tools can only recommend businesses they understand, so we made sure the website and listings clearly answered the questions customers ask: what Gallows Pole does, who it’s for, where it works, what it costs and how it handles valuable artwork. That groundwork is paying off. When someone asks ChatGPT for a professional, insured art hanging service for their London home, Gallows Pole is now the first business it recommends, with its speciality, insurance and starting price all quoted back to the customer.",
        ],
        image: {
          src: `${IMG}/chatgpt-recommendation.webp`,
          alt: "ChatGPT answering a request for an insured art hanging service in London by recommending Gallows Pole first, quoting its £10 million public liability insurance and prices from £150",
          width: 1600,
          height: 977,
          caption: "ChatGPT recommends Gallows Pole first, quoting its speciality, insurance and starting price.",
        },
      },
      {
        heading: "The result",
        paragraphs: [
          "We won’t share the exact figures, but the outcome has been a clear increase in enquiries, which has led to jobs across London and strong reviews left after each one. Every new review, listing and mention builds on the last, giving Gallows Pole a solid base for steady, compounding leads well into the future.",
        ],
        image: {
          src: `${IMG}/website.webp`,
          alt: "The Gallows Pole website homepage: “A Picture & Art hanging service in London” over a gilt-framed painting",
          width: 1600,
          height: 820,
          caption: "The Gallows Pole website at gallowspole.co.uk.",
        },
      },
    ],
  },
];

export function getCaseStudiesForService(serviceSlug: string): CaseStudy[] {
  return CASE_STUDIES.filter((c) => c.services.includes(serviceSlug));
}
