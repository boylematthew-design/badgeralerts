// external: true opens the link in a new tab (for other websites, like social profiles).
type FooterLink = { label: string; href: string; external?: boolean };

export const YOUTUBE_URL = "https://www.youtube.com/@compoundingwins";

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
      { label: "Contact", href: "/contact" },
      { label: "YouTube", href: YOUTUBE_URL, external: true },
    ],
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
