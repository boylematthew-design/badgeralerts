import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import { getServiceForGuide } from "@/lib/services";

export const metadata = {
  title: "Digital Marketing Expert, Agency & Consultant Services | Compounding Wins",
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
    <div className="bg-paper text-ink">
      <Navbar />
      <PageHero
        eyebrow="Services"
        title={<>Expert marketing services,{" "} <em>done properly</em></>}
        intro={<>Nearly 20 years of hands-on experience as a digital marketing expert and consultant, offered as agency-quality services. Every service is available as a one-off audit or ongoing monthly support.</>}
      />
      <main className="max-w-[760px] mx-auto px-7 md:px-12 py-14 md:py-20">

        {!guides || guides.length === 0 ? (
          <div className="border border-border rounded-[20px] px-8 py-12 text-center mb-16 md:mb-20">
            <p className="text-[15px] text-mid">
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
                  <h2 className="font-heading font-bold tracking-[-0.03em] text-[20px] md:text-[24px] text-ink group-hover:text-accent-dark transition-colors">
                    {service.title} services
                  </h2>
                  <p className="text-[14px] md:text-[15px] text-mid leading-[1.6] mt-2 max-w-[560px]">
                    {service.pitch}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <CtaBand
        title={<>Not sure which service you need?</>}
        body={<>Tell me a bit about your business and I&apos;ll point you in the right direction.</>}
        href="/contact"
        label="Work with me"
      />
      <Footer />
    </div>
  );
}
