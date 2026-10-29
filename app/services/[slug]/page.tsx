import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultantCTA from "@/components/ConsultantCTA";
import GuidePricing from "@/components/GuidePricing";
import WhoWeAre from "@/components/WhoWeAre";
import GuideFaqs from "@/components/GuideFaqs";
import { getGuideHeadings } from "@/lib/guide-headings";
import { getGuideFaqHeading, getGuideFaqs } from "@/lib/guide-faqs";
import { GUIDE_PRICES } from "@/lib/guide-pricing";
import { getServiceForGuide } from "@/lib/services";
import { guidePath } from "@/lib/blog-guides";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Services pages are derived from published guides, so find the guide whose service slug matches.
async function findService(serviceSlug: string) {
  const { data: guides } = await supabase
    .from("guides")
    .select("id, slug, parent_id, title, topic_name")
    .eq("site", "badgeralerts")
    .eq("published", true);

  const guide = (guides ?? []).find((g) => getServiceForGuide(g).slug === serviceSlug);
  if (!guide) return null;
  return { guide, service: getServiceForGuide(guide), guidePath: guidePath(guide, guides ?? []) };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await findService(slug);
  if (!found) return { title: "Service not found | Matthew Boyle" };
  const { service } = found;

  return {
    title: `${service.title} Expert, Agency & Consultant Services | Matthew Boyle`,
    description: `Hire a ${service.name} expert and consultant. Agency-quality ${service.name} services from Matthew Boyle: a one-off audit for ${GUIDE_PRICES.audit} or hands-on monthly support for ${GUIDE_PRICES.monthly}.`,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await findService(slug);
  if (!found) notFound();
  const { guide, service } = found;

  const headings = getGuideHeadings(guide.slug, service.name);

  return (
    <div className="bg-white text-ink">
      <Navbar />
      <main className="max-w-[760px] mx-auto px-7 md:px-12 py-14 md:py-20">
        <Link href="/services" className="text-[13px] text-muted hover:text-accent-dark transition-colors">
          ← All services
        </Link>

        <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-4 mt-6">Service</div>
        <h1 className="font-serif font-normal text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.02em] text-ink mb-5">
          {service.title} expert, agency and consultant services
        </h1>
        <div className="text-[15px] md:text-[16px] text-mid font-light leading-[1.7] mb-12 max-w-[600px] space-y-4">
          <p>
            Looking to hire a {service.name} expert? I&apos;m Matthew Boyle, a {service.name} consultant
            offering agency-quality {service.name} services without the agency overheads.{" "}
            {service.pitch}
          </p>
          <p>
            Prefer to do it yourself? My free{" "}
            <Link
              href={found.guidePath}
              className="text-accent-dark underline underline-offset-2 hover:opacity-80"
            >
              {service.name} guide
            </Link>{" "}
            walks through the same techniques I use with clients, tip by tip.
          </p>
        </div>

        <WhoWeAre slug={guide.slug} />

        <GuidePricing slug={guide.slug} topicName={service.name} heading={headings.pricing} />

        <GuideFaqs heading={getGuideFaqHeading(guide.slug)} faqs={getGuideFaqs(guide.slug)} />

        <ConsultantCTA />
      </main>
      <Footer />
    </div>
  );
}
