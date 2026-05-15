import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function LogoMark() {
  return (
    <div className="w-8 h-8 flex-shrink-0" aria-hidden="true">
      <svg viewBox="0 0 32 32" width="32" height="32">
        <defs>
          <clipPath id="ba-unsub-clip">
            <rect width="32" height="32" rx="9" />
          </clipPath>
        </defs>
        <g clipPath="url(#ba-unsub-clip)">
          <rect width="32" height="32" rx="9" fill="#111110" />
          <g fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
            <path d="M7 25 A 8 8 0 0 1 15 17" />
            <path d="M7 25 A 13 13 0 0 1 20 12" opacity="0.55" />
            <path d="M7 25 A 18 18 0 0 1 25 7" opacity="0.3" />
          </g>
          <circle cx="7" cy="25" r="2.4" fill="#1DB973" />
        </g>
      </svg>
    </div>
  );
}

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
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="flex items-center px-7 md:px-8 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-[15px] font-medium tracking-[-0.025em] text-ink">
            badger<span className="text-accent">alerts</span>
          </span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="bg-white border border-border rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] w-full max-w-[440px] px-8 py-12 text-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5 ${success ? "bg-accent" : "bg-[#FEECEC]"}`}>
            {success ? (
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-[#A32D2D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h1 className="font-serif font-normal text-[22px] text-ink mb-3">
            {success ? "You're unsubscribed" : "Something went wrong"}
          </h1>
          <p className="text-[14px] text-mid font-light leading-[1.6] mb-8">{message}</p>
          <Link
            href="/"
            className="text-[14px] text-accent-dark font-medium hover:underline underline-offset-2"
          >
            Return to BadgerAlerts
          </Link>
        </div>
      </main>
    </div>
  );
}
