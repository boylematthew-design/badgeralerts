import ToolLayout, { faq } from "@/components/tools/ToolLayout";
import ReviewRequestKit from "@/components/tools/review-request-kit/ReviewRequestKit";

export const metadata = {
  title: "Free Google review link generator & review request kit | Compounding Wins",
  description:
    "Make your direct Google review link, ready-to-send WhatsApp, text and email review requests, printable QR table cards, and a simple log of who you've asked. Free, no sign-up.",
  alternates: { canonical: "/tools/review-request-kit" },
};

export default function Page() {
  return (
    <ToolLayout
      slug="review-request-kit"
      title={<>Google review link <em>&amp; request kit</em></>}
      intro={<>Make your direct Google review link, send customers a request that gets detailed reviews, print QR cards for the table or till, and keep a steady flow of new reviews coming in.</>}
      privacyNote="Everything runs in your browser, including your customer list. Nothing is sent to my servers."
      steps={[
        { title: "Get your review link", body: "Paste your Google Place ID (or the review link from your Business Profile). Add your Trustpilot, Checkatrade, Facebook, Yelp or Tripadvisor links too if you have them." },
        { title: "Pick a message", body: "Choose the review site and a message. Each one asks customers to say what you did and what stood out, which gets you longer reviews that rank better and convince more people." },
        { title: "Send it or print it", body: "Send by WhatsApp, text or email in one tap, or print QR table cards, menu stickers and till cards for customers in person." },
        { title: "Keep it steady", body: "Log who you've asked and watch the monthly chart. A steady trickle of fresh reviews beats a burst followed by nothing." },
      ]}
      faqs={[
        faq("How do I find my Google Place ID?", "Use Google's free Place ID Finder: search for your business name and it shows the ID, a long code that usually starts with ChIJ. You can also paste the 'Ask for reviews' link from your Google Business Profile instead."),
        faq("Can I only ask happy customers for a review?", "No. Filtering out unhappy customers before asking, known as review gating, is against Google's rules and can get reviews removed. Ask everyone the same way."),
        faq("Can I offer a discount for a review?", "No. Google doesn't allow incentives for reviews, even for honest ones. Make asking easy and well-timed instead: straight after the job or visit works best."),
        faq("Why ask for reviews on sites other than Google?", "ChatGPT, Bing and Apple Maps draw on other review sites. Apple Maps, for example, shows ratings from Yelp and Tripadvisor, so a few reviews there help you show up in more places."),
        faq("Where is my customer list stored?", "Only in your browser, on this device. Nothing is uploaded. Use 'Back up' to save a copy you can restore on another computer."),
      ]}
    >
      <ReviewRequestKit />
    </ToolLayout>
  );
}
