import Link from "next/link";

function LogoMark() {
  return (
    <div className="w-8 h-8 flex-shrink-0" aria-hidden="true">
      <svg viewBox="0 0 32 32" width="32" height="32">
        <defs>
          <clipPath id="ba-logo-clip">
            <rect width="32" height="32" rx="9" />
          </clipPath>
        </defs>
        <g clipPath="url(#ba-logo-clip)">
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

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-7 md:px-12 h-[68px] border-b border-border bg-white/[0.92] backdrop-blur-[12px]">
      <Link href="/" className="flex items-center gap-2.5">
        <LogoMark />
        <span className="text-[15px] font-medium tracking-[-0.025em] text-ink">
          badger<span className="text-accent">alerts</span>
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
