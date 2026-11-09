import VideoPlayer from "./VideoPlayer";
import { videoThumbnail, type GuideVideo } from "@/lib/guide-videos";

const BASE_URL = "https://www.compoundingwins.com";

// A guide's video, between the table of contents and the tips, with VideoObject structured data so
// Google can show it in search results. Videos are listed in lib/guide-videos.ts.
export default function GuideVideoSection({ video }: { video: GuideVideo }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: [`${BASE_URL}${videoThumbnail(video)}`, `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`],
    uploadDate: video.uploadDate,
    duration: video.duration,
    contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
    embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
  };

  return (
    <section className="mb-12" aria-labelledby="guide-video">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
      {/* A label, not a heading: the tips below belong to the guide's own H2, not to this video. */}
      <p id="guide-video" className="text-[11px] font-medium tracking-[0.08em] text-accent-dark uppercase mb-3">
        Watch the video
      </p>
      <VideoPlayer
        youtubeId={video.youtubeId}
        title={video.title}
        thumbnail={videoThumbnail(video)}
        durationLabel={video.durationLabel}
      />
      <p className="text-[14px] text-mid leading-[1.6] mt-3">
        <span className="font-semibold text-ink">{video.title}.</span>{" "}
        <a
          href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-dark underline underline-offset-2 hover:opacity-80 whitespace-nowrap"
        >
          Watch on YouTube<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>
    </section>
  );
}
