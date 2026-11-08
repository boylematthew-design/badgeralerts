// external: true opens the link in a new tab (for other websites).
type FooterLink = { label: string; href: string; external?: boolean };

// Social profiles, shown as logos in both footers. The label is also in the HTML as hidden text,
// so screen readers, search engines and AI tools still read "YouTube" / "LinkedIn".
export const socialLinks = [
  { label: "YouTube", href: "https://www.youtube.com/@compoundingwins", icon: "youtube" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/mattboyle3/", icon: "linkedin" },
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
