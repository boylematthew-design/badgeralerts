// IndexNow: tells Bing (and Yandex, Seznam, Naver…, which share submissions) the moment a public page
// is created, updated or removed, instead of waiting for them to recrawl. Bing's index also feeds
// ChatGPT search and Copilot, so fresh guides reach AI answers sooner.
//
// The key lives in the INDEXNOW_KEY env var and is served at /{key}.txt (see next.config.ts), which
// proves to IndexNow that we own the site. The key is public by design: it only lets someone *suggest*
// URLs on this domain for crawling, never change anything.
//
// Submissions are fire-and-forget: they run after the admin's save has responded (Next's after()),
// so a slow or failed ping can never block or break a save. Failures are only logged.

import { after } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { guidePath } from "./blog-guides";

export const SITE_HOST = "www.compoundingwins.com";
const SITE_URL = `https://${SITE_HOST}`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

// Sends full URLs or site paths ("/blog/local-seo") to IndexNow. Skips quietly when there's no key or
// outside production (local dev and Vercel previews must not ping for the live site).
export async function submitToIndexNow(urlsOrPaths: string[]): Promise<void> {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return;
  const isProduction = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : process.env.INDEXNOW_FORCE === "1";
  if (!isProduction) return;

  const urlList = [...new Set(urlsOrPaths.map((u) => (u.startsWith("http") ? u : `${SITE_URL}${u}`)))].filter((u) =>
    u.startsWith(`${SITE_URL}/`)
  );
  if (urlList.length === 0) return;

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: SITE_HOST, key, keyLocation: `${SITE_URL}/${key}.txt`, urlList }),
      signal: AbortSignal.timeout(10_000),
    });
    // 200 = accepted, 202 = accepted, key check pending. Anything else is worth a log line.
    if (res.status !== 200 && res.status !== 202) {
      console.error(`[indexnow] ${res.status} ${res.statusText} for ${urlList.length} URL(s): ${await res.text().catch(() => "")}`);
    }
  } catch (err) {
    console.error(`[indexnow] request failed for ${urlList.length} URL(s):`, err);
  }
}

// Schedules a submission to run after the current request has responded. Use from server actions.
export function queueIndexNow(urlsOrPaths: string[]) {
  after(() => submitToIndexNow(urlsOrPaths));
}

// The public address(es) of a guide, or [] if it isn't a live guide on this site. Call it *before*
// deleting a guide, as the address can't be worked out afterwards.
export async function guideUrls(guideId: string): Promise<string[]> {
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: guide } = await admin
    .from("guides")
    .select("id, slug, parent_id, published, site")
    .eq("id", guideId)
    .single();
  if (!guide || !guide.published || guide.site !== "badgeralerts") return [];

  const { data: parent } = guide.parent_id
    ? await admin.from("guides").select("id, slug, parent_id, published").eq("id", guide.parent_id).single()
    : { data: null };
  const liveParent = parent?.published ? [parent] : [];
  return [guidePath(guide, [guide, ...liveParent])];
}

// A guide's content changed (tip added, edited, deleted or reordered; section changed). The lookup
// also runs after the response, so the save isn't held up by it. `extra` adds other pages to submit,
// e.g. "/blog" when the list of guides changes, or a guide's old address after a rename.
export function queueGuideChanged(guideId: string, extra: string[] = []) {
  after(async () => {
    try {
      await submitToIndexNow([...(await guideUrls(guideId)), ...extra]);
    } catch (err) {
      console.error("[indexnow] couldn't look up guide", guideId, err);
    }
  });
}
