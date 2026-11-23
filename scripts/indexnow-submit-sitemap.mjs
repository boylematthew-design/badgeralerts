// One-off: submit every URL in the live sitemap to IndexNow.
// Run it after a deploy that changes code-based pages (tools, services, about...), or once at setup:
//   npm run indexnow:sitemap
// It reads INDEXNOW_KEY from .env.local (or the environment), checks the key file is live first
// (IndexNow rejects submissions it can't verify), then sends all URLs in one request.

import fs from "node:fs";

const HOST = "www.compoundingwins.com";
const SITE = `https://${HOST}`;

function readKey() {
  if (process.env.INDEXNOW_KEY) return process.env.INDEXNOW_KEY;
  const line = fs.existsSync(".env.local")
    ? fs.readFileSync(".env.local", "utf8").split(/\r?\n/).find((l) => l.startsWith("INDEXNOW_KEY="))
    : undefined;
  return line?.slice("INDEXNOW_KEY=".length).trim().replace(/^["']|["']$/g, "");
}

const key = readKey();
if (!key || !/^[a-f0-9]{32}$/.test(key)) {
  console.error("INDEXNOW_KEY is missing or isn't a 32-character hex key.");
  process.exit(1);
}

const keyLocation = `${SITE}/${key}.txt`;
const keyRes = await fetch(keyLocation);
const keyBody = (await keyRes.text()).trim();
if (!keyRes.ok || keyBody !== key) {
  console.error(`Key file isn't live yet (${keyRes.status}) at ${keyLocation}. Add INDEXNOW_KEY in Vercel and redeploy first.`);
  process.exit(1);
}

const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()).filter((u) => u.startsWith(`${SITE}/`) || u === SITE);
if (urlList.length === 0) {
  console.error("No URLs found in the sitemap.");
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key, keyLocation, urlList }),
});
const detail = await res.text();
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urlList.length} URLs${detail ? ` — ${detail}` : ""}`);
// 200 = accepted. 202 = accepted, key verification pending (normal the first time).
process.exit(res.status === 200 || res.status === 202 ? 0 : 1);
