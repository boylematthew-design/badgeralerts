// YouTube videos shown on a guide page, between the table of contents and the tips. Keyed by the
// guide's slug like lib/guide-faqs.ts. Each also feeds Google's VideoObject structured data, which
// can show the video (with its thumbnail and length) in Google Search and Video results.
//
// To add one: take the ID from the YouTube link (watch?v=<ID>), save a 16:9 thumbnail to
// /public/video-thumbnails/<ID>.jpg, and copy the title, upload date and length from YouTube.

export interface GuideVideo {
  youtubeId: string;
  title: string;
  description: string;
  uploadDate: string; // ISO 8601 with time zone, as YouTube shows it
  duration: string; // ISO 8601, e.g. PT12M51S
  durationLabel: string; // shown to readers, e.g. 12:51
}

const GUIDE_VIDEOS: Record<string, GuideVideo> = {
  "google-maps-marketing": {
    youtubeId: "pbK4I2hIDwU",
    title: "Google Maps Marketing Strategy Review 2026: Expert Tips, Advice and More from a Consultant",
    description:
      "Google Maps marketing strategy for 2026: 25 practical tips to get your local business found, from filling out your listing to getting better reviews, restaurant-specific wins and going beyond Google.",
    uploadDate: "2026-11-09T06:44:11-08:00",
    duration: "PT12M51S",
    durationLabel: "12:51",
  },
};

export function getGuideVideo(guideSlug: string): GuideVideo | null {
  return GUIDE_VIDEOS[guideSlug] ?? null;
}

export function videoThumbnail(video: GuideVideo): string {
  return `/video-thumbnails/${video.youtubeId}.jpg`;
}
