import ToolLayout, { faq } from "@/components/tools/ToolLayout";
import SchemaGenerator from "@/components/tools/schema-generator/SchemaGenerator";

export const metadata = {
  title: "Free local business schema generator & website blocks | Compounding Wins",
  description:
    "Fill in one form and get ready-to-paste price lists, services, opening hours, address and map, team and trust footer sections, with matching LocalBusiness schema. Free, no sign-up.",
  alternates: { canonical: "/tools/schema-generator" },
};

export default function Page() {
  return (
    <ToolLayout
      slug="schema-generator"
      title={<>Local business <em>schema generator</em></>}
      intro={<>Fill in your details once and get ready-to-paste website sections (prices, services, hours, address and map, team, trust footer) with matching schema that Google and AI tools can read.</>}
      steps={[
        { title: "Fill in your details", body: "Pick your type of business and add your address, hours, services and prices. Skip anything that doesn't apply. It's saved in your browser so you can come back to it." },
        { title: "Add the details people ask about", body: "Brands you fit, call-out fees, accreditations, weekend work. These are the questions customers ask AI tools, and the answers need to be written on your site." },
        { title: "Copy each block", body: "Pick a block, copy the HTML and paste it into your site. Give it your own styling with the class name on each section." },
        { title: "Add the schema and test it", body: "Paste the schema code once on the page, then check it with Google's Rich Results Test." },
      ]}
      faqs={[
        faq("What is schema markup?", "Schema is a small block of code that describes your business in a format search engines and AI tools understand: what you are, where you are, when you're open and what you charge. It doesn't change how the page looks."),
        faq("Where do I paste the schema code?", "In the HTML of the page, ideally the page the details are about. WordPress, Wix, Squarespace and Shopify all have a custom code or HTML block you can use. Only mark up details that are also visible on the page."),
        faq("Should I show fixed prices or 'from' prices?", "Fixed prices wherever you can. People and AI tools compare businesses on price, and a clear price builds trust. Use 'from' prices for jobs that genuinely vary."),
        faq("Which business type should I pick?", "The most specific one that fits, such as Plumber rather than Local business. If nothing fits, Local business is fine."),
        faq("Is my information stored anywhere?", "Only in your own browser so the form is there when you come back. Nothing is sent to my servers."),
      ]}
    >
      <SchemaGenerator />
    </ToolLayout>
  );
}
