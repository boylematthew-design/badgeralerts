import Link from "next/link";
import { GUIDE_PRICES, getGuidePricingFeatures } from "@/lib/guide-pricing";

// Ticks and dashes are real text characters (not SVG icons), each paired with a hidden
// "Included" / "Not included" word, so search engines, AI tools, screen readers and
// copy-paste all get the meaning — not just people looking at the screen.
function Tick() {
  return (
    <span className="block text-center text-accent-dark text-[18px] font-medium leading-none">
      ✓<span className="sr-only"> Included</span>
    </span>
  );
}

function Cross() {
  return (
    <span className="block text-center text-muted text-[18px] leading-none">
      ✗<span className="sr-only"> Not included</span>
    </span>
  );
}

export default function GuidePricing({
  slug,
  topicName,
  heading,
}: {
  slug: string;
  topicName: string;
  heading: string;
}) {
  const features = getGuidePricingFeatures(slug);
  const article = /^[aeiou]/i.test(topicName) ? "an" : "a";

  return (
    <section className="mb-12">
      <h2 className="font-heading font-bold tracking-[-0.03em] text-[22px] md:text-[26px] text-ink mb-3">
        {heading}
      </h2>
      <p className="text-[14px] md:text-[15px] text-mid leading-[1.6] mb-6">
        The cost of {article} {topicName} expert who provides consultancy and agency services can
        depend on the scope of the project and what exactly is needed. Below we have listed the
        prices we charge for the service. If you wish to have more information then{" "}
        <Link href="/contact" className="text-accent-dark underline underline-offset-2 hover:opacity-80">
          contact us
        </Link>
        .
      </p>

      <div className="border border-border rounded-[20px] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="px-4 md:px-6 py-4 text-[11px] font-medium tracking-[0.08em] text-muted uppercase align-bottom">
                What&apos;s included
              </th>
              <th scope="col" className="px-2 md:px-6 py-4 text-center align-bottom w-[90px] md:w-[150px]">
                <span className="block text-[12px] md:text-[13px] font-medium text-ink">One-off audit</span>
                <span className="block font-heading font-bold tracking-[-0.03em] text-[20px] md:text-[26px] text-ink mt-1">{GUIDE_PRICES.audit}</span>
              </th>
              <th scope="col" className="px-2 md:px-6 py-4 text-center align-bottom w-[90px] md:w-[150px]">
                <span className="block text-[12px] md:text-[13px] font-medium text-ink">Monthly service</span>
                <span className="block font-heading font-bold tracking-[-0.03em] text-[20px] md:text-[26px] text-ink mt-1">{GUIDE_PRICES.monthly}</span>
                <span className="block text-[11px] text-muted">per month</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature) => (
              <tr key={feature.label} className="border-b border-border last:border-b-0">
                <th scope="row" className="px-4 md:px-6 py-3 text-[13px] md:text-[14px] text-mid leading-[1.4]">
                  {feature.label}
                </th>
                <td className="px-2 md:px-6 py-3">{feature.audit ? <Tick /> : <Cross />}</td>
                <td className="px-2 md:px-6 py-3">{feature.monthly ? <Tick /> : <Cross />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
        <Link
          href="/contact"
          className="btn-light inline-flex items-center justify-center gap-2 px-6 py-3 text-[14px] md:text-[15px]"
        >
          {/* one span so flex doesn't collapse the spaces around {topicName} */}
          <span>Get your {topicName} quote &rarr;</span>
        </Link>
        <span className="text-[13px] text-muted text-center sm:text-left">
          No obligation &middot; just tell me what you need
        </span>
      </div>
    </section>
  );
}
