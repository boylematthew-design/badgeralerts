"use client";

import { useRef, useState, type ReactNode } from "react";

// A YouTube video that loads only when the reader presses play. Until then it's our own self-hosted
// thumbnail, so the page stays fast and the reader's browser doesn't contact YouTube (or get
// YouTube cookies) unless they choose to watch. Plays from youtube-nocookie.com, YouTube's
// privacy-enhanced embed.
//
// Chapters show as an "In this video" list under the caption; choosing one plays from that point.
// The list is real text in the page's HTML, matching the Clip markup Google uses for key moments.
export default function VideoPlayer({
  youtubeId,
  title,
  thumbnail,
  durationLabel,
  caption,
  chapters = [],
}: {
  youtubeId: string;
  title: string;
  thumbnail: string;
  durationLabel: string;
  caption?: ReactNode;
  chapters?: { time: string; name: string; start: number }[];
}) {
  const [start, setStart] = useState<number | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const playing = start !== null;

  function playFrom(seconds: number) {
    setStart(seconds);
    frameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <>
      <div ref={frameRef} className="relative w-full aspect-video rounded-[16px] overflow-hidden bg-ink">
        {playing ? (
          <iframe
            // A new start time reloads the player at that point.
            key={start}
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&start=${start}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <button type="button" onClick={() => playFrom(0)} className="group absolute inset-0 w-full h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex items-center gap-2.5 rounded-full bg-lime text-ink font-semibold text-[15px] pl-4 pr-5 py-3 group-hover:scale-105 transition-transform">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play video
                <span className="text-[13px] font-medium opacity-80">{durationLabel}</span>
              </span>
            </span>
            <span className="sr-only">: {title}</span>
          </button>
        )}
      </div>

      {caption}

      {chapters.length > 0 && (
        <div className="mt-5">
          <p className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-2">In this video</p>
          <ol className="grid sm:grid-cols-2 gap-x-6">
            {chapters.map((chapter) => (
              <li key={chapter.time} className="border-b border-border">
                <button
                  type="button"
                  onClick={() => playFrom(chapter.start)}
                  className="w-full flex items-baseline gap-3 py-2 text-left text-[14px] text-ink hover:text-accent-dark transition-colors"
                >
                  <span className="font-mono text-[13px] text-accent-dark w-[42px] flex-shrink-0">{chapter.time}</span>
                  <span>{chapter.name}</span>
                  <span className="sr-only"> (play from {chapter.time})</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  );
}
