import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";

export const metadata = {
  title: "Consulting | Compounding Wins",
  description:
    "One-to-one digital marketing consulting with Matthew Boyle — strategy sessions and ongoing support for ambitious business owners.",
};

export default function ConsultingPage() {
  return (
    <div className="bg-paper text-ink">
      <Navbar />
      <PageHero
        eyebrow="Consulting"
        title={<>Straight-talking advice,{" "} <em>one-to-one</em></>}
        intro={<>Sometimes you don&apos;t need an agency — you need someone to sit down with you, look at what you&apos;ve got, and tell you honestly what to do next. That&apos;s what consulting with me looks like.</>}
        width="max-w-[820px]"
      />
      <main className="max-w-[820px] mx-auto px-7 md:px-12 py-14 md:py-20">

        <div className="border border-border rounded-[20px] px-8 md:px-10 py-8 mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <Image
              src="/matthew-boyle.png"
              alt="Matthew Boyle"
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
            <div>
              <p className="text-[14px] font-medium text-ink">Matthew Boyle</p>
              <p className="text-[13px] text-muted">Digital Marketing Consultant &middot; ~20 years experience</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 text-[14px] text-mid leading-[1.75]">
            <p>
              Whether it&apos;s a one-off strategy session to unblock a specific problem, or
              ongoing monthly support as an extra pair of expert eyes on your marketing — I tailor
              consulting around what you actually need, not a fixed package.
            </p>
            <p>
              Get in touch with a bit of background on your business and what you&apos;re trying
              to achieve, and I&apos;ll come back to you with how I can help.
            </p>
          </div>
        </div>
      </main>
      <CtaBand
        title={<>Let&apos;s talk about your business</>}
        body={<>Book a consultation and get clear, practical advice.</>}
        href="/contact"
        label="Work with me"
      />
      <Footer />
    </div>
  );
}
