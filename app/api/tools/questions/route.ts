import { NextResponse } from "next/server";
import { rateLimited } from "@/lib/safe-fetch";

// Question & topic finder: expands a seed phrase with question words and a–z, and collects
// Google (or YouTube) autocomplete suggestions for the UK. Uses Google's public autocomplete
// endpoint, which is unofficial, so it's called gently (a few at a time) and cached, and
// visitors are rate limited so our server isn't blocked.

export const runtime = "nodejs";
export const maxDuration = 30;

const PREFIXES = ["what", "how", "why", "when", "where", "which", "who", "can", "does", "is", "should", "best", "cost of", "how much"];
const SUFFIXES = ["cost", "near me", "vs", "for", "without", "price", "uk", "reviews", "how long", "worth it"];
const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

const cache = new Map<string, { at: number; data: unknown }>();
const DAY = 24 * 60 * 60 * 1000;

async function suggest(q: string, yt: boolean): Promise<string[]> {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=en-GB&gl=uk&ie=utf-8&oe=utf-8${yt ? "&ds=yt" : ""}&q=${encodeURIComponent(q)}`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    const data = (await res.json()) as [string, string[]];
    return Array.isArray(data?.[1]) ? data[1] : [];
  } catch {
    return [];
  }
}

async function inBatches<T, R>(items: T[], size: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += size) out.push(...(await Promise.all(items.slice(i, i + size).map(fn))));
  return out;
}

export async function POST(request: Request) {
  let body: { q?: unknown; source?: unknown; letters?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const seed = typeof body.q === "string" ? body.q.trim().toLowerCase().replace(/\s+/g, " ") : "";
  if (!seed || seed.length > 80) return NextResponse.json({ error: "Enter a topic of up to 80 characters." }, { status: 400 });
  const yt = body.source === "youtube";
  const letters = body.letters === true;

  const key = `${yt ? "yt" : "g"}:${letters ? 1 : 0}:${seed}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < DAY) return NextResponse.json(hit.data);

  if (rateLimited(request, "questions", 10, 10 * 60_000)) {
    return NextResponse.json({ error: "You've run a lot of searches in a short time. Please wait a few minutes." }, { status: 429 });
  }

  const queries = [
    { q: seed, group: "Searches" },
    ...PREFIXES.map((p) => ({ q: `${p} ${seed}`, group: "Questions" })),
    ...SUFFIXES.map((s) => ({ q: `${seed} ${s}`, group: "Searches" })),
    ...(letters ? LETTERS.map((l) => ({ q: `${seed} ${l}`, group: "Searches" })) : []),
  ];
  const results = await inBatches(queries, 6, async ({ q, group }) => ({ q, group, list: await suggest(q, yt) }));

  const seen = new Map<string, { phrase: string; from: string; type: "question" | "long" | "phrase" }>();
  for (const r of results) {
    for (const s of r.list) {
      const phrase = s.toLowerCase().trim();
      if (!phrase || seen.has(phrase) || phrase === seed) continue;
      const isQ = /^(what|how|why|when|where|which|who|can|could|does|do|is|are|should|will|would)\b/.test(phrase) || phrase.endsWith("?");
      seen.set(phrase, { phrase, from: r.q, type: isQ ? "question" : phrase.split(" ").length >= 5 ? "long" : "phrase" });
    }
  }
  const empty = results.every((r) => r.list.length === 0);
  const data = empty
    ? { error: "No suggestions came back. Google may be limiting requests right now, so try again in a few minutes." }
    : { seed, source: yt ? "youtube" : "google", results: [...seen.values()] };
  if (!empty) {
    cache.set(key, { at: Date.now(), data });
    if (cache.size > 2000) cache.delete(cache.keys().next().value!);
  }
  return NextResponse.json(data, { status: empty ? 502 : 200 });
}
