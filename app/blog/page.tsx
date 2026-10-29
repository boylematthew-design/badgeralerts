import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchPublishedGuides, groupGuides, guidePath, tipCount } from "@/lib/blog-guides";

export const metadata = {
  title: "Marketing Guides | Matthew Boyle",
  description:
    "Free, regularly updated digital marketing guides covering Google Maps, Reddit, SEO, and more — packed with practical tips.",
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function BlogIndexPage() {
  const guides = await fetchPublishedGuides(supabase);
  const groups = groupGuides(guides);

  return (
    <div className="bg-white text-ink">
      <Navbar />
      <main className="max-w-[760px] mx-auto px-7 md:px-12 py-14 md:py-20">
        <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-4">Guides</div>
        <h1 className="font-serif font-normal text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.02em] text-ink mb-4">
          Marketing guides, updated{" "}
          <em className="italic text-accent-dark">as we learn</em>
        </h1>
        <p className="text-[15px] md:text-[16px] text-mid font-light leading-[1.6] mb-12 max-w-[560px]">
          A handful of in-depth guides, each made up of practical tips added regularly. No fluff —
          just things you can action today.
        </p>

        {groups.length === 0 ? (
          <div className="border border-border rounded-[20px] px-8 py-12 text-center">
            <p className="text-[15px] text-mid font-light">
              No guides published yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((guide) => {
              const count = tipCount(guide);
              return (
                <div
                  key={guide.id}
                  className="border border-border rounded-[20px] hover:border-accent-dark/40 transition-colors"
                >
                  <Link href={guidePath(guide, guides)} className="group block px-7 md:px-8 py-6">
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="font-serif text-[20px] md:text-[24px] text-ink font-normal group-hover:text-accent-dark transition-colors">
                        {guide.title}
                      </h2>
                      <span className="text-[12px] text-muted font-light flex-shrink-0">
                        {count} tip{count !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {guide.description && (
                      <p className="text-[14px] md:text-[15px] text-mid font-light leading-[1.6] mt-2 max-w-[560px]">
                        {guide.description}
                      </p>
                    )}
                  </Link>
                  {guide.children.length > 0 && (
                    <ul className="border-t border-border mx-7 md:mx-8 py-3">
                      {guide.children.map((child) => {
                        const childCount = tipCount(child);
                        return (
                          <li key={child.id}>
                            <Link
                              href={guidePath(child, guides)}
                              className="group flex items-center justify-between gap-4 py-2"
                            >
                              <h3 className="font-serif text-[16px] md:text-[18px] text-ink font-normal group-hover:text-accent-dark transition-colors">
                                <span aria-hidden="true" className="text-muted mr-2">↳</span>
                                {child.title}
                              </h3>
                              <span className="text-[12px] text-muted font-light flex-shrink-0">
                                {childCount} tip{childCount !== 1 ? "s" : ""}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
