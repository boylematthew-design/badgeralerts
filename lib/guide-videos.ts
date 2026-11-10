// YouTube videos shown on a guide page, between the table of contents and the tips. Keyed by the
// guide's slug like lib/guide-faqs.ts. Each also feeds Google's VideoObject structured data, which
// can show the video (with its thumbnail and length) in Google Search and Video results. Chapters
// become Clip markup, which Google can use to show "key moments" for the guide page.
//
// To add one: take the ID from the YouTube link (watch?v=<ID>), save a 16:9 thumbnail to
// /public/video-thumbnails/<ID>.jpg, and copy the title, upload date, length and the chapter list
// from the video's YouTube description (same times and names, so both match).

export interface VideoChapter {
  time: string; // as written in the YouTube description, e.g. "5:28" or "1:02:10"
  name: string; // sentence case
}

export interface GuideVideo {
  youtubeId: string;
  title: string; // sentence case, matching YouTube; shown on the page followed by a full stop
  description: string;
  uploadDate: string; // ISO 8601 with time zone, as YouTube shows it
  duration: string; // ISO 8601, e.g. PT12M51S
  durationLabel: string; // shown to readers, e.g. 12:51
  chapters?: VideoChapter[]; // must start at 0:00, in order, like YouTube chapters
}

const GUIDE_VIDEOS: Record<string, GuideVideo> = {
  "google-maps-marketing": {
    youtubeId: "pbK4I2hIDwU",
    title: "Google Maps marketing strategy review 2026: expert tips, advice and more from a consultant",
    description:
      "Google Maps marketing strategy for 2026: 25 practical tips to get your local business found, from filling out your listing to getting better reviews, restaurant-specific wins and going beyond Google.",
    uploadDate: "2026-11-09T06:44:11-08:00",
    duration: "PT12M51S",
    durationLabel: "12:51",
    chapters: [
      { time: "0:00", name: "Intro" },
      { time: "0:31", name: "When to get expert help" },
      { time: "1:37", name: "Before you start" },
      { time: "2:09", name: "Filling out your listing" },
      { time: "5:28", name: "Reviews" },
      { time: "8:48", name: "Restaurant owners" },
      { time: "11:02", name: "Going further" },
      { time: "12:36", name: "Wrap-up" },
    ],
  },
};

export function getGuideVideo(guideSlug: string): GuideVideo | null {
  return GUIDE_VIDEOS[guideSlug] ?? null;
}

export function videoThumbnail(video: GuideVideo): string {
  return `/video-thumbnails/${video.youtubeId}.jpg`;
}

// "5:28" → 328, "1:02:10" → 3730
export function toSeconds(time: string): number {
  return time.split(":").reduce((total, part) => total * 60 + Number(part), 0);
}

// "PT12M51S" → 771
export function durationSeconds(duration: string): number {
  const m = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  return m ? Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0) : 0;
}

// Chapters with start and end in seconds. Each chapter ends where the next one starts; the last
// ends at the end of the video.
export function chapterRanges(video: GuideVideo) {
  const chapters = video.chapters ?? [];
  const total = durationSeconds(video.duration);
  return chapters.map((chapter, i) => ({
    ...chapter,
    start: toSeconds(chapter.time),
    end: i + 1 < chapters.length ? toSeconds(chapters[i + 1].time) : total,
  }));
}
