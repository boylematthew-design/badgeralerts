"use client";

import { useRef, useState } from "react";
import type { TipImage } from "@/lib/tip-image";

// Swipeable, Instagram-style image carousel for tips with two or more images.
//
// Why CSS scroll-snap instead of a carousel library: swiping on phones is the browser's own native
// scroll (smooth, no extra JavaScript to download), and every image + caption is real HTML in the
// page from the start, so Google and AI tools can read all of them, not just the first slide.
// The JavaScript here only powers the arrows, dots and "1 / 4" counter.
export default function TipImageCarousel({ images, tipTitle }: { images: TipImage[]; tipTitle: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const total = images.length;

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const target = Math.max(0, Math.min(total - 1, index));
    track.scrollTo({ left: target * track.clientWidth, behavior: "smooth" });
  }

  function handleScroll() {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
  }

  const arrowClass =
    "absolute top-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-paper text-ink border border-border-strong hover:bg-white transition";

  return (
    <div className="mt-5 max-w-[720px]" role="region" aria-roledescription="carousel" aria-label={`Images for: ${tipTitle}`}>
      <div className="relative">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          tabIndex={0}
          aria-label="Swipe or use the arrow keys to see more images"
          className="flex overflow-x-auto snap-x snap-mandatory rounded-[14px] border border-border bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((img, i) => (
            <figure
              key={img.url}
              role="group"
              aria-roledescription="slide"
              aria-label={`Image ${i + 1} of ${total}`}
              className="w-full shrink-0 snap-center flex items-center justify-center"
            >
              {/* Plain <img> so animated GIFs keep playing. object-contain keeps the whole image visible;
                  any spare space shows the flat surface colour, like Instagram's letterboxing. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt || `${tipTitle}, image ${i + 1}`}
                loading="lazy"
                decoding="async"
                className="block w-auto h-auto max-w-full max-h-[560px] md:max-h-[720px] object-contain"
              />
            </figure>
          ))}
        </div>

        <p className="absolute top-3 right-3 z-10 rounded-full bg-ink text-paper text-xs font-medium px-2.5 py-1" aria-live="polite">
          {active + 1} / {total}
        </p>

        {active > 0 && (
          <button type="button" onClick={() => goTo(active - 1)} className={`${arrowClass} left-3`}>
            <span className="sr-only">Previous image</span>
            <svg aria-hidden="true" viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12.5 4.5 7 10l5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        {active < total - 1 && (
          <button type="button" onClick={() => goTo(active + 1)} className={`${arrowClass} right-3`}>
            <span className="sr-only">Next image</span>
            <svg aria-hidden="true" viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7.5 4.5 13 10l-5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex justify-center gap-1.5 mt-3">
        {images.map((img, i) => (
          <button
            key={img.url}
            type="button"
            onClick={() => goTo(i)}
            aria-current={i === active ? "true" : undefined}
            className="p-1"
          >
            <span className="sr-only">Show image {i + 1} of {total}</span>
            <span aria-hidden="true" className={`block w-2 h-2 rounded-full transition ${i === active ? "bg-accent" : "bg-border-strong"}`} />
          </button>
        ))}
      </div>

      {/* Every caption is in the HTML (crawlable); only the current slide's one is shown. */}
      {images.map((img, i) =>
        img.caption ? (
          <p key={img.url} className={`text-[13px] text-muted italic mt-2 ${i === active ? "" : "hidden"}`}>
            {img.caption}
          </p>
        ) : null
      )}
    </div>
  );
}
