import Link from "next/link";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div style={{ background: "#eff4fb", minHeight: "100vh" }}>
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-[15px] font-extrabold tracking-tighter text-slate-900 uppercase">
          BADGER<span className="text-emerald-500">ALERTS</span>
        </Link>
        <Link href="/login" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition">
          Sign in
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 md:py-16">

        {/* Intro */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3">About BadgerAlerts</h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            Built by a digital marketing specialist with nearly 20 years of experience — to give every website owner the kind of insight that usually only comes from hiring a consultant.
          </p>
        </div>

        {/* Founder story */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm px-8 md:px-10 py-8 md:py-10 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0">
              M
            </div>
            <div>
              <p className="font-extrabold text-slate-900">Matthew Boyle</p>
              <p className="text-sm text-slate-500">Founder, BadgerAlerts — England, UK</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>
              I've spent nearly two decades working in digital marketing — running campaigns, auditing websites, and helping businesses improve their online presence. Over that time, you develop a sharp eye. I can look at a website and quickly spot what's holding it back: a technical SEO issue here, a content gap there, a competitor quietly picking up ground.
            </p>
            <p>
              The problem is that kind of expertise doesn't scale. Most business owners are running their company — they don't have time to stay on top of everything that's happening online. And hiring someone to do it full-time isn't always an option.
            </p>
            <p>
              At the start of 2026, I started building AI tools to do what I do — automatically. Tools that can scan a website, analyse what's going on in the wider landscape, and surface the issues and opportunities that matter. That intelligence is the foundation of BadgerAlerts.
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm px-8 md:px-10 py-8 md:py-10 mb-6">
          <h2 className="text-xl font-extrabold text-slate-900 mb-4">More than just alerts</h2>
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>
              BadgerAlerts isn't just about flagging problems. The goal is education. Every alert comes with a full explanation — what's happening, why it matters, and what you can do about it. Over time, you build a real understanding of your website and how digital marketing actually works.
            </p>
            <p>
              I want BadgerAlerts to be a platform that keeps ambitious website owners at the cutting edge — people who want to understand what's going on, not just be told what to do.
            </p>
          </div>
        </div>

        {/* What's coming */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm px-8 md:px-10 py-8 md:py-10 mb-10">
          <h2 className="text-xl font-extrabold text-slate-900 mb-4">What's coming</h2>
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>
              This is just the start. As the platform grows, I'll be releasing more AI-powered tools — each one targeting a different part of your digital presence — and building out a video library to go alongside them. Practical, no-nonsense content that explains digital marketing the way a good consultant would explain it to you in person.
            </p>
            <p>
              The ambition is a platform where the tools do the scanning, and the content gives you the knowledge to act on what you find.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: "🛠️", label: "More AI tools", desc: "Expanding coverage across every corner of your digital presence" },
              { icon: "🎬", label: "Video library", desc: "Plain-English explainers on digital marketing topics that matter" },
              { icon: "📊", label: "Deeper insights", desc: "Richer data and trend tracking as the platform matures" },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="font-bold text-slate-900 text-sm mb-1">{item.label}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-center">
          <h3 className="text-lg font-extrabold text-white mb-2">Ready to see it in action?</h3>
          <p className="text-slate-400 text-sm mb-4">Sign up free and get your first alert within days.</p>
          <Link
            href="/#signup"
            className="inline-block bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition"
          >
            Get started
          </Link>
        </div>

      </main>
      <Footer />
    </div>
  );
}
