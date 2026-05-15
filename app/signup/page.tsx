import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import SignupForm from "@/components/SignupForm";

function LogoMark() {
  return (
    <div className="w-8 h-8 flex-shrink-0" aria-hidden="true">
      <svg viewBox="0 0 32 32" width="32" height="32">
        <defs>
          <clipPath id="ba-onb-clip">
            <rect width="32" height="32" rx="9" />
          </clipPath>
        </defs>
        <g clipPath="url(#ba-onb-clip)">
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

interface SignupPageProps {
  searchParams: Promise<{ url?: string }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  const { url } = await searchParams;
  const initialUrl = url ? decodeURIComponent(url) : "";

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Simple header — not the full sticky Navbar */}
      <header className="flex items-center justify-between px-7 md:px-8 py-5 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-[15px] font-medium tracking-[-0.025em] text-ink">
            badger<span className="text-accent">alerts</span>
          </span>
        </Link>
        <Link
          href="/"
          className="text-[14px] text-mid hover:text-ink transition-colors"
        >
          ← Back to home
        </Link>
      </header>

      {/* Centered card */}
      <main className="flex-1 flex items-start justify-center px-5 py-8 md:py-12">
        <div className="bg-white border border-border rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] w-full max-w-[560px] px-8 py-10 md:px-14 md:py-12">

          <div className="text-[11px] font-medium tracking-[0.08em] text-accent-dark uppercase mb-4">
            Create your account
          </div>

          <h1 className="font-serif font-normal text-[28px] md:text-[38px] leading-[1.1] tracking-[-0.02em] mb-4">
            Complete your account creation and{" "}
            <em className="italic text-accent-dark">start getting alerts</em>
          </h1>

          <p className="text-[15px] text-mid font-light leading-[1.6] mb-8">
            We&apos;ll keep an eye on your site and email you the moment we spot
            something worth your time.
          </p>

          <SignupForm initialUrl={initialUrl} />
        </div>
      </main>
    </div>
  );
}
