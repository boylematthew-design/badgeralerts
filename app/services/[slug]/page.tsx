import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultantCTA from "@/components/ConsultantCTA";
import PageHero, { heroLinkClass } from "@/components/PageHero";
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
  if (!found) return { title: "Service not found | Compounding Wins" };
  const { service } = found;

  return {
    title: `${service.title} Expert, Agency & Consultant Services | Compounding Wins`,
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
    <div className="bg-paper text-ink">
      <Navbar />
      <PageHero
        eyebrow="Service"
        title={<>{service.title} expert, agency and consultant services</>}
        before={<Link href="/services" className={heroLinkClass}>← All services</Link>}
        intro={
          <div className="space-y-4">
            <p>
              Looking to hire a {service.name} expert? I&apos;m Matthew Boyle, a {service.name} consultant
              offering agency-quality {service.name} services without the agency overheads.{" "}
              {service.pitch}
            </p>
            <p>
              Prefer to do it yourself? My free{" "}
              <Link
                href={found.guidePath}
                className="text-lime underline underline-offset-2 hover:opacity-80"
              >
                {service.name} guide
              </Link>{" "}
              walks through the same techniques I use with clients, tip by tip.
            </p>
          </div>
        }
      />
      <main className="max-w-[760px] mx-auto px-7 md:px-12 py-14 md:py-20">
        <WhoWeAre slug={guide.slug} />

        <GuidePricing slug={guide.slug} topicName={service.name} heading={headings.pricing} />

        <GuideFaqs heading={getGuideFaqHeading(guide.slug)} faqs={getGuideFaqs(guide.slug)} />

        <ConsultantCTA />
      </main>
      <Footer />
    </div>
  );
}
