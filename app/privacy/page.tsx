import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div style={{ background: "#eff4fb", minHeight: "100vh" }}>
      {/* Nav */}
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
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-slate-400 mb-10">Last updated: 19 April 2026</p>

          <div className="space-y-8 text-slate-600 leading-relaxed">

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">1. Who we are</h2>
              <p>BadgerAlerts is a digital marketing monitoring service operated by BadgerAlerts ("we", "us", "our"). We provide automated alerts about your website's digital performance, SEO, social media, and more. Our website is <strong>badgeralerts.live</strong>.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">2. What data we collect</h2>
              <p className="mb-3">When you create an account, we collect:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Your full name</li>
                <li>Your email address</li>
                <li>Your website URL</li>
                <li>Your password (stored as a secure, one-way hash — we never see your actual password)</li>
              </ul>
              <p className="mt-3">We do not collect payment information, credit card details, or sensitive personal data.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">3. How we use your data</h2>
              <p className="mb-3">We use your data to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Create and manage your BadgerAlerts account</li>
                <li>Send you scheduled marketing alerts and notifications by email</li>
                <li>Personalise alert content with your name and website details</li>
                <li>Communicate important service updates</li>
              </ul>
              <p className="mt-3">We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">4. How we store your data</h2>
              <p>Your account data is stored securely using <strong>Supabase</strong>, a managed database platform with industry-standard encryption at rest and in transit. Email notifications are delivered via <strong>Resend</strong>, a transactional email service.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">5. Email communications</h2>
              <p>By creating an account, you agree to receive scheduled alert emails from BadgerAlerts. You can unsubscribe at any time by clicking the unsubscribe link in any email, or by visiting your account settings. Unsubscribing will stop all alert emails but you may still receive essential account notifications.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">6. Your rights</h2>
              <p className="mb-3">Under GDPR and applicable data protection law, you have the right to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your account and personal data</li>
                <li>Withdraw consent to email communications at any time</li>
              </ul>
              <p className="mt-3">You can delete your account at any time from your dashboard settings. This will permanently remove your data from our systems.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">7. Cookies</h2>
              <p>We use essential cookies to keep you logged in to your account. We do not use tracking or advertising cookies.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">8. Changes to this policy</h2>
              <p>We may update this Privacy Policy from time to time. Any significant changes will be communicated by email. Continued use of the service after changes constitutes acceptance of the updated policy.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">9. Contact us</h2>
              <p>If you have any questions about this Privacy Policy or how we handle your data, please contact us at <strong>hello@badgeralerts.live</strong>.</p>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
