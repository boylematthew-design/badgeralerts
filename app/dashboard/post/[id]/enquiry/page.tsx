import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import DashboardFooter from "@/components/DashboardFooter";
import UserMenu from "@/components/UserMenu";
import { getInitials } from "@/lib/initials";
import { Resend } from "resend";
import SubmitEnquiryButton from "./SubmitEnquiryButton";

export default async function EnquiryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sent?: string }>;
}) {
  const { id } = await params;
  const { sent } = await searchParams;

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("full_name, website")
    .eq("id", user.id)
    .single();

  // Verify the user is assigned this post
  const { data } = await supabase
    .from("user_posts")
    .select("posts ( id, title )")
    .eq("user_id", user.id)
    .eq("post_id", id)
    .lte("scheduled_for", new Date().toISOString())
    .single();

  type PostRef = { id: string; title: string };
  const rawPost = data?.posts;
  const post = (Array.isArray(rawPost) ? rawPost[0] : rawPost) as PostRef | null;

  if (!post) notFound();

  const initials = getInitials(profile?.full_name, user.email);

  async function submitEnquiry(formData: FormData) {
    "use server";
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await supabase
      .from("users")
      .select("full_name, email, website")
      .eq("id", user.id)
      .single();

    const { data: postData } = await supabase
      .from("posts")
      .select("title")
      .eq("id", id)
      .single();

    const message = (formData.get("message") as string)?.trim();
    if (!message) redirect(`/dashboard/post/${id}/enquiry`);

    await supabase.from("enquiries").insert({
      user_id: user.id,
      post_id: id,
      message,
    });

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "BadgerAlerts <alerts@badgeralerts.live>",
      to: "support@badgeralerts.live",
      replyTo: profile?.email ?? user.email!,
      subject: `New expert enquiry: ${postData?.title ?? "Unknown alert"}`,
      html: `
        <div style="max-width:520px;margin:0 auto;padding:40px 24px;font-family:sans-serif;">
          <div style="text-align:center;margin-bottom:32px;">
            <span style="font-size:24px;font-weight:900;color:#0f172a;">Badger<span style="color:#10b981;">Alerts</span></span>
          </div>
          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:40px 32px;">
            <h2 style="color:#0f172a;font-size:20px;font-weight:800;margin:0 0 24px;">New expert enquiry</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
              <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;font-weight:600;width:100px;">User</td><td style="padding:8px 0;color:#0f172a;font-size:14px;">${profile?.full_name ?? "Unknown"}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;font-weight:600;">Email</td><td style="padding:8px 0;color:#0f172a;font-size:14px;">${profile?.email ?? user.email}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;font-weight:600;">Website</td><td style="padding:8px 0;color:#0f172a;font-size:14px;">${profile?.website ?? "—"}</td></tr>
              <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;font-weight:600;">Alert</td><td style="padding:8px 0;color:#0f172a;font-size:14px;">${postData?.title ?? "Unknown"}</td></tr>
            </table>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin-bottom:24px;">
            <p style="color:#475569;font-size:15px;line-height:1.7;margin:0;white-space:pre-wrap;">${message}</p>
          </div>
          <p style="text-align:center;color:#cbd5e1;font-size:12px;margin-top:24px;">Reply directly to this email to respond to ${profile?.full_name ?? "the user"}.</p>
        </div>
      `,
    });

    redirect(`/dashboard/post/${id}/enquiry?sent=1`);
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#eff4fb" }}>
      <Suspense fallback={null}>
        <Sidebar name={profile?.full_name ?? undefined} website={profile?.website ?? undefined} />
      </Suspense>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-4 md:px-10 py-4 md:py-0 md:h-[88px] flex items-center justify-between">
          <Link
            href={`/dashboard/post/${id}`}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition font-semibold text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to alert
          </Link>
          <UserMenu initials={initials} />
        </header>

        <section className="px-4 md:px-10 py-8 md:py-12 flex-1 pb-24 md:pb-12">
          <div className="max-w-xl mx-auto">

            {sent ? (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Enquiry sent!</h2>
                <p className="text-slate-500 mb-6">One of our experts will be in touch with you soon.</p>
                <Link
                  href="/dashboard"
                  className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition"
                >
                  Back to dashboard
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">Talk to an expert</h1>
                  <p className="text-slate-500">You're asking about: <span className="font-semibold text-slate-700">{post.title}</span></p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
                  <form action={submitEnquiry} className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">What do you need help with?</label>
                      <textarea
                        name="message"
                        required
                        rows={6}
                        placeholder="Describe what you'd like help with and we'll get back to you..."
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                      />
                    </div>
                    <SubmitEnquiryButton />
                  </form>
                </div>
              </>
            )}
          </div>
        </section>

        <DashboardFooter />
      </div>
    </div>
  );
}
