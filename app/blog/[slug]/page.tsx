import GuidePage, { guideMetadata } from "@/components/GuidePage";

// A top-level guide, e.g. /blog/local-seo. If the slug belongs to a guide that now sits under a
// parent (or is an old slug), GuidePage redirects to its current address.

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return guideMetadata(slug);
}

export default async function TopLevelGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GuidePage slug={slug} requestedPath={`/blog/${slug}`} />;
}
