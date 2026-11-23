// Serves the IndexNow key as plain text. Reached at /{INDEXNOW_KEY}.txt through the rewrite in
// next.config.ts; IndexNow fetches that file to confirm we own the site (see lib/indexnow.ts).
export function GET() {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return new Response("Not found", { status: 404 });
  return new Response(key, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
