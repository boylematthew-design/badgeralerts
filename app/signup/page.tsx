import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import SignupForm from "@/components/SignupForm";
import Logo from "@/components/Logo";


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
          <Logo />
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
        <div className="bg-white border border-border rounded-[20px] w-full max-w-[560px] px-8 py-10 md:px-14 md:py-12">

          <div className="text-[11px] font-medium tracking-[0.08em] text-accent-dark uppercase mb-4">
            Create your account
          </div>

          <h1 className="font-heading font-extrabold tracking-[-0.04em] text-[28px] md:text-[38px] leading-[1.1] mb-4">
            Complete your account creation and{" "}
            <em className="not-italic text-accent">start getting alerts</em>
          </h1>

          <p className="text-[15px] text-mid leading-[1.6] mb-8">
            We&apos;ll keep an eye on your site and email you the moment we spot
            something worth your time.
          </p>

          <SignupForm initialUrl={initialUrl} />
        </div>
      </main>
    </div>
  );
}
