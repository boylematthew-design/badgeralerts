import Link from "next/link";
import LogoMark from "./Logo";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-7 md:px-12 h-[68px] border-b border-border bg-white/[0.92] backdrop-blur-[12px]">
      <Link href="/" className="flex items-center gap-2.5">
        <LogoMark />
        <span className="text-[15px] font-medium tracking-[-0.025em] text-ink">
          Matthew Boyle
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <Link
          href="/blog"
          className="hidden sm:block text-[14px] text-mid px-3 py-2 hover:text-ink transition-colors"
        >
          Blog
        </Link>
        <Link
          href="/login"
          className="hidden sm:block text-[14px] text-mid px-3 py-2 hover:text-ink transition-colors"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="bg-ink text-white text-[14px] font-medium px-5 py-2.5 rounded-[8px] hover:opacity-80 active:translate-y-px transition-all"
        >
          Get started free
        </Link>
      </div>
    </nav>
  );
}
