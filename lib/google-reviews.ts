// Live Google reviews for the homepage (components/GoogleReviews.tsx), fetched on the server from
// the Google Places API (New) and cached for a day.
//
// Cost: reviews come from the Place Details "Enterprise + Atmosphere" SKU, which has a free monthly
// allowance. Cached once a day, this uses about 30 requests a month, far under it. The Google Cloud
// project also has a daily quota cap on the Places API as a hard stop, so a bug can't run up a bill.
//
// Security: the API key lives only in the GOOGLE_PLACES_API_KEY environment variable (never
// NEXT_PUBLIC_, so it never reaches the browser), and the key is restricted to the Places API (New).

// The Google Business Profile's Place ID. It's public, not a secret.
export const GOOGLE_PLACE_ID = "";

const ONE_DAY = 60 * 60 * 24;

export type GoogleReview = {
  author: string;
  authorUrl?: string;
  rating: number;
  text: string;
  when: string; // e.g. "3 months ago", worded by Google
  reviewUrl?: string;
};

export type GoogleReviewsData = {
  rating: number;
  total: number;
  reviews: GoogleReview[];
  reviewsUrl?: string;
};

type PlacesResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsLinks?: { reviewsUri?: string };
  reviews?: {
    rating?: number;
    text?: { text?: string };
    originalText?: { text?: string };
    relativePublishTimeDescription?: string;
    googleMapsUri?: string;
    authorAttribution?: { displayName?: string; uri?: string };
  }[];
};

// Returns null when it isn't set up yet or Google is unreachable, so the homepage just hides the
// section instead of breaking.
export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key || !GOOGLE_PLACE_ID) return null;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(GOOGLE_PLACE_ID)}?languageCode=en`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          // Only ask for the fields shown. Google bills by the fields requested.
          "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsLinks",
        },
        next: { revalidate: ONE_DAY },
      }
    );
    if (!res.ok) {
      console.error("Google reviews fetch failed:", res.status);
      return null;
    }
    const data = (await res.json()) as PlacesResponse;

    const reviews = (data.reviews ?? [])
      .map((r) => ({
        author: r.authorAttribution?.displayName ?? "Google user",
        authorUrl: r.authorAttribution?.uri,
        rating: r.rating ?? 0,
        text: (r.originalText?.text ?? r.text?.text ?? "").trim(),
        when: r.relativePublishTimeDescription ?? "",
        reviewUrl: r.googleMapsUri,
      }))
      // Star-only reviews with no words don't say much on a homepage.
      .filter((r) => r.text);

    if (!reviews.length) return null;

    return {
      rating: data.rating ?? 0,
      total: data.userRatingCount ?? reviews.length,
      reviews,
      reviewsUrl: data.googleMapsLinks?.reviewsUri,
    };
  } catch (err) {
    console.error("Google reviews fetch error:", err);
    return null;
  }
}
