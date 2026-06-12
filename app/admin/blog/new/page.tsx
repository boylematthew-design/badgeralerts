import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import SubmitButton from "./SubmitButton";

export default function NewGuidePage() {
  async function createGuide(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await supabase.from("users").select("is_admin").eq("id", user.id).single();
    if (!profile?.is_admin) redirect("/dashboard");

    const title = (formData.get("title") as string)?.trim();
    const topicName = (formData.get("topic_name") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const published = formData.get("published") === "on";

    const slug = (formData.get("slug") as string)
      ?.trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!title || !slug || !topicName) return;

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: guide, error } = await admin
      .from("guides")
      .insert({
        title,
        slug,
        topic_name: topicName,
        description: description || null,
        published,
      })
      .select("id")
      .single();

    if (error || !guide) return;

    const { revalidatePath } = await import("next/cache");
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    redirect(`/admin/blog/${guide.id}`);
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/admin/blog" className="text-sm text-slate-400 hover:text-slate-600 transition">
          ← Back to guides
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-3">Create new guide</h1>
        <p className="text-slate-500 text-sm mt-1">
          A guide is a topic (e.g. &ldquo;Google Maps Marketing Guide&rdquo;) that you&apos;ll add tips to over time.
        </p>
      </div>

      <form action={createGuide} className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6 shadow-sm">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Guide title</label>
          <input
            name="title"
            required
            placeholder="e.g. Google Maps Marketing Guide"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            URL slug <span className="text-slate-400 font-normal">(lowercase, hyphens only)</span>
          </label>
          <input
            name="slug"
            required
            placeholder="e.g. google-maps-marketing-guide"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
          />
          <p className="text-xs text-slate-400 mt-1.5">
            This will be the page address: badgeralerts.com/blog/<span className="font-mono">your-slug</span>
          </p>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Topic name <span className="text-slate-400 font-normal">(used in the signup CTA)</span>
          </label>
          <input
            name="topic_name"
            required
            placeholder="e.g. Google Maps marketing"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <p className="text-xs text-slate-400 mt-1.5">
            Shown as: &ldquo;Want more {"{topic name}"} tips and ideas?&rdquo;
          </p>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Description <span className="text-slate-400 font-normal">(shown on the blog index page)</span>
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="A short summary of what this guide covers..."
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="published"
            id="published"
            className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
          />
          <label htmlFor="published" className="text-sm font-bold text-slate-700">
            Publish immediately
          </label>
        </div>
        <p className="text-xs text-slate-400 -mt-4">
          Leave unchecked to save as a draft. You can publish it later once you&apos;ve added some tips.
        </p>

        <SubmitButton />
      </form>
    </div>
  );
}
