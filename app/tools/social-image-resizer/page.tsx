import ToolLayout, { faq } from "@/components/tools/ToolLayout";
import SocialImageResizer from "@/components/tools/social-image-resizer/SocialImageResizer";

export const metadata = {
  title: "Free social media image resizer with text overlay | Compounding Wins",
  description:
    "Resize one photo for Open Graph link previews, Pinterest, Instagram, TikTok covers and YouTube thumbnails, with padding, a bold text overlay and your logo. Free, runs in your browser.",
  alternates: { canonical: "/tools/social-image-resizer" },
};

export default function Page() {
  return (
    <ToolLayout
      slug="social-image-resizer"
      wide
      title={<>Social image resizer <em>with text overlay</em></>}
      intro={<>One photo in, every platform&apos;s size out: link previews, Pinterest pins, Instagram, TikTok and Shorts covers, and YouTube thumbnails, with big readable text and your logo.</>}
      privacyNote="Your photos are processed in your browser and never leave your computer."
      steps={[
        { title: "Drop in a photo", body: "A product shot, job photo or a still from your video." },
        { title: "Pick a size", body: "Each platform crops differently. Use 'Fit with padding' for link previews of small products, so the piece isn't cut off." },
        { title: "Add text and your logo", body: "A few big words help people decide to click, especially on Pinterest pins and video covers." },
        { title: "Download", body: "Get the size you're on, or every size in one zip." },
      ]}
      faqs={[
        faq("What size is an Open Graph image?", "1200 × 630 pixels. It's the picture shown when your page is shared on Facebook, LinkedIn, WhatsApp, Slack and X. Add it to your page with the og:image tag."),
        faq("What size is a Pinterest pin?", "Pinterest recommends a 2:3 portrait image, such as 1000 × 1500 pixels. Taller pins take up more of the feed, and a short text overlay tells people what they'll get."),
        faq("What size is a TikTok or YouTube Shorts cover?", "1080 × 1920 pixels (9:16). Keep text in the middle of the image, as the edges are covered by buttons and captions."),
        faq("What size is a YouTube thumbnail?", "1280 × 720 pixels, under 2 MB. Big, high-contrast text and a clear subject get more clicks at small sizes."),
        faq("Are my images uploaded anywhere?", "No. Everything is drawn in your browser, so your photos never leave your computer."),
      ]}
    >
      <SocialImageResizer />
    </ToolLayout>
  );
}
