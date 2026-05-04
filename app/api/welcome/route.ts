import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const secret = request.headers.get("x-webhook-secret");
  if (secret !== process.env.WELCOME_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const record = payload.record;
  const oldRecord = payload.old_record;

  // Only fire when email_confirmed flips from false to true
  if (!record?.email_confirmed || oldRecord?.email_confirmed === true) {
    return NextResponse.json({ skipped: true });
  }

  // Check welcome_sent to prevent duplicates
  if (record.welcome_sent) {
    return NextResponse.json({ skipped: true });
  }

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Mark as sent immediately to prevent race conditions
  await adminClient
    .from("users")
    .update({ welcome_sent: true })
    .eq("id", record.id);

  const firstName = record.full_name?.split(" ")[0] ?? "there";

  const { error } = await resend.emails.send({
    from: "Matthew at BadgerAlerts <support@badgeralerts.live>",
    to: record.email,
    replyTo: "support@badgeralerts.live",
    subject: "Welcome to BadgerAlerts",
    html: `
      <div style="max-width:560px;margin:0 auto;padding:40px 24px;font-family:sans-serif;color:#334155;line-height:1.7;font-size:15px;">
        <div style="margin-bottom:32px;">
          <span style="font-size:22px;font-weight:900;color:#0f172a;">Badger<span style="color:#10b981;">Alerts</span></span>
        </div>

        <p>Hey ${firstName},</p>

        <p>I'm Matthew — I run BadgerAlerts and I just wanted to drop you a quick note to say welcome.</p>

        <p>I've spent the past 20 years working on my own and other's websites, and over that time I have come across a lot of issues and built up quite a bit of knowledge along the way! I decided to build this tool that scans your website and automatically identifies issues, offers improvements & gives suggestions. </p>

        <p>Each time I, and with a little bit of help from AI!, find something, you'll get an alert sent to your email.</p>

        <p>If you ever have questions, or just want to have a chat about your site, just reply to this email — I read every one.</p>
        
        <p style="margin-top:32px;">Cheers,<br><strong>Matthew</strong><br><span style="color:#94a3b8;font-size:13px;">Founder, BadgerAlerts</span></p>

        <hr style="border:none;border-top:1px solid #e2e8f0;margin:40px 0;">
        <p style="font-size:12px;color:#cbd5e1;text-align:center;">BadgerAlerts &mdash; badgeralerts.live</p>
      </div>
    `,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
