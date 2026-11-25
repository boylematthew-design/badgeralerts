import ToolLayout, { faq } from "@/components/tools/ToolLayout";
import CatalogueToolkit from "@/components/tools/catalogue-page-toolkit/CatalogueToolkit";

export const metadata = {
  title: "Free ecommerce category page toolkit | Compounding Wins",
  description:
    "Upload your Shopify or WooCommerce product export to find filter pages with enough stock, build quick-link buttons, gift guides by price and comparison tables. Free, runs in your browser.",
  alternates: { canonical: "/tools/catalogue-page-toolkit" },
};

export default function Page() {
  return (
    <ToolLayout
      slug="catalogue-page-toolkit"
      wide
      title={<>Catalogue page <em>toolkit</em></>}
      intro={<>Upload your product export and find out which filter pages deserve to exist, then build quick-link buttons, gift guides by price and comparison tables from your own stock.</>}
      privacyNote="Your product file is read in your browser and never uploaded."
      steps={[
        { title: "Export your products", body: "In Shopify go to Products, then Export. In WooCommerce, Products then Export. Any spreadsheet saved as a CSV with a Title column works too." },
        { title: "Find filter pages worth making", body: "Pick a filter, such as Shape, and optionally a second, such as Stone. The tool counts the products in every combination so you can see which have enough stock for their own page." },
        { title: "Build the page sections", body: "Generate quick-link buttons for the top of a category, 'gifts under £50' lists, and a comparison table for category pages and buying guides." },
        { title: "Check demand before publishing", body: "Stock is only half the test. Check people actually search for the page in Google Search Console or a keyword tool." },
      ]}
      faqs={[
        faq("Should every filter combination have its own page?", "No. Only create a page when there's search demand, enough products to fill it, and it matches what searchers want. Thin pages with two products can hold the rest of your site back."),
        faq("Does it work with Shopify's product export?", "Yes. It groups Shopify's variant rows into products, reads your option names (like Colour and Size), tags and product type, and uses your lowest variant price."),
        faq("Why add comparison tables to category pages?", "Tables help shoppers compare without opening every product, and AI tools often quote structured comparisons when people ask which product to buy."),
        faq("Is my product file uploaded?", "No. It's read in your browser and nothing is sent to my servers."),
      ]}
    >
      <CatalogueToolkit />
    </ToolLayout>
  );
}
