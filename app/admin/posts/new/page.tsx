import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

const CATEGORIES = [
  { value: "seo", label: "SEO" },
  { value: "social", label: "Social Media" },
  { value: "competitors", label: "Competitors" },
  { value: "content", label: "Content Strategy" },
  { value: "paid", label: "Paid Media" },
  { value: "technical", label: "Technical" },
];

export default function NewPostPage() {
  async function createPost(formData: FormData) {
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
    const description = (formData.get("description") as string)?.trim();
    const category = formData.get("category") as string;

    if (!title || !description) return;

    await supabase.from("posts").insert({
      title,
      description,
      category: category || null,
    });

    redirect("/admin");
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/admin" className="text-sm text-slate-400 hover:text-slate-600 transition">
          ← Back to alerts
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-3">Create new alert</h1>
        <p className="text-slate-500 text-sm mt-1">This will be stored and ready to assign to users.</p>
      </div>

      <form action={createPost} className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6 shadow-sm">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Alert title
          </label>
          <input
            name="title"
            required
            placeholder="e.g. 58 New Keyword Opportunities"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Category
          </label>
          <select
            name="category"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            required
            rows={5}
            placeholder="Describe what this alert means and why it matters..."
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm transition"
        >
          Create alert
        </button>
      </form>
    </div>
  );
}
