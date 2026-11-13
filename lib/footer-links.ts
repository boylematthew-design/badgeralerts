// external: true opens the link in a new tab (for other websites).
type FooterLink = { label: string; href: string; external?: boolean };

// Social and directory profiles, shown as logos in both footers. The label is also in the HTML as
// hidden text, so screen readers, search engines and AI tools still read "YouTube" / "LinkedIn".
// business: true = the profile belongs to Compounding Wins (the business), so lib/business-schema.ts
// lists it in the site's structured data. LinkedIn is Matthew's personal profile, so it goes on him instead.
export const GOOGLE_MAPS_URL = "https://maps.google.com/?cid=15892319881759668593";

export const socialLinks = [
  { label: "YouTube", href: "https://www.youtube.com/@compoundingwins", icon: "youtube", business: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/mattboyle3/", icon: "linkedin", business: false },
  { label: "X", href: "https://x.com/teamcompounding", icon: "x", business: true },
  { label: "Google Maps", href: GOOGLE_MAPS_URL, icon: "maps", business: true },
  { label: "Yell", href: "https://www.yell.com/biz/compounding-wins-london-11066334/", icon: "yell", business: true },
] as const;

export const footerLinks: { heading: string; links: FooterLink[] }[] = [
  {
    heading: "Work with me",
    links: [
      { label: "Services", href: "/services" },
      { label: "Tools", href: "/tools" },
      { label: "Consulting", href: "/consulting" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "About", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];
