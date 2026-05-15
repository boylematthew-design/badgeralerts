import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CookiePolicyPage() {
  return (
    <div className="bg-white text-ink">
      <Navbar />
      <main className="max-w-[760px] mx-auto px-7 md:px-12 py-14 md:py-20">
        <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-4">Legal</div>
        <h1 className="font-serif font-normal text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.02em] text-ink mb-3">
          Cookie Policy
        </h1>
        <p className="text-[13px] text-muted mb-12">Last updated: 6 May 2026</p>

        <div className="flex flex-col gap-10 text-[14px] text-mid leading-[1.75]">

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">What are cookies?</h2>
            <p>Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work, improve performance, and provide information to website owners. This policy explains how BadgerAlerts uses cookies in line with the UK Privacy and Electronic Communications Regulations (PECR) and the UK General Data Protection Regulation (UK GDPR).</p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">Who we are</h2>
            <p>BadgerAlerts is operated from England, United Kingdom. If you have any questions about this policy, you can contact us at <a href="mailto:support@badgeralerts.live" className="text-accent-dark underline underline-offset-2 decoration-border-strong hover:text-accent transition-colors">support@badgeralerts.live</a>.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">The cookies we use</h2>
            <div className="flex flex-col gap-4 mt-4">
              <div className="bg-surface border border-border rounded-[14px] p-5">
                <h3 className="text-[14px] font-medium text-ink mb-1">Essential cookies</h3>
                <p className="text-[11px] font-medium tracking-[0.06em] text-accent-dark uppercase mb-3">Always active — no consent required</p>
                <p className="mb-3">These cookies are strictly necessary for the website to function. They include session cookies that keep you logged in while you use your dashboard. Without these cookies, the service cannot be provided.</p>
                <ul className="list-disc pl-5 space-y-1.5 text-muted">
                  <li>Authentication session tokens (Supabase)</li>
                  <li>Security and fraud prevention</li>
                </ul>
              </div>

              <div className="bg-surface border border-border rounded-[14px] p-5">
                <h3 className="text-[14px] font-medium text-ink mb-1">Analytics and advertising cookies</h3>
                <p className="text-[11px] font-medium tracking-[0.06em] text-[#854F0B] uppercase mb-3">Requires consent</p>
                <p className="mb-3">We use the Reddit Pixel to understand how visitors find and use our site, and to measure the effectiveness of our advertising campaigns. This involves Reddit placing cookies on your device.</p>
                <ul className="list-disc pl-5 space-y-1.5 text-muted">
                  <li>Reddit Pixel (rp.gif) — tracks page visits and signup conversions</li>
                  <li>Data is processed by Reddit Inc. in accordance with their privacy policy</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">Your rights and how to control cookies</h2>
            <p className="mb-3">Under PECR, you have the right to refuse non-essential cookies. You can control and delete cookies through your browser settings. Please note that disabling cookies may affect the functionality of this website.</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><a href="https://support.google.com/chrome/answer/95647" className="text-accent-dark underline underline-offset-2 decoration-border-strong hover:text-accent transition-colors" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" className="text-accent-dark underline underline-offset-2 decoration-border-strong hover:text-accent transition-colors" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" className="text-accent-dark underline underline-offset-2 decoration-border-strong hover:text-accent transition-colors" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-accent-dark underline underline-offset-2 decoration-border-strong hover:text-accent transition-colors" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">Third-party cookies</h2>
            <p className="mb-3">Some cookies are placed by third-party services that appear on our pages. We do not control the setting of these cookies and you should check the relevant third-party websites for more information:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><a href="https://www.reddit.com/policies/privacy-policy" className="text-accent-dark underline underline-offset-2 decoration-border-strong hover:text-accent transition-colors" target="_blank" rel="noopener noreferrer">Reddit Privacy Policy</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">Changes to this policy</h2>
            <p>We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated date. We encourage you to review this policy periodically.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-medium text-ink mb-2">Contact us</h2>
            <p>If you have any questions about our use of cookies, please contact us at <a href="mailto:support@badgeralerts.live" className="text-accent-dark underline underline-offset-2 decoration-border-strong hover:text-accent transition-colors">support@badgeralerts.live</a>.</p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
