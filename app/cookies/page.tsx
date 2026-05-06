import Link from "next/link";
import Footer from "@/components/Footer";

export default function CookiePolicyPage() {
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
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm px-8 md:px-12 py-10 md:py-14">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Cookie Policy</h1>
          <p className="text-sm text-slate-400 mb-10">Last updated: 6 May 2026</p>

          <div className="prose prose-slate max-w-none space-y-8 text-sm text-slate-600 leading-relaxed">

            <section>
              <h2 className="text-lg font-extrabold text-slate-900 mb-3">What are cookies?</h2>
              <p>Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work, improve performance, and provide information to website owners. This policy explains how BadgerAlerts uses cookies in line with the UK Privacy and Electronic Communications Regulations (PECR) and the UK General Data Protection Regulation (UK GDPR).</p>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-slate-900 mb-3">Who we are</h2>
              <p>BadgerAlerts is operated from England, United Kingdom. If you have any questions about this policy, you can contact us at <a href="mailto:support@badgeralerts.live" className="text-emerald-600 hover:underline">support@badgeralerts.live</a>.</p>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-slate-900 mb-3">The cookies we use</h2>

              <div className="space-y-6">
                <div className="bg-slate-50 rounded-2xl p-5">
                  <h3 className="font-bold text-slate-900 mb-1">Essential cookies</h3>
                  <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider mb-2">Always active — no consent required</p>
                  <p>These cookies are strictly necessary for the website to function. They include session cookies that keep you logged in while you use your dashboard. Without these cookies, the service cannot be provided.</p>
                  <ul className="mt-3 space-y-1 list-disc list-inside text-slate-500">
                    <li>Authentication session tokens (Supabase)</li>
                    <li>Security and fraud prevention</li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5">
                  <h3 className="font-bold text-slate-900 mb-1">Analytics and advertising cookies</h3>
                  <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider mb-2">Requires consent</p>
                  <p>We use the Reddit Pixel to understand how visitors find and use our site, and to measure the effectiveness of our advertising campaigns. This involves Reddit placing cookies on your device.</p>
                  <ul className="mt-3 space-y-1 list-disc list-inside text-slate-500">
                    <li>Reddit Pixel (rp.gif) — tracks page visits and signup conversions</li>
                    <li>Data is processed by Reddit Inc. in accordance with their privacy policy</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-slate-900 mb-3">Your rights and how to control cookies</h2>
              <p>Under PECR, you have the right to refuse non-essential cookies. You can control and delete cookies through your browser settings. Please note that disabling cookies may affect the functionality of this website.</p>
              <ul className="mt-3 space-y-1 list-disc list-inside">
                <li><a href="https://support.google.com/chrome/answer/95647" className="text-emerald-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" className="text-emerald-600 hover:underline" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" className="text-emerald-600 hover:underline" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-emerald-600 hover:underline" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-slate-900 mb-3">Third-party cookies</h2>
              <p>Some cookies are placed by third-party services that appear on our pages. We do not control the setting of these cookies and you should check the relevant third-party websites for more information:</p>
              <ul className="mt-3 space-y-1 list-disc list-inside">
                <li><a href="https://www.reddit.com/policies/privacy-policy" className="text-emerald-600 hover:underline" target="_blank" rel="noopener noreferrer">Reddit Privacy Policy</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-slate-900 mb-3">Changes to this policy</h2>
              <p>We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated date. We encourage you to review this policy periodically.</p>
            </section>

            <section>
              <h2 className="text-lg font-extrabold text-slate-900 mb-3">Contact us</h2>
              <p>If you have any questions about our use of cookies, please contact us at <a href="mailto:support@badgeralerts.live" className="text-emerald-600 hover:underline">support@badgeralerts.live</a>.</p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
