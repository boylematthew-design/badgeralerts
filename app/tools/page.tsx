import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TOOLS } from "@/lib/tools";

export const metadata = {
  title: "Free Marketing & SEO Tools | Matthew Boyle",
  description:
    "Free digital marketing and SEO tools from Matthew Boyle. Simple, single-purpose tools that run in your browser, with no sign-up needed.",
};

export default function ToolsPage() {
  return (
    <div className="bg-white text-ink">
      <Navbar />
      <main className="max-w-[760px] mx-auto px-7 md:px-12 py-14 md:py-20">
        <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-4">Tools</div>
        <h1 className="font-serif font-normal text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.02em] text-ink mb-4">
          Free marketing tools,{" "}
          <em className="italic text-accent-dark">no sign-up</em>
        </h1>
        <p className="text-[15px] md:text-[16px] text-mid font-light leading-[1.6] mb-12 max-w-[560px]">
          Small, single-purpose tools I&apos;ve built to answer the questions I get asked most. Free to
          use, with new ones added as I build them.
        </p>

        <div className="space-y-4">
          {TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group block border border-border rounded-[20px] px-7 md:px-8 py-6 hover:border-accent-dark/40 transition-colors"
            >
              <h2 className="font-serif text-[20px] md:text-[24px] text-ink font-normal group-hover:text-accent-dark transition-colors">
                {tool.name}
              </h2>
              <p className="text-[14px] md:text-[15px] text-mid font-light leading-[1.6] mt-2 max-w-[560px]">
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
