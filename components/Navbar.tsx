import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full relative z-20">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white p-1 shadow-lg shadow-slate-200 transition-transform group-hover:scale-105">
          <svg viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path fill="currentColor" d="M12 22a2.25 2.25 0 0 0 2.2-1.8H9.8A2.25 2.25 0 0 0 12 22Z" />
            <path fill="currentColor" d="M20 18.2H4c.9-1 2.2-2.1 2.2-5.2V10.3A5.8 5.8 0 0 1 10.7 4.7V3.6c0-.7.6-1.3 1.3-1.3s1.3.6 1.3 1.3v1.1a5.8 5.8 0 0 1 4.5 5.6V13c0 3.1 1.3 4.2 2.2 5.2Z" />
            <circle cx="18.2" cy="6.2" r="2.2" fill="#10b981" />
          </svg>
        </div>
        <div className="text-xl md:text-2xl font-extrabold tracking-tighter text-slate-900 uppercase transition-opacity group-hover:opacity-80">
          BADGER<span className="text-emerald-500">ALERTS</span>
        </div>
      </Link>

      <div className="flex items-center gap-2 md:gap-3">
        <Link href="/login" className="hidden sm:block text-slate-600 px-3 md:px-4 py-2 rounded-full font-semibold hover:text-slate-900 transition text-sm md:text-base">
          Sign in
        </Link>
        <Link href="#signup" className="bg-slate-900 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full font-semibold hover:bg-emerald-600 transition shadow-lg shadow-emerald-100 text-sm md:text-base">
          Register
        </Link>
      </div>
    </nav>
  );
}
