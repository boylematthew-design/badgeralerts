export default function WaitingRoom({ name }: { name?: string }) {
  const first = name?.split(" ")[0];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
      {/* Radar animation */}
      <div className="w-14 h-14 rounded-full bg-accent-light flex items-center justify-center mb-6">
        <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
          <defs>
            <clipPath id="ba-wait-clip">
              <rect width="32" height="32" rx="9" />
            </clipPath>
          </defs>
          <g clipPath="url(#ba-wait-clip)">
            <rect width="32" height="32" rx="9" fill="#111110" />
            <g fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
              <path d="M7 25 A 8 8 0 0 1 15 17" />
              <path d="M7 25 A 13 13 0 0 1 20 12" opacity="0.55" />
              <path d="M7 25 A 18 18 0 0 1 25 7" opacity="0.3" />
            </g>
            <circle cx="7" cy="25" r="2.4" fill="#1DB973" />
          </g>
        </svg>
      </div>

      <h2 className="font-serif font-normal text-[26px] md:text-[32px] leading-[1.1] tracking-[-0.02em] text-ink mb-3">
        {first ? (
          <>Hang tight, <em className="italic text-accent-dark">{first}.</em></>
        ) : (
          <>Your first alerts are <em className="italic text-accent-dark">on their way.</em></>
        )}
      </h2>

      <p className="text-[15px] text-mid font-light leading-[1.6] max-w-sm mb-10">
        We&apos;re scanning your site now. Your alerts will appear here the moment
        we find something worth your attention.
      </p>

      <div className="w-full max-w-[340px] flex flex-col gap-2.5 text-left">
        {[
          { done: true, label: "Account created" },
          { done: true, label: "Site analysis in progress" },
          { done: false, label: "First alerts — coming soon" },
        ].map((step) => (
          <div
            key={step.label}
            className="flex items-center gap-3 bg-white border border-border rounded-[12px] px-4 py-3.5"
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                step.done ? "bg-accent" : "bg-surface border border-border"
              }`}
            >
              {step.done && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m4 12 5 5 11-12" />
                </svg>
              )}
            </div>
            <span className={`text-[13.5px] font-medium ${step.done ? "text-ink" : "text-muted"}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
