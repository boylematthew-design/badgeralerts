import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getServiceForGuide } from "@/lib/services";

export const metadata = {
  title: "Digital Marketing Expert, Agency & Consultant Services | Matthew Boyle",
  description:
    "Hire a digital marketing expert and consultant. Agency-quality services from Matthew Boyle covering Google Maps marketing, local SEO, technical SEO, AI search, Reddit and more.",
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function ServicesPage() {
  // One service per published blog guide, in the same order as /blog.
  const { data: guides } = await supabase
    .from("guides")
    .select("id, slug, title, topic_name")
    .eq("site", "badgeralerts")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="bg-white text-ink">
      <Navbar />
      <main className="max-w-[760px] mx-auto px-7 md:px-12 py-14 md:py-20">
        <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-4">
          Services
        </div>
        <h1 className="font-serif font-normal text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.02em] text-ink mb-4">
          Expert marketing services,{" "}
          <em className="italic text-accent-dark">done properly</em>
        </h1>
        <p className="text-[15px] md:text-[16px] text-mid font-light leading-[1.6] mb-12 max-w-[560px]">
          Nearly 20 years of hands-on experience as a digital marketing expert and consultant,
          offered as agency-quality services. Every service is available as a one-off audit or
          ongoing monthly support.
        </p>

        {!guides || guides.length === 0 ? (
          <div className="border border-border rounded-[20px] px-8 py-12 text-center mb-16 md:mb-20">
            <p className="text-[15px] text-mid font-light">
              Services are being added. Check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-16 md:mb-20">
            {guides.map((guide) => {
              const service = getServiceForGuide(guide);
              return (
                <Link
                  key={guide.id}
                  href={`/services/${service.slug}`}
                  className="group block border border-border rounded-[20px] px-7 md:px-8 py-6 hover:border-accent-dark/40 transition-colors"
                >
                  <h2 className="font-serif text-[20px] md:text-[24px] text-ink font-normal group-hover:text-accent-dark transition-colors">
                    {service.title} services
                  </h2>
                  <p className="text-[14px] md:text-[15px] text-mid font-light leading-[1.6] mt-2 max-w-[560px]">
                    {service.pitch}
                  </p>
                </Link>
              );
            })}
          </div>
        )}

        <div className="bg-ink rounded-[20px] px-8 md:px-16 py-12 md:py-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_0%,rgba(29,185,115,0.10),transparent_50%)]" />
          <div className="relative">
            <h2 className="font-serif font-normal text-[24px] md:text-[32px] leading-[1.1] tracking-[-0.02em] text-white mb-3">
              Not sure which service you need?
            </h2>
            <p className="text-[14px] text-white/55 font-light mb-7 max-w-md mx-auto">
              Tell me a bit about your business and I&apos;ll point you in the right direction.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-medium px-6 py-3 rounded-[8px] text-[14px] transition-colors"
            >
              Work with me
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
