import ToolLayout, { faq } from "@/components/tools/ToolLayout";
import WebsiteChecker from "@/components/tools/website-checker/WebsiteChecker";

export const metadata = {
  title: "Free website checker: what Google & AI crawlers see | Compounding Wins",
  description:
    "Check what Googlebot, ChatGPT, Claude and Perplexity can read on your page without JavaScript, whether robots.txt or a firewall blocks them, plus title, schema, canonical and share preview.",
  alternates: { canonical: "/tools/website-checker" },
};

export default function Page() {
  return (
    <ToolLayout
      slug="website-checker"
      title={<>Website checker: what <em>Google &amp; AI crawlers</em> see</>}
      intro={<>Enter a page and see it the way crawlers do: whether Googlebot, ChatGPT, Claude and Perplexity can get in, what they can read without JavaScript, and the technical basics that stop pages ranking.</>}
      privacyNote="I fetch the page you enter from my server to check it, like a search engine would. I don't store the results."
      steps={[
        { title: "Enter a page", body: "Start with your homepage, then your most important service or product pages." },
        { title: "Check crawler access", body: "If robots.txt or a firewall blocks Googlebot or the AI crawlers, nothing else on the page matters. Fix that first." },
        { title: "Check what's readable", body: "Prices, answers to questions and product details need to be in the HTML as text, not loaded by JavaScript, for AI tools to use them." },
        { title: "Work through the rest", body: "Title, description, canonical, schema and share image. Each finding says what to do." },
      ]}
      faqs={[
        faq("Why does it matter what crawlers see without JavaScript?", "Google can run JavaScript, but slowly and not always. Most AI crawlers, including the ones behind ChatGPT, Claude and Perplexity, don't run it at all, so content added by scripts is invisible to them."),
        faq("My site is blocked by a firewall. What do I do?", "Bot protection from Cloudflare, Wordfence or your host sometimes blocks good crawlers. Look for a setting that allows verified bots, or allow the specific crawlers you want."),
        faq("Should I block GPTBot?", "GPTBot collects content to train OpenAI's models. OAI-SearchBot is what puts you in ChatGPT's search answers. Many businesses allow OAI-SearchBot even if they block GPTBot. Blocking either has no effect on Google."),
        faq("Does this check my whole site?", "It checks one page at a time, plus your robots.txt and sitemap. A whole-site crawl with broken links and a monthly report is coming."),
      ]}
    >
      <WebsiteChecker />
    </ToolLayout>
  );
}
