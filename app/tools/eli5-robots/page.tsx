import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero, { heroLinkClass } from "@/components/PageHero";
import Eli5Robots from "@/components/tools/eli5-robots/Eli5Robots";

export const metadata = {
  title: "ELI5 My robots.txt | Free Tool | Compounding Wins",
  description:
    "Upload or paste your robots.txt and get a plain-English explanation of what it's telling search engines and AI bots. Runs entirely in your browser — nothing is uploaded.",
};

export default function Eli5RobotsPage() {
  return (
    <div className="bg-paper text-ink">
      <Navbar />

      <PageHero
        eyebrow="Free tool"
        title={<>ELI5 my <em>robots.txt</em></>}
        intro={<>Upload or paste your robots.txt and get a plain-English explanation of what it&rsquo;s telling search engines and AI bots — line by line, no jargon. It all happens in your browser; nothing is uploaded anywhere.</>}
        before={<Link href="/blog/technical-seo" className={heroLinkClass}>← Technical SEO guide</Link>}
      />
      <main className="max-w-[760px] mx-auto px-7 md:px-12 py-14 md:py-20">

        <Eli5Robots />
      </main>

      <Footer />
    </div>
  );
}
