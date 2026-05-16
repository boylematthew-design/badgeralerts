import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white text-ink">
      <Navbar />
      <main className="max-w-[760px] mx-auto px-7 md:px-12 py-14 md:py-20">
        <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-4">Legal</div>
        <h1 className="font-serif font-normal text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.02em] text-ink mb-3">
          Privacy Policy
        </h1>
        <p className="text-[13px] text-muted mb-12">Last updated: 19 April 2026</p>

        <div className="flex flex-col gap-10 text-[14px] text-mid leading-[1.75]">

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">1. Who we are</h2>
            <p>BadgerAlerts is a digital marketing monitoring service operated by BadgerAlerts (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). We provide automated alerts about your website&apos;s digital performance, SEO, social media, and more. Our website is <strong className="font-medium text-ink">badgeralerts.live</strong>.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">2. What data we collect</h2>
            <p className="mb-3">When you create an account, we collect:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Your full name</li>
              <li>Your email address</li>
              <li>Your website URL</li>
              <li>Your password (stored as a secure, one-way hash — we never see your actual password)</li>
            </ul>
            <p className="mt-3">We do not collect payment information, credit card details, or sensitive personal data.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">3. How we use your data</h2>
            <p className="mb-3">We use your data to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Create and manage your BadgerAlerts account</li>
              <li>Send you scheduled marketing alerts and notifications by email</li>
              <li>Personalise alert content with your name and website details</li>
              <li>Communicate important service updates</li>
            </ul>
            <p className="mt-3">We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">4. How we store your data</h2>
            <p>Your account data is stored securely using <strong className="font-medium text-ink">Supabase</strong>, a managed database platform with industry-standard encryption at rest and in transit. Email notifications are delivered via <strong className="font-medium text-ink">Resend</strong>, a transactional email service.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">5. Email communications</h2>
            <p>By creating an account, you agree to receive scheduled alert emails from BadgerAlerts. You can unsubscribe at any time by clicking the unsubscribe link in any email, or by visiting your account settings. Unsubscribing will stop all alert emails but you may still receive essential account notifications.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">6. Your rights</h2>
            <p className="mb-3">Under GDPR and applicable data protection law, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and personal data</li>
              <li>Withdraw consent to email communications at any time</li>
            </ul>
            <p className="mt-3">You can delete your account at any time from your dashboard settings. This will permanently remove your data from our systems.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">7. Cookies</h2>
            <p>We use essential cookies to keep you logged in to your account. We do not use tracking or advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">8. Changes to this policy</h2>
            <p>We may update this Privacy Policy from time to time. Any significant changes will be communicated by email. Continued use of the service after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">9. Contact us</h2>
            <p>If you have any questions about this Privacy Policy or how we handle your data, please contact us at <strong className="font-medium text-ink">support@badgeralerts.live</strong>.</p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
