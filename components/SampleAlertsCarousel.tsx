"use client";

import { useRef, useState, useCallback } from "react";
import {
  CompetitorScanImage,
  EmailAlertImage,
  CampaignSetupImage,
  SeoScanImage,
  SeoEmailImage,
  SeoReportImage,
  TechScanImage,
  TechEmailImage,
  TechFixGuideImage,
  PaidMediaScanImage,
  PaidMediaEmailImage,
  PaidMediaDashboardImage,
} from "@/components/SampleIllustrations";

const SLIDES = [
  {
    id: "local-ads",
    titleLine1: "Local",
    titleLine2: "competitor alerts",
    intro:
      "Here's exactly what happens the moment a close competitor changes their game — and how we hand it straight to you.",
    steps: [
      {
        body: "Our tool scans your competitor websites and picks up that a close competitor is running new local ads.",
        caption: "Competitor scan",
        Image: CompetitorScanImage,
      },
      {
        body: "You're sent an alert notifying you about the new update — straight to your inbox.",
        caption: "Email alert",
        Image: EmailAlertImage,
      },
      {
        body: "You deep-dive into what ads are being run and how to set up your own local ad campaign.",
        caption: "Action breakdown",
        Image: CampaignSetupImage,
      },
    ],
  },
  {
    id: "seo",
    titleLine1: "SEO",
    titleLine2: "suggestions",
    intro:
      "We watch what your customers are searching for — and tell you exactly which pages to build to win them.",
    steps: [
      {
        body: "Our tool scans your site and industry and recommends high-intent pages you can build to bring in traffic and conversions.",
        caption: "Content scan",
        Image: SeoScanImage,
      },
      {
        body: "We send you an alert with a clear recommendation of what to build next.",
        caption: "Email alert",
        Image: SeoEmailImage,
      },
      {
        body: "We share an in-depth report with detailed analysis and help you set it up — outline, keywords, the lot.",
        caption: "Detailed report",
        Image: SeoReportImage,
      },
    ],
  },
  {
    id: "tech-audit",
    titleLine1: "Technical",
    titleLine2: "audits",
    intro:
      "We keep a constant eye on the technical health of your site — and tell you the moment something needs your attention.",
    steps: [
      {
        body: "Our tool scans your site and flags common errors and issues, alerting you straight away.",
        caption: "Site crawl",
        Image: TechScanImage,
      },
      {
        body: "We email you the moment we find something that needs flagging with you.",
        caption: "Email alert",
        Image: TechEmailImage,
      },
      {
        body: "We explain the issue in full and recommend a fix to help you improve site performance.",
        caption: "Fix guide",
        Image: TechFixGuideImage,
      },
    ],
  },
  {
    id: "paid-media",
    titleLine1: "Paid media",
    titleLine2: "suggestions",
    intro:
      "We watch what your competitors are spending money on — so you can spot the ad opportunities they're winning, before they get away.",
    steps: [
      {
        body: "We scan your competitors and find out if any of them are running paid media campaigns you should know about.",
        caption: "Competitor ads",
        Image: PaidMediaScanImage,
      },
      {
        body: "We email you the moment we spot something — with the keywords they're bidding on and what it's likely costing them.",
        caption: "Email alert",
        Image: PaidMediaEmailImage,
      },
      {
        body: "We walk you through how to set up your own campaign on a sensible budget — and offer to help you launch it.",
        caption: "Suggested campaign",
        Image: PaidMediaDashboardImage,
      },
    ],
  },
];

export default function SampleAlertsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const total = SLIDES.length;

  const goTo = useCallback(
    (i: number) => {
      const clamped = (i + total) % total;
      setIndex(clamped);
      const track = trackRef.current;
      if (track) {
        const slide = track.children[clamped] as HTMLElement;
        if (slide) track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
      }
    },
    [total]
  );

  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const i = Math.round(track.scrollLeft / track.clientWidth);
    if (i !== index) setIndex(i);
  }, [index]);

  return (
    <section className="max-w-[1120px] mx-auto px-7 md:px-12 my-16 md:my-20">
      {/* Label */}
      <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-6">
        Sample alerts
      </div>

      <div className="relative overflow-hidden">
        {/* Prev / Next arrows */}
        <div className="absolute top-0 right-0 flex gap-2 z-10">
          <button
            type="button"
            aria-label="Previous alert"
            onClick={() => goTo(index - 1)}
            className="w-11 h-11 rounded-full bg-white border border-border text-ink flex items-center justify-center transition-all hover:bg-ink hover:border-ink hover:text-white active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next alert"
            onClick={() => goTo(index + 1)}
            className="w-11 h-11 rounded-full bg-white border border-border text-ink flex items-center justify-center transition-all hover:bg-ink hover:border-ink hover:text-white active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Scroll track */}
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {SLIDES.map((slide) => (
            <article
              key={slide.id}
              className="flex-none w-full snap-start snap-always min-w-0"
              aria-roledescription="slide"
            >
              {/* Slide header — leave room for the arrows top-right */}
              <div className="mb-9 max-w-2xl pr-28">
                <h2 className="font-serif font-normal text-[28px] sm:text-[36px] md:text-[40px] leading-[1.1] tracking-[-0.01em] mb-3.5">
                  {slide.titleLine1}{" "}
                  <em className="italic text-accent-dark">{slide.titleLine2}</em>
                </h2>
                <p className="text-[15px] md:text-[16px] text-mid font-light leading-[1.6] max-w-[560px]">
                  {slide.intro}
                </p>
              </div>

              {/* 3-step timeline */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                {slide.steps.map((step, i) => (
                  <div key={i} className="flex flex-col min-w-0">
                    {/* Step number + dashed connector */}
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="w-8 h-8 rounded-full bg-ink text-white text-[13px] font-medium flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </div>
                      {i < slide.steps.length - 1 && (
                        <div
                          className="flex-1 h-px hidden md:block"
                          style={{
                            backgroundImage:
                              "linear-gradient(to right, #E8E7E2 50%, transparent 0)",
                            backgroundSize: "8px 1px",
                            backgroundRepeat: "repeat-x",
                          }}
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    {/* Step copy */}
                    <p className="text-[14.5px] text-mid font-light leading-[1.6] mb-5 max-w-xs">
                      {step.body}
                    </p>

                    {/* Illustration */}
                    <div className="relative aspect-[4/3] rounded-[14px] bg-surface border border-border overflow-hidden">
                      <step.Image />
                      <span className="absolute bottom-3 left-3 inline-flex items-center font-mono text-[11px] tracking-[0.04em] text-muted bg-white border border-border rounded-full px-2.5 py-1 z-10">
                        {step.caption}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Dot pagination */}
      <div className="flex justify-center gap-2 mt-9" role="tablist" aria-label="Sample alert pages">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show alert ${i + 1} of ${total}`}
            onClick={() => goTo(i)}
            className={`h-1 rounded-full border-none transition-all ${
              i === index ? "w-9 bg-ink" : "w-7 bg-border hover:bg-muted"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
