import ToolLayout, { faq } from "@/components/tools/ToolLayout";
import CrawlLogAnalyser from "@/components/tools/crawl-log-analyser/CrawlLogAnalyser";

export const metadata = {
  title: "Free crawl log analyser for Googlebot & AI crawlers | Compounding Wins",
  description:
    "Upload your server access log to see which pages Googlebot, GPTBot, ClaudeBot and PerplexityBot visit, how often, and where they hit errors or redirects. Runs in your browser.",
  alternates: { canonical: "/tools/crawl-log-analyser" },
};

export default function Page() {
  return (
    <ToolLayout
      slug="crawl-log-analyser"
      wide
      title={<>Crawl log analyser <em>for Google &amp; AI bots</em></>}
      intro={<>Upload your server access log to see which pages Googlebot and the AI crawlers (GPTBot, ClaudeBot, PerplexityBot and more) visit, how often, and where they hit errors or redirects.</>}
      privacyNote="Your log file is read in your browser and never uploaded. Logs contain visitors' IP addresses, so this matters."
      steps={[
        { title: "Download your access log", body: "Most hosts offer it in the control panel (cPanel: Metrics, then Raw Access; Plesk: Logs). Look for access.log or a .gz file. Wix, Squarespace and Shopify don't give access logs." },
        { title: "Drop it in", body: "Add several days' files at once for a fuller picture. Compressed .gz files are fine." },
        { title: "Check what each crawler sees", body: "Are your important pages being visited? Are AI crawlers turning up at all? Which pages return errors or redirects to bots?" },
        { title: "Fix and re-check", body: "Fix broken pages, shorten redirect chains, and make sure robots.txt and your firewall aren't blocking crawlers you want. Then check again in a few weeks." },
      ]}
      faqs={[
        faq("What is crawl log analysis?", "Your server logs every request, including visits from search engine and AI crawlers. Analysing those lines shows exactly which pages crawlers fetch and what response they get, which no other tool can show you for certain."),
        faq("Why aren't AI crawlers visiting my site?", "The usual causes are a robots.txt rule blocking them, or a firewall or bot-protection setting (Cloudflare, Wordfence and some hosts) blocking them by default. Check both."),
        faq("Which log formats work?", "The standard Apache and Nginx 'combined' log format, which most hosts use. Plain text and .gz compressed files both work."),
        faq("Is my log uploaded anywhere?", "No. Logs contain visitors' IP addresses, which are personal data, so the file is read entirely in your browser and never leaves your computer."),
      ]}
    >
      <CrawlLogAnalyser />
    </ToolLayout>
  );
}
