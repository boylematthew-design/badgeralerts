import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsOfServicePage() {
  return (
    <div className="bg-white text-ink">
      <Navbar />
      <main className="max-w-[760px] mx-auto px-7 md:px-12 py-14 md:py-20">
        <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-4">Legal</div>
        <h1 className="font-serif font-normal text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.02em] text-ink mb-3">
          Terms of Service
        </h1>
        <p className="text-[13px] text-muted mb-12">Last updated: 19 April 2026</p>

        <div className="flex flex-col gap-10 text-[14px] text-mid leading-[1.75]">

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">1. Acceptance of terms</h2>
            <p>By creating an account and using BadgerAlerts ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">2. Description of service</h2>
            <p>BadgerAlerts is a digital marketing monitoring service that delivers scheduled alerts and insights about your website&apos;s digital presence, including SEO, social media, competitor activity, content strategy, and paid media performance. Alerts are curated and delivered by email on a schedule determined by BadgerAlerts.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">3. Account registration</h2>
            <p className="mb-3">To use BadgerAlerts, you must:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Provide accurate and complete information when creating your account</li>
              <li>Verify your email address</li>
              <li>Keep your login credentials secure and confidential</li>
              <li>Notify us immediately of any unauthorised access to your account</li>
            </ul>
            <p className="mt-3">You are responsible for all activity that occurs under your account.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">4. Acceptable use</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorised access to any part of the Service</li>
              <li>Share your account credentials with third parties</li>
              <li>Use automated tools to access or scrape the Service</li>
              <li>Misrepresent your identity or website when registering</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">5. Intellectual property</h2>
            <p>All content, alerts, insights, and materials provided through BadgerAlerts are the intellectual property of BadgerAlerts. You may not reproduce, distribute, or commercially exploit any content from the Service without our written permission.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">6. Disclaimer of warranties</h2>
            <p>BadgerAlerts provides alerts and insights for informational purposes only. We do not guarantee specific results or outcomes from acting on any alert. The Service is provided &ldquo;as is&rdquo; without warranties of any kind, express or implied.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">7. Limitation of liability</h2>
            <p>To the fullest extent permitted by law, BadgerAlerts shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, including but not limited to loss of revenue, data, or business opportunities.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">8. Account termination</h2>
            <p>You may delete your account at any time from your dashboard settings. We reserve the right to suspend or terminate accounts that violate these terms or are used in a manner that could harm the Service or other users.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">9. Changes to these terms</h2>
            <p>We may update these Terms of Service from time to time. We will notify you of significant changes by email. Continued use of the Service after changes are posted constitutes your acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">10. Governing law</h2>
            <p>These terms are governed by the laws of England and Wales. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">11. Contact us</h2>
            <p>If you have any questions about these Terms of Service, please contact us at <strong className="font-medium text-ink">hello@badgeralerts.live</strong>.</p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
