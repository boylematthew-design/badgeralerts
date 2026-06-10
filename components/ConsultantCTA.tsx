const LINKEDIN_URL = "https://www.linkedin.com/in/mattboyle3/";

export default function ConsultantCTA({ topicName }: { topicName: string }) {
  return (
    <div className="border border-border rounded-[20px] px-7 md:px-10 py-8 mt-10">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center text-white text-[14px] font-medium flex-shrink-0">
          M
        </div>
        <div>
          <p className="text-[14px] font-medium text-ink">Matthew Boyle</p>
          <p className="text-[13px] text-muted">Founder, BadgerAlerts &middot; ~20 years in digital marketing</p>
        </div>
      </div>
      <h3 className="font-serif text-[20px] md:text-[22px] text-ink font-normal mb-2">
        Looking for a {topicName} consultant?
      </h3>
      <p className="text-[14px] md:text-[15px] text-mid font-light leading-[1.6] mb-5 max-w-[520px]">
        I&apos;m available for hire to help with {topicName.toLowerCase()} — whether that&apos;s a one-off
        consultation or ongoing support. View my LinkedIn profile to see my experience and get in touch.
      </p>
      <a
        href={LINKEDIN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-ink text-white text-[14px] font-medium px-5 py-2.5 rounded-[8px] hover:opacity-80 active:translate-y-px transition-all"
      >
        View my LinkedIn profile
      </a>
    </div>
  );
}
