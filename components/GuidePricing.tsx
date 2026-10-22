import Link from "next/link";
import { GUIDE_PRICES, getGuidePricingFeatures } from "@/lib/guide-pricing";

function Tick() {
  return (
    <svg className="w-5 h-5 mx-auto text-accent-dark" viewBox="0 0 20 20" fill="currentColor" aria-label="Included">
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function Cross() {
  return (
    <span className="block text-center text-muted" aria-label="Not included">
      &ndash;
    </span>
  );
}

export default function GuidePricing({ slug, topicName }: { slug: string; topicName: string }) {
  const features = getGuidePricingFeatures(slug);
  const article = /^[aeiou]/i.test(topicName) ? "an" : "a";

  return (
    <section className="mb-12">
      <h3 className="font-serif text-[22px] md:text-[26px] text-ink font-normal mb-3">
        Cost of {article} {topicName} expert agency services
      </h3>
      <p className="text-[14px] md:text-[15px] text-mid font-light leading-[1.6] mb-6">
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
                <span className="block font-serif text-[20px] md:text-[26px] text-ink mt-1">{GUIDE_PRICES.audit}</span>
              </th>
              <th scope="col" className="px-2 md:px-6 py-4 text-center align-bottom w-[90px] md:w-[150px]">
                <span className="block text-[12px] md:text-[13px] font-medium text-ink">Monthly service</span>
                <span className="block font-serif text-[20px] md:text-[26px] text-ink mt-1">{GUIDE_PRICES.monthly}</span>
                <span className="block text-[11px] text-muted font-light">per month</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature) => (
              <tr key={feature.label} className="border-b border-border last:border-b-0">
                <th scope="row" className="px-4 md:px-6 py-3 text-[13px] md:text-[14px] text-mid font-light leading-[1.4]">
                  {feature.label}
                </th>
                <td className="px-2 md:px-6 py-3">{feature.audit ? <Tick /> : <Cross />}</td>
                <td className="px-2 md:px-6 py-3">{feature.monthly ? <Tick /> : <Cross />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
