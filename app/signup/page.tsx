import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SignupForm from "@/components/SignupForm";

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
      <Navbar />
      <main className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="bg-white border border-border rounded-[18px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] w-full max-w-[560px] p-10 md:p-14">
          <div className="text-[11px] font-medium tracking-[0.08em] text-accent-dark uppercase mb-4">
            Create your account
          </div>
          <h1 className="font-serif text-[32px] md:text-[38px] leading-[1.1] tracking-[-0.02em] mb-4">
            Complete your signup and{" "}
            <em className="italic text-accent-dark">start getting alerts</em>
          </h1>
          <p className="text-[15px] text-mid font-light leading-[1.6] mb-8">
            We&apos;ll keep an eye on your site and email you the moment we spot
            something worth your time.
          </p>
          <SignupForm initialUrl={initialUrl} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
