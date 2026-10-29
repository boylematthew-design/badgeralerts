import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { TOOLS } from "@/lib/tools";

export const metadata = {
  title: "Free Marketing & SEO Tools | Compounding Wins",
  description:
    "Free digital marketing and SEO tools from Matthew Boyle. Simple, single-purpose tools that run in your browser, with no sign-up needed.",
};

export default function ToolsPage() {
  return (
    <div className="bg-paper text-ink">
      <Navbar />
      <PageHero
        eyebrow="Tools"
        title={<>Free marketing tools,{" "} <em>no sign-up</em></>}
        intro={<>Small, single-purpose tools I&apos;ve built to answer the questions I get asked most. Free to use, with new ones added as I build them.</>}
      />
      <main className="max-w-[760px] mx-auto px-7 md:px-12 py-14 md:py-20">

        <div className="space-y-4">
          {TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group block border border-border rounded-[20px] px-7 md:px-8 py-6 hover:border-accent-dark/40 transition-colors"
            >
              <h2 className="font-heading font-bold tracking-[-0.03em] text-[20px] md:text-[24px] text-ink group-hover:text-accent-dark transition-colors">
                {tool.name}
              </h2>
              <p className="text-[14px] md:text-[15px] text-mid leading-[1.6] mt-2 max-w-[560px]">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
