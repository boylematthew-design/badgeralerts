import ToolLayout, { faq } from "@/components/tools/ToolLayout";
import CompetitorSnapshot from "@/components/tools/competitor-snapshot/CompetitorSnapshot";

export const metadata = {
  title: "Free competitor website & ads snapshot | Compounding Wins",
  description:
    "Compare your website's pages with your competitors' using their sitemaps, find pages you're missing, jump to their Google and Meta ads and reviews, and compare Business Profile services.",
  alternates: { canonical: "/tools/competitor-snapshot" },
};

export default function Page() {
  return (
    <ToolLayout
      slug="competitor-snapshot"
      wide
      title={<>Competitor <em>snapshot</em></>}
      intro={<>See every page your competitors want Google to find, spot the services and locations they cover that you don&apos;t, and jump straight to their ads, reviews and Reddit mentions.</>}
      privacyNote="We read competitors' public sitemaps from our server. The names you enter are saved in your browser only."
      steps={[
        { title: "Add your site and competitors", body: "Use the businesses that show above you on Google Maps and in search for your main service." },
        { title: "Compare pages", body: "See how many pages each site has and which sections are biggest, such as /services/ or /areas/." },
        { title: "Find the gaps", body: "Review the pages they have that you might not. Service and location pages are usually the quickest wins." },
        { title: "Check their ads and reviews", body: "Use the links to see their Google and Facebook ads, Maps reviews, Checkatrade profile and Reddit mentions." },
      ]}
      faqs={[
        faq("What is a sitemap?", "A list of the pages a website wants search engines to index, usually at /sitemap.xml. It's public, so it's a quick way to see how a competitor has structured their site."),
        faq("Why can't it read a competitor's site?", "Some sites have no sitemap, and some block automated requests. You can still use the ads, reviews and Reddit links."),
        faq("Is it OK to look at competitors' ads?", "Yes. Google's Ads Transparency Center and Meta's Ad Library are public on purpose, so anyone can see what a business is advertising."),
        faq("Should I copy their pages?", "No. Use the gaps as ideas, then make your page more useful: real prices, photos of your own work, and answers to the questions customers ask."),
      ]}
    >
      <CompetitorSnapshot />
    </ToolLayout>
  );
}
