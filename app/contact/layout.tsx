import { jsonLd, professionalServiceSchema } from "@/lib/business-schema";

// The contact page is a client component, so its metadata and structured data live here instead.
export const metadata = {
  title: "Contact | Compounding Wins",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(professionalServiceSchema())} />
      {children}
    </>
  );
}
