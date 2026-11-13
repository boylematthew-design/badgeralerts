import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import SubmitButton from "./SubmitButton";
import TipNewsFields from "../../TipNewsFields";
import { parseTipNews } from "@/lib/tip-news";
import TipStatsFields from "../../TipStatsFields";
import TipToolsFields from "../../TipToolsFields";
import TipHelpFields from "../../TipHelpFields";
import { parseTipHelp } from "@/lib/tip-help";
import TipContentField from "../../TipContentField";
import { normalizeTipContent } from "@/lib/tip-content";
import { parseTipStats } from "@/lib/tip-stats";
import { parseTipTools } from "@/lib/tip-tools";
import { parseTipImages, tipImagesOf } from "@/lib/tip-image";
import TipCaseStudyFields from "../../TipCaseStudyFields";
import { caseStudyOptions, parseTipCaseStudies } from "@/lib/case-studies";
import TipLinksFields from "../../TipLinksFields";
import { parseTipLinks, saveTipLinks } from "@/lib/tip-links";
import TipImagesField from "../../TipImagesField";

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

  const [{ data: guide }, { data: tip }, { data: sections }, { data: tipLinks }] = await Promise.all([
    supabaseAdmin.from("guides").select("id, title").eq("id", id).single(),
    supabaseAdmin.from("tips").select("*").eq("id", tipId).single(),
    supabaseAdmin.from("tip_sections").select("id, title").eq("guide_id", id).order("sort_order", { ascending: true }),
    supabaseAdmin.from("tip_links").select("url, context, preview_title, preview_description, preview_favicon").eq("tip_id", tipId).order("sort_order", { ascending: true }),
  ]);

  if (!guide || !tip) redirect(`/admin/blog/${id}`);

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
    const content = normalizeTipContent((formData.get("content") as string) ?? "");
    const published = formData.get("published") === "on";
    const sectionId = (formData.get("section_id") as string) || null;

    if (!title) return;

    const news = parseTipNews(formData);
    if (!news) return;

    const stats = parseTipStats(formData);
    if (!stats) return;

    const tools = parseTipTools(formData);
    if (!tools) return;

    const help = parseTipHelp(formData);
    if (!help) return;

    const images = parseTipImages(formData);
    if (!images) return;

    const links = parseTipLinks(formData);
    if (!links) return;

    const caseStudies = parseTipCaseStudies(formData);
    if (!caseStudies) return;

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    await admin
      .from("tips")
      .update({
        title,
        content: content || null,
        images,
        // Clear the old single-image columns, so removing every image can't bring the old one back.
        image_url: null,
        image_alt: null,
        image_caption: null,
        section_id: sectionId,
        published,
        ...news,
        stats,
        tools,
        case_studies: caseStudies,
        ...help,
      })
      .eq("id", tipId);

    await saveTipLinks(admin, tipId, links);

    await admin.from("guides").update({ updated_at: new Date().toISOString() }).eq("id", id);

    const { revalidatePath } = await import("next/cache");
    revalidatePath(`/admin/blog/${id}`);
    revalidatePath("/blog", "layout");

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

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Tip title</label>
          <input
            name="title"
            required
            defaultValue={tip.title}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {sections && sections.length > 0 && (
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Section <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <select
              name="section_id"
              defaultValue={tip.section_id || ""}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="">Unsectioned</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
            <p className="text-xs text-slate-400 mt-1.5">Group this tip under a section heading on the public page.</p>
          </div>
        )}

        <TipContentField initial={tip.content || ""} />

        <TipNewsFields date={tip.news_date} headline={tip.news_headline} url={tip.news_url} />

        <TipStatsFields initial={tip.stats} />

        <TipToolsFields initial={tip.tools} />

        <TipLinksFields initial={tipLinks ?? []} />

        <TipCaseStudyFields options={caseStudyOptions()} initial={tip.case_studies} />

        <TipHelpFields enabled={tip.help_enabled} text={tip.help_text} />

        <TipImagesField initial={tipImagesOf(tip)} />

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
