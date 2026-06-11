import Link from "next/link";

export default function BlogSignupCTA({ topicName }: { topicName: string }) {
  return (
    <div className="bg-ink rounded-[20px] px-7 md:px-10 py-9 md:py-11 mt-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_0%,rgba(29,185,115,0.10),transparent_50%)]" />
      <div className="relative">
        <h3 className="font-serif text-[20px] md:text-[24px] text-white font-normal mb-2">
          Want more {topicName.toLowerCase()} tips and ideas?
        </h3>
        <p className="text-[14px] md:text-[15px] text-white/55 font-light leading-[1.6] mb-6 max-w-[480px] mx-auto">
          Add your website to BadgerAlerts and we&apos;ll scan it and send you personal
          recommendations automatically. It&apos;s a free service.
        </p>
        <Link
          href="/"
          className="inline-block bg-accent text-ink text-[14px] font-medium px-5 py-2.5 rounded-[8px] hover:opacity-80 active:translate-y-px transition-all"
        >
          Get started free
        </Link>
      </div>
    </div>
  );
}
