import { jsonLd, professionalServiceSchema } from "@/lib/business-schema";

// The contact page is a client component, so its metadata and structured data live here instead.
export const metadata = {
  title: "Contact Compounding Wins: Book a free marketing call",
  description:
    "Get in touch about SEO, local SEO, paid media or AI search. Book a free 30-minute call or send a message, and I'll reply within 1 business day.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(professionalServiceSchema())} />
      {children}
    </>
  );
}
