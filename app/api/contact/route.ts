import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { name, email, subject, message, honeypot } = await request.json();

  if (honeypot) {
    return NextResponse.json({ success: true });
  }

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "BadgerAlerts <alerts@badgeralerts.live>",
    to: "hello@badgeralerts.live",
    replyTo: email,
    subject: `Contact form: ${subject}`,
    html: `
      <div style="max-width:520px;margin:0 auto;padding:40px 24px;font-family:sans-serif;">
        <div style="text-align:center;margin-bottom:32px;">
          <span style="font-size:24px;font-weight:900;color:#0f172a;">Badger<span style="color:#10b981;">Alerts</span></span>
        </div>
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:40px 32px;">
          <h2 style="color:#0f172a;font-size:20px;font-weight:800;margin:0 0 24px;">New contact form message</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;font-weight:600;width:100px;">Name</td><td style="padding:8px 0;color:#0f172a;font-size:14px;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;font-weight:600;">Email</td><td style="padding:8px 0;color:#0f172a;font-size:14px;">${email}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;font-size:13px;font-weight:600;">Subject</td><td style="padding:8px 0;color:#0f172a;font-size:14px;">${subject}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin-bottom:24px;">
          <p style="color:#475569;font-size:15px;line-height:1.7;margin:0;white-space:pre-wrap;">${message}</p>
        </div>
        <p style="text-align:center;color:#cbd5e1;font-size:12px;margin-top:24px;">Reply directly to this email to respond to ${name}.</p>
      </div>
    `,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
