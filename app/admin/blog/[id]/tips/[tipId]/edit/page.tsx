import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import SubmitButton from "./SubmitButton";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function EditTipPage({
  params,
}: {
  params: Promise<{ id: string; tipId: string }>;
}) {
  const { id, tipId } = await params;

  const [{ data: guide }, { data: tip }] = await Promise.all([
    supabaseAdmin.from("guides").select("id, title, slug").eq("id", id).single(),
    supabaseAdmin.from("tips").select("*").eq("id", tipId).single(),
  ]);

  if (!guide || !tip) redirect(`/admin/blog/${id}`);
  const guideSlug = guide.slug;

  async function updateTip(formData: FormData) {
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
    const content = (formData.get("content") as string)?.trim();
    const published = formData.get("published") === "on";
    const imageFile = formData.get("image") as File | null;

    if (!title) return;

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let imageUrl: string | null = formData.get("existing_image_url") as string || null;

    if (imageFile && imageFile.size > 0) {
      const ext = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const { error: uploadError } = await admin.storage
        .from("blog-images")
        .upload(fileName, imageFile, { contentType: imageFile.type });

      if (!uploadError) {
        const { data: urlData } = admin.storage.from("blog-images").getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }
    }

    await admin
      .from("tips")
      .update({
        title,
        content: content || null,
        image_url: imageUrl,
        published,
      })
      .eq("id", tipId);

    await admin.from("guides").update({ updated_at: new Date().toISOString() }).eq("id", id);

    const { revalidatePath } = await import("next/cache");
    revalidatePath(`/admin/blog/${id}`);
    revalidatePath("/blog");
    revalidatePath(`/blog/${guideSlug}`);

    redirect(`/admin/blog/${id}`);
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href={`/admin/blog/${id}`} className="text-sm text-slate-400 hover:text-slate-600 transition">
          ← Back to {guide.title}
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-3">Edit tip</h1>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 mb-6 text-sm">
        <p className="font-bold text-slate-700 mb-2">Formatting (Markdown)</p>
        <div className="space-y-1 text-slate-500">
          <p><code className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-emerald-600 font-mono">**bold**</code> for bold text</p>
          <p><code className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-emerald-600 font-mono">## Heading</code> for a subheading</p>
          <p><code className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-emerald-600 font-mono">- item</code> for a bullet list</p>
          <p><code className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-emerald-600 font-mono">[text](https://...)</code> for a link</p>
        </div>
      </div>

      <form action={updateTip} encType="multipart/form-data" className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6 shadow-sm">
        <input type="hidden" name="existing_image_url" value={tip.image_url ?? ""} />

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Tip title</label>
          <input
            name="title"
            required
            defaultValue={tip.title}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Content</label>
          <textarea
            name="content"
            rows={10}
            defaultValue={tip.content || ""}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Image <span className="text-slate-400 font-normal">(optional — upload a new one to replace)</span>
          </label>
          {tip.image_url && (
            <img src={tip.image_url} alt="Current image" className="w-full rounded-xl mb-3 border border-slate-200" />
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-600 hover:file:bg-emerald-100 transition"
          />
          <p className="text-xs text-slate-400 mt-1.5">Leave blank to keep the existing image</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="published"
            id="published"
            defaultChecked={tip.published}
            className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
          />
          <label htmlFor="published" className="text-sm font-bold text-slate-700">
            Published
          </label>
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
