import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import SubmitButton from "../../new/SubmitButton";

const CATEGORIES = [
  { value: "seo", label: "SEO" },
  { value: "social", label: "Social Media" },
  { value: "competitors", label: "Competitors" },
  { value: "content", label: "Content Strategy" },
  { value: "paid", label: "Paid Media" },
  { value: "technical", label: "Technical" },
  { value: "general", label: "General" },
];

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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

  const { data: post } = await supabase
    .from("posts")
    .select("id, title, subtitle, description, category, image_url, section_why, section_fix, section_help")
    .eq("id", id)
    .single();

  if (!post) notFound();

  async function updatePost(formData: FormData) {
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
    const subtitle = (formData.get("subtitle") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const category = formData.get("category") as string;
    const imageFile = formData.get("image") as File | null;

    if (!title) return;

    let imageUrl: string | null = formData.get("existing_image_url") as string || null;

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

    await supabase.from("posts").update({
      title,
      subtitle: subtitle || null,
      description: description || null,
      category: category || null,
      image_url: imageUrl,
    }).eq("id", id);

    redirect("/admin");
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/admin" className="text-sm text-slate-400 hover:text-slate-600 transition">
          ← Back to alerts
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-3">Edit alert</h1>
        <p className="text-slate-500 text-sm mt-1">Changes will update immediately for all assigned users.</p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 mb-6 text-sm">
        <p className="font-bold text-slate-700 mb-2">Available shortcodes</p>
        <div className="space-y-1 text-slate-500">
          <p><code className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-emerald-600 font-mono">{"{name}"}</code> — user's full name</p>
          <p><code className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-emerald-600 font-mono">{"{first_name}"}</code> — first name only</p>
          <p><code className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-emerald-600 font-mono">{"{website}"}</code> — their website URL</p>
        </div>
      </div>

      <form action={updatePost} encType="multipart/form-data" className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6 shadow-sm">
        <input type="hidden" name="existing_image_url" value={post.image_url ?? ""} />

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Alert title</label>
          <input
            name="title"
            required
            defaultValue={post.title}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
          <select
            name="category"
            defaultValue={post.category ?? ""}
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
            Subtitle <span className="text-slate-400 font-normal">(shown on dashboard card)</span>
          </label>
          <input
            name="subtitle"
            defaultValue={post.subtitle ?? ""}
            placeholder="e.g. Your site is losing rankings due to slow load times"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Body <span className="text-slate-400 font-normal">(shown on alert detail page only)</span>
          </label>
          <textarea
            name="description"
            rows={5}
            defaultValue={post.description ?? ""}
            placeholder="Full explanation of the alert..."
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Image <span className="text-slate-400 font-normal">(optional — upload a new one to replace)</span>
          </label>
          {post.image_url && (
            <img src={post.image_url} alt="Current image" className="w-full rounded-xl mb-3 border border-slate-200" />
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-600 hover:file:bg-emerald-100 transition"
          />
          <p className="text-xs text-slate-400 mt-1.5">Leave blank to keep the existing image</p>
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
