export default function WaitingRoom({ name }: { name?: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
      {/* Animated icons */}
      <div className="flex items-end justify-center gap-4 mb-10 text-5xl">
        <span className="animate-bounce" style={{ animationDelay: "0ms" }}>
          🤖
        </span>
        <span className="animate-bounce" style={{ animationDelay: "150ms" }}>
          🔍
        </span>
        <span className="animate-bounce" style={{ animationDelay: "300ms" }}>
          🧪
        </span>
      </div>

      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4 leading-tight">
        {name ? `Hang tight, ${name.split(" ")[0]}.` : "Hang tight."}
        <br />
        Good things are brewing.
      </h2>

      {/* Sub copy */}
      <p className="text-slate-500 text-base md:text-lg max-w-md leading-relaxed mb-10">
        Our bots are crawling your site 🤖, our scripts are running 📜, and the
        potions are bubbling 🧪. Your first alerts will drop right here the
        moment they&apos;re ready.
      </p>

      {/* Progress steps */}
      <div className="w-full max-w-sm space-y-3 text-left">
        {[
          { emoji: "✅", label: "Account created" },
          { emoji: "⚙️", label: "Site analysis in progress…" },
          { emoji: "🔔", label: "Alerts — coming soon" },
        ].map((step) => (
          <div
            key={step.label}
            className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm"
          >
            <span className="text-xl">{step.emoji}</span>
            <span className="text-sm font-semibold text-slate-700">
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
