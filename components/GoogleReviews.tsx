import { GOOGLE_MAPS_URL } from "@/lib/footer-links";
import { getGoogleReviews } from "@/lib/google-reviews";
import { getInitials } from "@/lib/initials";

// Stars as text characters, with the rating in words for screen readers, Google and copy-paste.
function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="text-accent tracking-[0.1em]">
      <span aria-hidden="true">
        {"★".repeat(full)}
        <span className="text-border-strong">{"★".repeat(5 - full)}</span>
      </span>
      <span className="sr-only">{rating} out of 5 stars</span>
    </span>
  );
}

// Homepage reviews, pulled live from the Google Business Profile (see lib/google-reviews.ts).
// Each reviewer's name links to their Google profile and each review links to the original on
// Google, so anyone can check they're real. Rendered on the server, so it's all crawlable HTML.
// Note: no Review schema markup on purpose. Google ignores reviews a business shows about itself
// for rich results, and it can count as a spam signal.
export default async function GoogleReviews() {
  const data = await getGoogleReviews();
  if (!data) return null;

  const allReviewsUrl = data.reviewsUrl ?? GOOGLE_MAPS_URL;

  return (
    <section className="max-w-[1120px] mx-auto px-7 md:px-12 py-16 md:py-24">
      <div className="flex items-end justify-between gap-4 mb-3.5 flex-wrap">
        <div>
          <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-3">
            Google reviews
          </div>
          <h2 className="font-heading font-extrabold tracking-[-0.04em] text-[32px] md:text-[40px] leading-[1.1]">
            What clients <em className="not-italic text-accent">say</em>
          </h2>
        </div>
        <a
          href={allReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] text-accent-dark font-semibold hover:underline underline-offset-2 flex-shrink-0"
        >
          See all reviews on Google →
        </a>
      </div>
      <p className="text-[15px] md:text-[16px] text-mid leading-[1.6] max-w-[520px] mb-12">
        <Stars rating={data.rating} /> <strong className="text-ink">{data.rating.toFixed(1)}</strong>{" "}
        from {data.total} Google review{data.total !== 1 ? "s" : ""}.
      </p>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.reviews.map((review, i) => (
          <li
            key={i}
            className="bg-white border border-border rounded-[16px] px-6 py-6 flex flex-col"
          >
            <figure className="flex flex-col h-full">
              <Stars rating={review.rating} />
              <blockquote className="text-[14px] text-mid leading-[1.65] mt-3 mb-5 whitespace-pre-line line-clamp-[8]">
                {review.text}
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="w-9 h-9 rounded-full bg-paper border border-border flex items-center justify-center text-[12px] font-semibold text-ink flex-shrink-0"
                >
                  {getInitials(review.author)}
                </span>
                <span className="min-w-0">
                  {review.authorUrl ? (
                    <a
                      href={review.authorUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="block text-[14px] font-medium text-ink hover:underline underline-offset-2 truncate"
                    >
                      {review.author}
                    </a>
                  ) : (
                    <span className="block text-[14px] font-medium text-ink truncate">{review.author}</span>
                  )}
                  <span className="block text-[12.5px] text-muted">
                    {review.when && <>{review.when} · </>}
                    {review.reviewUrl ? (
                      <a
                        href={review.reviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline underline-offset-2"
                      >
                        View on Google
                      </a>
                    ) : (
                      "Google"
                    )}
                  </span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
