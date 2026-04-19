import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return <Result success={false} message="This unsubscribe link is invalid. Please contact us if you need help." />;
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("id, email_unsubscribed")
    .eq("unsubscribe_token", token)
    .single();

  if (error || !user) {
    return <Result success={false} message="We couldn't find your account. Please contact us if you need help." />;
  }

  if (!user.email_unsubscribed) {
    await supabase
      .from("users")
      .update({ email_unsubscribed: true })
      .eq("unsubscribe_token", token);
  }

  return <Result success={true} message="You've been unsubscribed. You won't receive any more alerts from BadgerAlerts." />;
}

function Result({ success, message }: { success: boolean; message: string }) {
  return (
    <div style={{ background: "#eff4fb", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", padding: "24px" }}>
      <div style={{ maxWidth: "480px", width: "100%", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "24px", padding: "48px 40px", textAlign: "center" }}>
        <div style={{ marginBottom: "24px" }}>
          <span style={{ fontSize: "24px", fontWeight: 900, color: "#0f172a" }}>
            Badger<span style={{ color: "#10b981" }}>Alerts</span>
          </span>
        </div>
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>
          {success ? "✓" : "✗"}
        </div>
        <h1 style={{ color: "#0f172a", fontSize: "20px", fontWeight: 800, margin: "0 0 12px" }}>
          {success ? "You're unsubscribed" : "Something went wrong"}
        </h1>
        <p style={{ color: "#475569", fontSize: "15px", lineHeight: 1.6, margin: "0 0 32px" }}>
          {message}
        </p>
        <Link
          href="https://badgeralerts.live"
          style={{ color: "#10b981", fontSize: "14px", textDecoration: "underline" }}
        >
          Return to BadgerAlerts
        </Link>
      </div>
    </div>
  );
}
