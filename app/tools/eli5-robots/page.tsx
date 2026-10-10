import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Eli5Robots from "@/components/tools/eli5-robots/Eli5Robots";

export const metadata = {
  title: "ELI5 My robots.txt | Free Tool | Matthew Boyle",
  description:
    "Upload or paste your robots.txt and get a plain-English explanation of what it's telling search engines and AI bots. Runs entirely in your browser — nothing is uploaded.",
};

export default function Eli5RobotsPage() {
  return (
    <div className="bg-white text-ink">
      <Navbar />

      <main className="max-w-[760px] mx-auto px-7 md:px-12 py-14 md:py-20">
        <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-4">
          Free tool
        </div>
        <h1 className="font-serif font-normal text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.02em] text-ink mb-4">
          ELI5 my <em className="italic text-accent-dark">robots.txt</em>
        </h1>
        <p className="text-[15px] md:text-[16px] text-mid font-light leading-[1.6] max-w-[560px]">
          Upload or paste your robots.txt and get a plain-English explanation of what it&rsquo;s
          telling search engines and AI bots — line by line, no jargon. It all happens in your
          browser; nothing is uploaded anywhere.
        </p>

        <Eli5Robots />
      </main>

      <Footer />
    </div>
  );
}
