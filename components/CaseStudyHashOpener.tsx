"use client";

import { useEffect } from "react";

// Case studies are closed accordions (<details>). When someone arrives from a link like
// /services/local-seo#case-study-gallows-pole, this opens that case study and scrolls to it, so
// they land on the write-up instead of a closed box. Renders nothing.
export default function CaseStudyHashOpener() {
  useEffect(() => {
    function openFromHash() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id.startsWith("case-study-")) return;
      const el = document.getElementById(id);
      if (el instanceof HTMLDetailsElement) {
        el.open = true;
        el.scrollIntoView({ block: "start" });
      }
    }
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return null;
}
