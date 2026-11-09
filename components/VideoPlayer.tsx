"use client";

import { useState } from "react";

// A YouTube video that loads only when the reader presses play. Until then it's our own self-hosted
// thumbnail, so the page stays fast and the reader's browser doesn't contact YouTube (or get
// YouTube cookies) unless they choose to watch. Plays from youtube-nocookie.com, YouTube's
// privacy-enhanced embed.
export default function VideoPlayer({
  youtubeId,
  title,
  thumbnail,
  durationLabel,
}: {
  youtubeId: string;
  title: string;
  thumbnail: string;
  durationLabel: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative w-full aspect-video rounded-[16px] overflow-hidden bg-ink">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 w-full h-full">
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
  );
}
