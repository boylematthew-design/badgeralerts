// Structured data (schema.org JSON-LD) for the whole site, in one place. Every entity has a fixed
// @id, and other entities point at it with { "@id": ... }, so Google reads the site as one
// connected graph: the Organization, the ProfessionalService (its local listing), the Person who
// founded it, the WebSite, and each guide (Article).
//
// Where each block is output:
//   siteSchema()                -> every page (app/layout.tsx): Organization, WebSite, Person (short)
//   professionalServiceSchema() -> homepage and contact page only
//   personSchema()              -> author page (full Person)
//   guideSchema()               -> every guide and sub-guide (components/GuidePage.tsx): Article + BreadcrumbList
//
// Only put facts here that match the Google Business Profile exactly. It is a service-area
// business: never add the street address, postcode or map coordinates (geo).
// Profile links and the phone number come from lib/footer-links.ts, so the footer, the contact page
// and the schema can never disagree.

import { BUSINESS_PHONE, GOOGLE_MAPS_URL, socialLinks } from "./footer-links";
import { getTeamMember, type TeamProfile } from "./team";

export const BASE_URL = "https://www.compoundingwins.com";

export const ORGANIZATION_ID = `${BASE_URL}/#organization`;
export const BUSINESS_ID = `${BASE_URL}/#business`;
export const WEBSITE_ID = `${BASE_URL}/#website`;
const LOGO_ID = `${BASE_URL}/#logo`;
const FOUNDER_SLUG = "matthew-boyle";
export const personSchemaId = (slug: string) => `${BASE_URL}/#${slug}`;
export const FOUNDER_ID = personSchemaId(FOUNDER_SLUG);
const FOUNDER_JOB_TITLE = "Digital Marketing Consultant";

// Square logo made from app/icon.svg (Google needs at least 112x112px).
const logo = {
  "@type": "ImageObject",
  "@id": LOGO_ID,
  url: `${BASE_URL}/logo.png`,
  contentUrl: `${BASE_URL}/logo.png`,
  width: 512,
  height: 512,
  caption: "Compounding Wins",
};

// Profiles that belong to the business. Matthew's personal LinkedIn is deliberately not here: it
// goes on his Person instead (see `business` in lib/footer-links.ts).
const businessProfiles = socialLinks.filter((l) => l.business).map((l) => l.href);

// Safe to drop into <script type="application/ld+json">: escapes "<" so text can't close the tag.
export function jsonLd(data: object) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}

// Every page.
export function siteSchema() {
  const founder = getTeamMember(FOUNDER_SLUG);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: "Compounding Wins",
        url: `${BASE_URL}/`,
        logo,
        image: { "@id": LOGO_ID },
        sameAs: businessProfiles,
        founder: { "@id": FOUNDER_ID },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: `${BASE_URL}/`,
        name: "Compounding Wins",
        inLanguage: "en-GB",
        publisher: { "@id": ORGANIZATION_ID },
      },
      // Short version so the @id references (e.g. a guide's author) resolve on every page, including
      // the LinkedIn sameAs. The full Person is on the author page.
      ...(founder
        ? [
            {
              "@type": "Person",
              "@id": FOUNDER_ID,
              name: founder.name,
              jobTitle: FOUNDER_JOB_TITLE,
              url: authorUrl(founder.slug),
              image: `${BASE_URL}${founder.photo}`,
              sameAs: [founder.linkedin],
              worksFor: { "@id": ORGANIZATION_ID },
            },
          ]
        : []),
    ],
  };
}

// Homepage and contact page only.
export function professionalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": BUSINESS_ID,
    name: "Compounding Wins",
    url: `${BASE_URL}/`,
    logo,
    image: `${BASE_URL}/opengraph-image.png`,
    description:
      "Digital marketing consulting, guides and tools from Compounding Wins: SEO, local SEO, social, content and paid media strategy.",
    telephone: BUSINESS_PHONE.display,
    priceRange: "£500–£1,500",
    address: { "@type": "PostalAddress", addressLocality: "London", addressCountry: "GB" },
    hasMap: GOOGLE_MAPS_URL,
    // Matches the Google Business Profile service areas, plus the UK for remote work.
    areaServed: [
      { "@type": "City", name: "London" },
      { "@type": "City", name: "Croydon" },
      { "@type": "Place", name: "Lewisham, London" },
      { "@type": "Country", name: "United Kingdom" },
    ],
    sameAs: businessProfiles,
    parentOrganization: { "@id": ORGANIZATION_ID },
    founder: { "@id": FOUNDER_ID },
  };
}

const authorUrl = (slug: string) => `${BASE_URL}/author/${slug}`;

// The author page: the full Person. Only the current business as employer, nothing else.
export function personSchema(person: TeamProfile) {
  const isFounder = person.slug === FOUNDER_SLUG;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personSchemaId(person.slug),
    name: person.name,
    jobTitle: isFounder ? FOUNDER_JOB_TITLE : person.role,
    url: authorUrl(person.slug),
    image: `${BASE_URL}${person.photo}`,
    sameAs: [person.linkedin],
    worksFor: { "@id": ORGANIZATION_ID },
    knowsAbout: person.experience.map((e) => e.topic),
  };
}

// Every guide and sub-guide: the Article plus its breadcrumb trail.
export function guideSchema(guide: {
  url: string; // canonical URL
  headline: string; // the page H1
  description?: string | null; // the meta description
  datePublished: string; // ISO 8601
  dateModified: string; // ISO 8601, the same value as "Last updated" on the page
  crumbs: { name: string; url: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${guide.url}#article`,
        headline: guide.headline,
        ...(guide.description && { description: guide.description }),
        image: `${BASE_URL}/opengraph-image.png`,
        author: { "@id": FOUNDER_ID },
        publisher: { "@id": ORGANIZATION_ID },
        mainEntityOfPage: guide.url,
        inLanguage: "en-GB",
        datePublished: guide.datePublished,
        dateModified: guide.dateModified,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${guide.url}#breadcrumb`,
        itemListElement: guide.crumbs.map((crumb, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: crumb.name,
          item: crumb.url,
        })),
      },
    ],
  };
}
