import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LinkedInIcon from "@/components/LinkedInIcon";
import { heroLinkClass } from "@/components/PageHero";
import { TEAM, getTeamMember } from "@/lib/team";
import { guidePath } from "@/lib/blog-guides";

const BASE_URL = "https://www.compoundingwins.com";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// One profile page per person in lib/team.ts; any other /author/... URL is a 404.
export const dynamicParams = false;

// Re-check which guides are published at most once an hour, so new guides get linked without a redeploy.
export const revalidate = 3600;

export function generateStaticParams() {
  return TEAM.map((person) => ({ slug: person.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = getTeamMember(slug);
  if (!person) return { title: "Profile not found | Compounding Wins" };

  return {
    title: `${person.name}, ${person.role.charAt(0).toLowerCase()}${person.role.slice(1)} | Compounding Wins`,
    description: person.intro[0],
    alternates: { canonical: `/author/${person.slug}` },
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = getTeamMember(slug);
  if (!person) notFound();

  // Only link to guides that are live, so the profile never sends people (or Google) to a 404.
  const { data: published } = await supabase
    .from("guides")
    .select("id, slug, parent_id")
    .eq("site", "badgeralerts")
    .eq("published", true);
  const guidePaths = new Map((published ?? []).map((g) => [g.slug, guidePath(g, published ?? [])]));

  // Structured data so Google and AI tools can connect this page, the guides and the LinkedIn
  // profile to the same real person (an expertise/trust signal).
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.role,
    url: `${BASE_URL}/author/${person.slug}`,
    image: `${BASE_URL}${person.photo}`,
    sameAs: [person.linkedin, ...(person.otherProfiles ?? [])],
    knowsAbout: person.experience.map((e) => e.topic),
  };

  return (
    <div className="bg-paper text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema).replace(/</g, "\\u003c") }}
      />
      <Navbar />
      {/* ── Header (dark band) ──────────────────────────────────── */}
      <section className="bg-ink text-paper">
        <div className="max-w-[760px] mx-auto px-7 md:px-12 py-14 md:py-20">
          <Link href="/blog" className={heroLinkClass}>
            ← All guides
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 mt-6">
            <Image
              src={person.photo}
              alt={`Photo of ${person.name}`}
              width={160}
              height={160}
              priority
              className="w-28 h-28 md:w-40 md:h-40 rounded-full object-cover flex-shrink-0"
            />
            <div>
              <div className="text-[11px] font-semibold tracking-[0.08em] text-muted-dark uppercase mb-2">Author profile</div>
              <h1 className="font-heading font-extrabold tracking-[-0.04em] text-[32px] md:text-[48px] leading-[1.06] text-paper mb-2">
                {person.name}
              </h1>
              <p className="text-[15px] md:text-[16px] text-lime font-semibold">{person.role}</p>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-[760px] mx-auto px-7 md:px-12 py-14 md:py-20">

        <div className="space-y-4 text-[15px] md:text-[16px] text-mid leading-[1.7] mb-8 max-w-[620px]">
          {person.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <ContactButtons linkedin={person.linkedin} name={person.name} />

        {/* ── Experience by topic ──────────────────────────────── */}
        <section className="mt-14" aria-labelledby="experience">
          <h2 id="experience" className="font-heading font-extrabold tracking-[-0.04em] text-[24px] md:text-[30px] text-ink mb-6">
            My experience by topic
          </h2>
          <div className="divide-y divide-border border-y border-border">
            {person.experience.map((item) => {
              const href = item.externalUrl ?? (guidePaths.get(item.guide) ?? null);
              return (
                <div key={item.guide} className="py-6">
                  <h3 className="font-heading font-bold tracking-[-0.03em] text-[20px] md:text-[22px] text-ink mb-2">{item.topic}</h3>
                  <p className="text-[15px] text-mid leading-[1.7]">{item.text}</p>
                  {href && (
                    <a
                      href={href}
                      className="inline-block mt-3 text-[14px] font-medium text-accent-dark hover:opacity-80 transition-opacity"
                    >
                      Read my {item.topic} guide &rarr;
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Need help ────────────────────────────────────────── */}
        <section className="border border-border rounded-[20px] px-7 md:px-10 py-8 mt-14" aria-labelledby="need-help">
          <h2 id="need-help" className="font-heading font-extrabold tracking-[-0.04em] text-[24px] md:text-[28px] text-ink mb-3">
            Need help with your marketing?
          </h2>
          <p className="text-[15px] text-mid leading-[1.7] mb-6 max-w-[560px]">
            Whether you need a one-off audit or ongoing support, get in touch and tell me what
            you&apos;re working on. I&apos;ll let you know honestly whether I can help.
          </p>
          <ContactButtons linkedin={person.linkedin} name={person.name} />
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ContactButtons({ linkedin, name }: { linkedin: string; name: string }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Link
        href="/contact"
        className="btn-light inline-flex items-center justify-center px-6 py-3 text-[14px] md:text-[15px]"
      >
        Get in touch &rarr;
      </Link>
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 border border-border-strong text-ink font-semibold px-6 py-3 rounded-[8px] text-[14px] md:text-[15px] hover:border-ink transition-colors"
      >
        <LinkedInIcon size={18} />
        View {name}&apos;s LinkedIn profile
      </a>
    </div>
  );
}
