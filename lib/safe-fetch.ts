import "server-only";
import http from "node:http";
import https from "node:https";
import dns from "node:dns";
import net from "node:net";
import zlib from "node:zlib";

// Fetches a URL that a visitor typed in, safely. Without these checks, a tool that "fetches any
// URL" can be pointed at our own server's internal network (SSRF): cloud metadata addresses,
// localhost, private IPs. So:
// - only http/https on the normal web ports
// - the IP address is checked at the moment of connecting (in the DNS lookup the socket uses),
//   so a domain can't pass the check and then switch to an internal address (DNS rebinding)
// - every redirect is followed by hand and checked the same way
// - responses are capped in size and time

export class SafeFetchError extends Error {}

const MAX_REDIRECTS = 5;

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) || // carrier-grade NAT
      (a === 169 && b === 254) || // link-local, incl. cloud metadata 169.254.169.254
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 192 && b === 0) ||
      (a === 198 && (b === 18 || b === 19))
    );
  }
  const v6 = ip.toLowerCase();
  if (v6.startsWith("::ffff:")) return isPrivateIp(v6.slice(7));
  return v6 === "::" || v6 === "::1" || v6.startsWith("fc") || v6.startsWith("fd") || v6.startsWith("fe8") || v6.startsWith("fe9") || v6.startsWith("fea") || v6.startsWith("feb") || v6.startsWith("ff");
}

// DNS lookup used by the socket itself: refuses to connect to any private address.
const safeLookup: net.LookupFunction = (hostname, options, callback) => {
  dns.lookup(hostname, { ...options, all: true }, (err, addresses) => {
    if (err) return callback(err, "", 4);
    const list = addresses as dns.LookupAddress[];
    if (!list.length || list.some((a) => isPrivateIp(a.address))) {
      return callback(new SafeFetchError("That address points to a private network, so it can't be checked."), "", 4);
    }
    if ((options as dns.LookupOptions).all) return (callback as unknown as (e: null, a: dns.LookupAddress[]) => void)(null, list);
    callback(null, list[0].address, list[0].family);
  });
};

export function checkPublicUrl(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new SafeFetchError("That isn't a valid web address.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new SafeFetchError("Only http and https addresses can be checked.");
  if (url.port && url.port !== "80" && url.port !== "443") throw new SafeFetchError("Only standard web ports can be checked.");
  if (url.username || url.password) throw new SafeFetchError("Addresses with a username or password can't be checked.");
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (net.isIP(host) && isPrivateIp(host)) throw new SafeFetchError("That address points to a private network, so it can't be checked.");
  if (/^(localhost|.*\.local|.*\.internal|.*\.localhost)$/i.test(host)) throw new SafeFetchError("That address points to a private network, so it can't be checked.");
  return url;
}

export interface SafeResponse {
  url: string; // final URL after redirects
  status: number;
  headers: http.IncomingHttpHeaders;
  body: string;
  redirects: { url: string; status: number }[];
  timeMs: number;
  bytes: number;
  truncated: boolean;
}

function requestOnce(url: URL, userAgent: string, maxBytes: number, timeoutMs: number, method: "GET" | "HEAD"): Promise<Omit<SafeResponse, "redirects" | "url" | "timeMs">> {
  return new Promise((resolve, reject) => {
    const lib = url.protocol === "https:" ? https : http;
    const req = lib.request(
      url,
      {
        method,
        lookup: safeLookup,
        headers: { "User-Agent": userAgent, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5", "Accept-Encoding": "gzip, deflate, br", "Accept-Language": "en-GB,en;q=0.9" },
        timeout: timeoutMs,
      },
      (res) => {
        const enc = String(res.headers["content-encoding"] ?? "").toLowerCase();
        let stream: NodeJS.ReadableStream = res;
        if (enc.includes("br")) stream = res.pipe(zlib.createBrotliDecompress());
        else if (enc.includes("gzip")) stream = res.pipe(zlib.createGunzip());
        else if (enc.includes("deflate")) stream = res.pipe(zlib.createInflate());
        const chunks: Buffer[] = [];
        let bytes = 0;
        let truncated = false;
        stream.on("data", (c: Buffer) => {
          if (truncated) return;
          bytes += c.length;
          if (bytes > maxBytes) {
            truncated = true;
            chunks.push(c.subarray(0, Math.max(0, maxBytes - (bytes - c.length))));
            res.destroy();
            done();
            return;
          }
          chunks.push(c);
        });
        let finished = false;
        const done = () => {
          if (finished) return;
          finished = true;
          resolve({ status: res.statusCode ?? 0, headers: res.headers, body: Buffer.concat(chunks).toString("utf8"), bytes, truncated });
        };
        stream.on("end", done);
        stream.on("error", (e) => (truncated ? done() : reject(e)));
      }
    );
    req.on("timeout", () => req.destroy(new SafeFetchError("The site took too long to respond.")));
    req.on("error", reject);
    req.end();
  });
}

export async function safeFetch(
  raw: string,
  { userAgent = "Mozilla/5.0 (compatible; CompoundingWinsTools/1.0; +https://www.compoundingwins.com/tools)", maxBytes = 3_000_000, timeoutMs = 10_000, method = "GET" as "GET" | "HEAD" } = {}
): Promise<SafeResponse> {
  const started = Date.now();
  let url = checkPublicUrl(raw);
  const redirects: { url: string; status: number }[] = [];
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    let res;
    try {
      res = await requestOnce(url, userAgent, maxBytes, timeoutMs, method);
    } catch (e) {
      if (e instanceof SafeFetchError) throw e;
      const code = (e as NodeJS.ErrnoException).code;
      if (code === "ENOTFOUND") throw new SafeFetchError("That domain doesn't exist or has no DNS records.");
      if (code === "ECONNREFUSED") throw new SafeFetchError("The server refused the connection.");
      if (code === "CERT_HAS_EXPIRED" || code?.startsWith("ERR_TLS") || code?.includes("CERT")) throw new SafeFetchError("The site's security certificate isn't valid.");
      throw new SafeFetchError("The site couldn't be reached.");
    }
    if (res.status >= 300 && res.status < 400 && res.headers.location) {
      redirects.push({ url: url.toString(), status: res.status });
      url = checkPublicUrl(new URL(String(res.headers.location), url).toString());
      continue;
    }
    return { ...res, url: url.toString(), redirects, timeMs: Date.now() - started };
  }
  throw new SafeFetchError("Too many redirects.");
}

// Basic per-visitor rate limit, kept in memory. Serverless instances don't share memory, so this
// slows down casual abuse rather than stopping a determined attacker; Vercel's firewall rate
// limiting is the next step if a tool gets hammered.
const hits = new Map<string, number[]>();
export function rateLimited(request: Request, key: string, limit: number, windowMs: number): boolean {
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
  const id = `${key}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(id) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(id, recent);
    return true;
  }
  recent.push(now);
  hits.set(id, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return false;
}
