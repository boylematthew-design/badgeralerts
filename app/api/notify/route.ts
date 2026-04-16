import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function runNotifications(request: Request) {
  // Accept either Vercel cron (Authorization header) or manual POST (x-notify-secret header)
  const authHeader = request.headers.get("authorization");
  const manualSecret = request.headers.get("x-notify-secret");
  const validCron = authHeader === `Bearer ${process.env.NOTIFY_SECRET}`;
  const validManual = manualSecret === process.env.NOTIFY_SECRET;

  if (!validCron && !validManual) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  // Find all live posts that haven't been emailed yet
  const { data: pendingPosts, error } = await supabase
    .from("user_posts")
    .select(`
      id,
      user_id,
      scheduled_for,
      posts ( id, title, description ),
      users ( email, full_name )
    `)
    .lte("scheduled_for", new Date().toISOString())
    .is("notified_at", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!pendingPosts || pendingPosts.length === 0) {
    return NextResponse.json({ message: "No pending notifications" });
  }

  const results = [];

  for (const item of pendingPosts) {
    const post = Array.isArray(item.posts) ? item.posts[0] : item.posts;
    const user = Array.isArray(item.users) ? item.users[0] : item.users;

    if (!post || !user?.email) continue;

    // Send the email via Resend
    const { error: emailError } = await resend.emails.send({
      from: "BadgerAlerts <noreply@badgeralerts.live>",
      to: user.email,
      subject: post.title,
      html: `
        <div style="max-width:520px;margin:0 auto;padding:40px 24px;font-family:sans-serif;">
          <div style="text-align:center;margin-bottom:32px;">
            <span style="font-size:24px;font-weight:900;color:#0f172a;">Badger<span style="color:#10b981;">Alerts</span></span>
          </div>
          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:40px 32px;">
            <h2 style="color:#0f172a;font-size:22px;font-weight:800;margin:0 0 12px;">You have a new alert</h2>
            <h3 style="color:#10b981;font-size:18px;font-weight:700;margin:0 0 16px;">${post.title}</h3>
            <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 32px;">${post.description}</p>
            <p style="text-align:center;margin:0 0 32px;">
              <a href="https://badgeralerts.live/dashboard" style="background:#10b981;color:#ffffff;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:999px;display:inline-block;font-size:15px;">
                View in dashboard
              </a>
            </p>
            <p style="color:#94a3b8;font-size:13px;margin:0;line-height:1.6;">You're receiving this because you have a BadgerAlerts account.</p>
          </div>
          <p style="text-align:center;color:#cbd5e1;font-size:12px;margin-top:24px;">© 2026 BadgerAlerts. All rights reserved.</p>
        </div>
      `,
    });

    if (!emailError) {
      // Mark as notified so we don't send again
      await supabase
        .from("user_posts")
        .update({ notified_at: new Date().toISOString() })
        .eq("id", item.id);

      results.push({ success: true, email: user.email, post: post.title });
    } else {
      results.push({ success: false, email: user.email, error: emailError.message });
    }
  }

  return NextResponse.json({ results });
}

export async function GET(request: Request) {
  return runNotifications(request);
}

export async function POST(request: Request) {
  return runNotifications(request);
}
