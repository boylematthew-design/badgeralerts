import { redirect, notFound } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import { getInitials } from "@/lib/initials";
import DashboardFooter from "@/components/DashboardFooter";
import UserMenu from "@/components/UserMenu";
import { replacePlaceholders } from "@/lib/placeholders";

async function getPostForUser(postId: string) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { user: null, post: null, profile: null };

  const { data: profile } = await supabase
    .from("users")
    .select("full_name, website")
    .eq("id", user.id)
    .single();

  // Verify the user is actually assigned this post — security check
  const { data } = await supabase
    .from("user_posts")
    .select(`
      posts (
        id,
        title,
        description,
        image_url,
        section_why,
        section_fix,
        section_help
      )
    `)
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .lte("scheduled_for", new Date().toISOString())
    .single();

  type PostType = {
    id: string;
    title: string;
    description: string;
    image_url: string | null;
    section_why: string | null;
    section_fix: string | null;
    section_help: string | null;
  };

  const rawPost = data?.posts;
  const post = (Array.isArray(rawPost) ? rawPost[0] : rawPost) as PostType | null;

  return { user, post, profile };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, post, profile } = await getPostForUser(id);

  if (!user) redirect("/login");
  if (!post) notFound();

  const initials = getInitials(profile?.full_name, user.email);
  const replace = (text: string) => replacePlaceholders(text, profile ?? {});

  return (
    <div className="min-h-screen flex" style={{ background: "#eff4fb" }}>
      <Suspense fallback={null}>
        <Sidebar name={profile?.full_name ?? undefined} website={profile?.website ?? undefined} />
      </Suspense>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-10 py-4 md:py-0 md:h-[88px] flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition font-semibold text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to notifications
          </Link>
          <UserMenu initials={initials} />
        </header>

        {/* Article */}
        <section className="px-4 md:px-10 py-8 md:py-12 flex-1 pb-24 md:pb-12">
          <div className="max-w-2xl mx-auto">

            {/* Title block */}
            <div className="mb-10">
              {post.image_url && (
                <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full object-cover"
                  />
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                {replace(post.title)}
              </h1>
              <h2 className="text-lg text-slate-500 leading-relaxed">
                {replace(post.description)}
              </h2>
            </div>

            {/* Sections */}
            <div className="space-y-10">
              {post.section_why && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
                  <h3 className="text-xl font-extrabold text-slate-900 mb-3">Why this is important</h3>
                  <p className="text-slate-600 leading-relaxed">{replace(post.section_why)}</p>
                </div>
              )}

              {post.section_fix && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
                  <h3 className="text-xl font-extrabold text-slate-900 mb-3">How to fix it</h3>
                  <p className="text-slate-600 leading-relaxed">{replace(post.section_fix)}</p>
                </div>
              )}

              {post.section_help && (
                <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-6 md:p-8">
                  <h3 className="text-xl font-extrabold text-slate-900 mb-3">If you need help</h3>
                  <p className="text-slate-600 leading-relaxed">{replace(post.section_help)}</p>
                </div>
              )}
            </div>

          </div>
        </section>

        <DashboardFooter />
      </div>
    </div>
  );
}
