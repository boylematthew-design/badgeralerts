import ToolLayout, { faq } from "@/components/tools/ToolLayout";
import FaviconGenerator from "@/components/tools/favicon-generator/FaviconGenerator";

export const metadata = {
  title: "Free favicon generator from your logo | Compounding Wins",
  description:
    "Turn your logo into favicon.ico, Apple touch icon, Android icons and a web manifest, plus the HTML tags to add them. Free, runs in your browser, nothing uploaded.",
  alternates: { canonical: "/tools/favicon-generator" },
};

export default function Page() {
  return (
    <ToolLayout
      slug="favicon-generator"
      title={<>Favicon generator <em>from your logo</em></>}
      intro={<>Turn your logo into every favicon file browsers, phones and Google ask for, with the HTML tags to add them to your site.</>}
      privacyNote="Your logo is processed in your browser and never leaves your computer."
      steps={[
        { title: "Drop in your logo", body: "A square PNG or SVG, ideally at least 512 × 512px. A simple icon or initial works better than a full wordmark at small sizes." },
        { title: "Check the small sizes", body: "The 16px preview is how it looks in a browser tab. Add padding or a background colour until it's clear." },
        { title: "Download and upload", body: "Put the files in the top folder of your site and paste the tags into the page head, or upload the 512px icon in your site builder's settings." },
      ]}
      faqs={[
        faq("What is a favicon?", "The small icon shown in browser tabs, bookmarks and next to your site in Google's mobile results. A clear favicon makes your result easier to recognise and click."),
        faq("What sizes do I need?", "A favicon.ico (16, 32 and 48px inside one file), 32px and 16px PNGs, a 180px Apple touch icon, and 192px and 512px icons for Android. This tool makes all of them."),
        faq("Why isn't my favicon showing in Google?", "Google needs the favicon to be at least 48 × 48px, linked from your homepage and allowed by robots.txt. It can take a few weeks to update after a change."),
        faq("Is my logo uploaded anywhere?", "No. Everything is drawn in your browser."),
      ]}
    >
      <FaviconGenerator />
    </ToolLayout>
  );
}
