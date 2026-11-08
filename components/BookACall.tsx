// "Book a call" block on each services page. Topics come from lib/service-call-topics.ts.
// /book redirects to the booking tool (see next.config.ts).

export default function BookACall({ serviceName, topics }: { serviceName: string; topics: string[] }) {
  return (
    <section className="mb-12 bg-ink text-paper rounded-[20px] px-6 md:px-10 py-8 md:py-10" aria-labelledby="book-a-call">
      <h2 id="book-a-call" className="font-heading font-bold tracking-[-0.03em] text-[22px] md:text-[26px] text-paper mb-3">
        Book a free call about {serviceName}
      </h2>
      <p className="text-[15px] text-muted-dark leading-[1.7] mb-5">
        A free 30-minute call on Google Meet with me, Matthew Boyle. No hard sell, just practical advice. Things we
        could talk about:
      </p>
      <ul className="space-y-2.5 mb-7">
        {topics.map((topic) => (
          <li key={topic} className="flex items-start gap-2.5 text-[15px] text-paper leading-[1.5]">
            <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-lime flex-shrink-0 mt-[9px]" />
            {topic}
          </li>
        ))}
      </ul>
      <a
        href="/book"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-dark inline-block text-[15px] px-6 py-3 active:translate-y-px"
      >
        Book a free call
      </a>
    </section>
  );
}
