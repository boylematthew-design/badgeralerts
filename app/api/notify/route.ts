import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { replacePlaceholders } from "@/lib/placeholders";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function runNotifications(request: Request) {
  // Accept either Vercel cron (Authorization header) or manual POST (x-notify-secret header)
  const authHeader = request.headers.get("authorization");
  const manualSecret = request.headers.get("x-notify-secret");
  const validCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const validManual = manualSecret === process.env.NOTIFY_SECRET;

  if (!validCron && !validManual) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  // Find all live posts that haven't been emailed yet
  const { data: pendingPosts, error } = await supabase
    .from("user_posts")
    .select(`id, user_id, scheduled_for, posts ( id, title, description )`)
    .lte("scheduled_for", new Date().toISOString())
    .is("notified_at", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!pendingPosts || pendingPosts.length === 0) {
    return NextResponse.json({ message: "No pending notifications" });
  }

  // Fetch user profiles separately
  const userIds = [...new Set(pendingPosts.map((p) => p.user_id))];
  const { data: usersData } = await supabase
    .from("users")
    .select("id, email, full_name, website, email_unsubscribed, unsubscribe_token")
    .in("id", userIds);

  const usersMap = Object.fromEntries((usersData ?? []).map((u) => [u.id, u]));

  const results = [];

  for (const item of pendingPosts) {
    const post = Array.isArray(item.posts) ? item.posts[0] : item.posts;
    const user = usersMap[item.user_id];

    if (!post || !user?.email || user.email_unsubscribed) continue;

    const firstName = user.full_name?.split(" ")[0] ?? "there";
    const userProfile = { full_name: user.full_name, website: user.website };
    const postTitle = replacePlaceholders(post.title, userProfile);

    // Send the email via Resend
    const { error: emailError } = await resend.emails.send({
      from: "BadgerAlerts <alerts@badgeralerts.live>",
      to: user.email,
      subject: postTitle,
      html: `
        <div style="max-width:520px;margin:0 auto;padding:40px 24px;font-family:sans-serif;">
          <div style="text-align:center;margin-bottom:32px;">
            <span style="font-size:24px;font-weight:900;color:#0f172a;">Badger<span style="color:#10b981;">Alerts</span></span>
          </div>
          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:40px 32px;">
            <p style="color:#0f172a;font-size:16px;margin:0 0 20px;">Hi ${firstName},</p>
            <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 12px;">A new alert has landed in your dashboard:</p>
            <h2 style="color:#0f172a;font-size:20px;font-weight:800;margin:0 0 24px;">${post.title}</h2>
            <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 32px;">To view the alert in detail and take action, please login to your dashboard to proceed.</p>
            <p style="text-align:center;margin:0 0 32px;">
              <a href="https://badgeralerts.live/dashboard" style="background:#10b981;color:#ffffff;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:999px;display:inline-block;font-size:15px;">
                View in Dashboard
              </a>
            </p>
            <p style="color:#475569;font-size:15px;line-height:1.6;margin:0;">Many thanks,<br><strong>BadgerAlerts</strong></p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
            <p style="color:#94a3b8;font-size:13px;margin:0;line-height:1.6;">This is an automated alert from BadgerAlerts. You are receiving this email because you have an active account.<br><br>Don't want to receive alerts anymore? <a href="https://badgeralerts.live/unsubscribe?token=${user.unsubscribe_token}" style="color:#10b981;text-decoration:underline;">Unsubscribe here</a> and we'll stop sending you alerts.</p>
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
