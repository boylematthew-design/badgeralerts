// Site-wide structured data (schema.org JSON-LD), added to every page by app/layout.tsx.
// It tells Google and AI tools that this website, the Google Maps listing, Yell, YouTube and X
// all belong to one business, Compounding Wins, founded by Matthew Boyle. That consistency is a
// local SEO and trust signal.
//
// Only put facts here that match the Google Business Profile exactly. It is a service-area
// business: never add the street address or map coordinates (geo), as they would reveal the location.
// Profile links come from lib/footer-links.ts, so adding a profile there updates this too.

import { GOOGLE_MAPS_URL, socialLinks } from "./footer-links";
import { TEAM } from "./team";

export const BASE_URL = "https://www.compoundingwins.com";
const BUSINESS_ID = `${BASE_URL}/#business`;
const FOUNDER_SLUG = "matthew-boyle";
export const personSchemaId = (slug: string) => `${BASE_URL}/author/${slug}#person`;

export function businessSchema() {
  const founder = TEAM.find((p) => p.slug === FOUNDER_SLUG);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": BUSINESS_ID,
        name: "Compounding Wins",
        url: BASE_URL,
        logo: `${BASE_URL}/apple-icon.png`,
        image: `${BASE_URL}/opengraph-image.png`,
        description:
          "Digital marketing consulting, guides and tools from Compounding Wins: SEO, local SEO, social, content and paid media strategy.",
        address: { "@type": "PostalAddress", addressLocality: "London", addressCountry: "GB" },
        hasMap: GOOGLE_MAPS_URL,
        // Matches the Google Business Profile service areas, plus the UK for remote work.
        areaServed: [
          { "@type": "City", name: "London" },
          { "@type": "City", name: "Croydon" },
          { "@type": "Place", name: "Lewisham, London" },
          { "@type": "Country", name: "United Kingdom" },
        ],
        sameAs: socialLinks.filter((l) => l.business).map((l) => l.href),
        ...(founder && { founder: { "@id": personSchemaId(founder.slug) } }),
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: BASE_URL,
        name: "Compounding Wins",
        inLanguage: "en-GB",
        publisher: { "@id": BUSINESS_ID },
      },
      ...(founder
        ? [
            {
              "@type": "Person",
              "@id": personSchemaId(founder.slug),
              name: founder.name,
              url: `${BASE_URL}/author/${founder.slug}`,
              sameAs: [founder.linkedin, ...(founder.otherProfiles ?? [])],
              worksFor: { "@id": BUSINESS_ID },
            },
          ]
        : []),
    ],
  };
}
