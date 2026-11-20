import ToolLayout, { faq } from "@/components/tools/ToolLayout";
import ImageSeoPrep from "@/components/tools/image-seo-prep/ImageSeoPrep";

export const metadata = {
  title: "Free image SEO tool: rename, compress & add alt text | Compounding Wins",
  description:
    "Batch rename photos to descriptive SEO file names, resize and compress them, check they're big enough for zoom, and write alt text. Runs in your browser, nothing is uploaded.",
  alternates: { canonical: "/tools/image-seo-prep" },
};

export default function Page() {
  return (
    <ToolLayout
      slug="image-seo-prep"
      title={<>Image SEO: rename, compress <em>&amp; alt text</em></>}
      intro={<>Drop in your photos and get them back with descriptive file names, compressed and resized for the web, checked for zoom, with alt text ready to paste in.</>}
      privacyNote="Your photos are processed in your browser and never leave your computer."
      steps={[
        { title: "Drop in your photos", body: "Job photos, product shots, anything going on your website or a marketplace listing." },
        { title: "Give them proper names", body: "Type what's in the photo and where, like 'boiler repair leeds', and every file is renamed boiler-repair-leeds-1.jpg and so on. Google reads file names, but IMG_4821.jpg tells it nothing." },
        { title: "Write the alt text", body: "Describe each photo as you would to someone who can't see it. It's read by screen readers and by Google Images." },
        { title: "Download the zip", body: "You get the compressed images, an alt-text list, and full-size zoom versions if you need them." },
      ]}
      faqs={[
        faq("Why do image file names matter for SEO?", "Search engines use the file name as a clue to what an image shows. A descriptive name such as oval-diamond-engagement-ring.jpg can help the image appear in Google Images and supports the page it's on."),
        faq("What size should website images be?", "For most websites, around 1,600px wide is plenty, compressed to a few hundred KB. Big uncompressed photos are one of the most common reasons pages load slowly, especially on phones."),
        faq("How big do images need to be for zoom?", "Amazon enables zoom when the longest side is at least 1,000px. For close-up products such as jewellery, 2,000px or more lets shoppers see the detail."),
        faq("Should I use JPG or WebP?", "WebP files are smaller at the same quality and every modern browser supports them, so they're great for your website. Use JPG for marketplaces and anywhere that might not accept WebP."),
        faq("Are my photos uploaded anywhere?", "No. Everything happens in your browser using your computer's own processing, so the photos never leave your device."),
      ]}
    >
      <ImageSeoPrep />
    </ToolLayout>
  );
}
