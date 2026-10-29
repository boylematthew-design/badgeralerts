import GuidePage, { guideMetadata } from "@/components/GuidePage";

// A guide under a parent, e.g. /blog/local-seo/google-maps-marketing. The guide is found by the
// child slug alone, so if it has been moved to a different parent (or back to top level), the
// old address redirects to the current one.

export async function generateMetadata({ params }: { params: Promise<{ child: string }> }) {
  const { child } = await params;
  return guideMetadata(child);
}

export default async function ChildGuidePage({ params }: { params: Promise<{ slug: string; child: string }> }) {
  const { slug, child } = await params;
  return <GuidePage slug={child} requestedPath={`/blog/${slug}/${child}`} />;
}
