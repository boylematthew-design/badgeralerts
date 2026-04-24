import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import SubmitButton from "./SubmitButton";

const CATEGORIES = [
  { value: "seo", label: "SEO" },
  { value: "social", label: "Social Media" },
  { value: "competitors", label: "Competitors" },
  { value: "content", label: "Content Strategy" },
  { value: "paid", label: "Paid Media" },
  { value: "technical", label: "Technical" },
  { value: "general", label: "General" },
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
    const imageFile = formData.get("image") as File | null;

    if (!title || !description) return;

    // Upload image if provided
    let imageUrl: string | null = null;
    if (imageFile && imageFile.size > 0) {
      const adminClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      const ext = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const { error: uploadError } = await adminClient.storage
        .from("post-images")
        .upload(fileName, imageFile, { contentType: imageFile.type });

      if (!uploadError) {
        const { data: urlData } = adminClient.storage
          .from("post-images")
          .getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }
    }

    await supabase.from("posts").insert({
      title,
      description,
      category: category || null,
      image_url: imageUrl,
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

      <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 mb-6 text-sm">
        <p className="font-bold text-slate-700 mb-2">Available shortcodes</p>
        <div className="space-y-1 text-slate-500">
          <p><code className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-emerald-600 font-mono">{"{name}"}</code> — user's full name (e.g. John Smith)</p>
          <p><code className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-emerald-600 font-mono">{"{first_name}"}</code> — first name only (e.g. John)</p>
          <p><code className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-emerald-600 font-mono">{"{website}"}</code> — their website URL (e.g. https://example.com)</p>
        </div>
      </div>

      <form action={createPost} encType="multipart/form-data" className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6 shadow-sm">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Alert title</label>
          <input
            name="title"
            required
            placeholder="e.g. 58 New Keyword Opportunities"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
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
          <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
          <textarea
            name="description"
            required
            rows={5}
            placeholder="Describe what this alert means and why it matters..."
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Image <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-600 hover:file:bg-emerald-100 transition"
          />
          <p className="text-xs text-slate-400 mt-1.5">Recommended: JPG or PNG, under 2MB</p>
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
