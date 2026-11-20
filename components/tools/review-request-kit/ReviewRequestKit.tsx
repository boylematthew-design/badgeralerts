"use client";

import { useMemo, useState } from "react";
import QRCode from "qrcode";
import { CopyButton, downloadText, esc, toCsv, useAsyncValue, useSavedState } from "../shared";
import { btn, btnGhost, btnSmall, card, errorBox, h2, h3, hint, input, label, tabBtn, textarea } from "../ui";

// Review request kit: builds a direct Google review link from a Place ID, keeps links for other
// review sites, writes request messages, prints QR cards, and logs who has been asked.
// Everything (including the customer list) is saved in this browser's localStorage only.

const STORE = "cw-review-kit-v1";

const PLATFORMS = [
  { id: "google", name: "Google" },
  { id: "trustpilot", name: "Trustpilot" },
  { id: "checkatrade", name: "Checkatrade" },
  { id: "facebook", name: "Facebook" },
  { id: "yelp", name: "Yelp" },
  { id: "tripadvisor", name: "Tripadvisor" },
] as const;
type PlatformId = (typeof PLATFORMS)[number]["id"];

interface Customer {
  id: string;
  name: string;
  contact: string;
  askedOn: string; // YYYY-MM-DD, or "" if not asked yet
  platform: PlatformId;
}

interface Saved {
  business: string;
  placeInput: string;
  links: Partial<Record<PlatformId, string>>;
  customers: Customer[];
}

const EMPTY: Saved = { business: "", placeInput: "", links: {}, customers: [] };

// Accepts a bare Place ID, a writereview link, or any review link the person already has.
export function googleReviewLink(raw: string): { url: string; error?: string } {
  const value = raw.trim();
  if (!value) return { url: "" };
  if (/^https?:\/\//i.test(value)) {
    try {
      const u = new URL(value);
      const pid = u.searchParams.get("placeid") || u.searchParams.get("place_id");
      if (pid) return { url: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(pid)}` };
      if (/(^|\.)g\.page$|google\.[a-z.]+$|goo\.gl$/i.test(u.hostname)) return { url: u.toString() };
      return { url: "", error: "That link doesn't look like a Google link. Paste your Place ID or the review link from your Business Profile." };
    } catch {
      return { url: "", error: "That link isn't valid." };
    }
  }
  if (/^[A-Za-z0-9_-]{20,}$/.test(value)) {
    return { url: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(value)}` };
  }
  return { url: "", error: "A Place ID is one long code with no spaces, usually starting ChIJ. Use Google's Place ID Finder (linked below) to get yours." };
}

const TEMPLATES = [
  {
    id: "after",
    name: "Straight after a job or visit",
    text: (b: string, n: string, link: string) =>
      `Hi ${n}, thanks for choosing ${b}. If you have a minute, a review would really help us. It's most useful if you mention what we did for you and what stood out, and a photo is a big bonus:\n${link}\nThank you!`,
  },
  {
    id: "detail",
    name: "Ask for a detailed review",
    text: (b: string, n: string, link: string) =>
      `Hi ${n}, it was great working with you. Would you leave ${b} a short review? A few prompts if helpful: what did you need, how did it go, and would you recommend us to a friend? Photos are welcome too.\n${link}`,
  },
  {
    id: "past",
    name: "Past customers",
    text: (b: string, n: string, link: string) =>
      `Hi ${n}, this is ${b}. We're asking customers we've helped for an honest review. If you were happy with what we did, it would mean a lot:\n${link}\nThanks either way.`,
  },
  {
    id: "friends",
    name: "Friends and family who have used you",
    text: (b: string, n: string, link: string) =>
      `Hi ${n}! You're one of the first people to use ${b}, so a review would be a huge help getting us started. Just say honestly what we did for you:\n${link}`,
  },
];

const today = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 10);

export default function ReviewRequestKit() {
  const [data, setData] = useSavedState<Saved>(STORE, EMPTY);
  const [platform, setPlatform] = useState<PlatformId>("google");
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const [previewName, setPreviewName] = useState("Sam");
  const [pasteList, setPasteList] = useState("");

  const google = googleReviewLink(data.placeInput);
  const linkFor = (p: PlatformId) => (p === "google" ? google.url : (data.links[p] ?? "").trim());
  const activeLink = linkFor(platform);
  const business = data.business.trim() || "us";
  const template = TEMPLATES.find((t) => t.id === templateId)!;
  const message = template.text(business, previewName.trim() || "there", activeLink || "[your review link]");

  const qr = useAsyncValue(activeLink, (link) =>
    QRCode.toDataURL(link, { margin: 1, width: 480, color: { dark: "#0E1A14", light: "#FFFFFF" } })
  ) ?? "";

  const update = (patch: Partial<Saved>) => setData((d) => ({ ...d, ...patch }));

  const addCustomers = () => {
    const rows = pasteList
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const [name, ...rest] = l.split(/[,\t]/);
        return { id: uid(), name: name.trim(), contact: rest.join(",").trim(), askedOn: "", platform } as Customer;
      });
    update({ customers: [...data.customers, ...rows] });
    setPasteList("");
  };

  const markAsked = (c: Customer) =>
    update({ customers: data.customers.map((x) => (x.id === c.id ? { ...x, askedOn: today(), platform } : x)) });

  // Requests per month for the last 6 months, so a drop-off is easy to spot.
  const months = useMemo(() => {
    const out: { key: string; label: string; count: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      out.push({ key, label: d.toLocaleString("en-GB", { month: "short" }), count: 0 });
    }
    for (const c of data.customers) {
      const m = out.find((o) => c.askedOn.startsWith(o.key));
      if (m) m.count++;
    }
    return out;
  }, [data.customers]);
  const maxMonth = Math.max(1, ...months.map((m) => m.count));
  const askedToday = data.customers.filter((c) => c.askedOn === today()).length;

  const sendLinks = (c: Customer | null) => {
    const name = c?.name.split(" ")[0] || previewName.trim() || "there";
    const text = template.text(business, name, activeLink);
    const contact = c?.contact ?? "";
    const phone = contact.replace(/[^\d+]/g, "");
    const isEmail = contact.includes("@");
    return {
      whatsapp: `https://wa.me/${phone.replace(/^\+/, "").replace(/^0/, "44")}?text=${encodeURIComponent(text)}`,
      sms: `sms:${isEmail ? "" : phone}?&body=${encodeURIComponent(text)}`,
      email: `mailto:${isEmail ? contact : ""}?subject=${encodeURIComponent(`Would you review ${business}?`)}&body=${encodeURIComponent(text)}`,
    };
  };

  const printCards = (kind: "table" | "sticker" | "till") => {
    if (!qr) return;
    const sizes = { table: { w: "90mm", h: "120mm", n: 4, q: "55mm" }, sticker: { w: "60mm", h: "60mm", n: 12, q: "36mm" }, till: { w: "85mm", h: "55mm", n: 8, q: "36mm" } }[kind];
    const platformName = PLATFORMS.find((p) => p.id === platform)!.name;
    const cardHtml = `<div class="c"><p class="t">Enjoyed ${esc(business === "us" ? "your visit" : business)}?</p><img src="${qr}" alt="QR code to leave a review"><p class="s">Scan to leave us a ${esc(platformName)} review</p></div>`;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!doctype html><html><head><title>Review QR cards</title><style>
      @page{margin:10mm}body{font-family:Arial,sans-serif;margin:0;display:flex;flex-wrap:wrap;gap:6mm}
      .c{width:${sizes.w};height:${sizes.h};border:1px dashed #999;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:4mm;page-break-inside:avoid}
      img{width:${sizes.q};height:${sizes.q}}.t{font-weight:800;font-size:${kind === "sticker" ? "10pt" : "15pt"};margin:0 0 3mm}.s{font-size:${kind === "sticker" ? "8pt" : "11pt"};margin:3mm 0 0}
      </style></head><body>${Array(sizes.n).fill(cardHtml).join("")}<script>window.onload=()=>setTimeout(()=>window.print(),300)</script></body></html>`);
    w.document.close();
  };

  return (
    <div className="space-y-6">
      {/* 1. Links */}
      <section className={card} aria-labelledby="rk-links">
        <h2 id="rk-links" className={h2}>1. Your review links</h2>
        <div className="grid gap-4 mt-5">
          <div>
            <label className={label} htmlFor="rk-business">Business name</label>
            <input id="rk-business" className={input} value={data.business} onChange={(e) => update({ business: e.target.value })} placeholder="e.g. Leeds Plumbing Co" />
          </div>
          <div>
            <label className={label} htmlFor="rk-place">Google Place ID or review link</label>
            <input id="rk-place" className={input} value={data.placeInput} onChange={(e) => update({ placeInput: e.target.value })} placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4" />
            <p className={hint}>
              Find your Place ID with{" "}
              <a className="text-accent-dark underline" href="https://developers.google.com/maps/documentation/places/web-service/place-id#find-id" target="_blank" rel="noopener noreferrer">
                Google&apos;s Place ID Finder
              </a>
              , or paste the &ldquo;Ask for reviews&rdquo; link from your Business Profile.
            </p>
            {google.error && <p className={`${errorBox} mt-2`}>{google.error}</p>}
            {google.url && (
              <div className="mt-3 rounded-[10px] bg-accent-light px-3 py-2.5 flex flex-wrap items-center gap-2 justify-between">
                <a href={google.url} target="_blank" rel="noopener noreferrer" className="text-[13px] text-accent-dark underline break-all">{google.url}</a>
                <CopyButton text={google.url} label="Copy link" />
              </div>
            )}
          </div>
          <details className="group">
            <summary className="cursor-pointer text-[14px] font-semibold text-accent-dark">Add other review sites (Trustpilot, Checkatrade, Facebook, Yelp, Tripadvisor)</summary>
            <p className={hint}>ChatGPT, Bing and Apple Maps draw on reviews beyond Google, and Apple Maps shows Yelp and Tripadvisor ratings. Paste each profile&apos;s review link.</p>
            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              {PLATFORMS.filter((p) => p.id !== "google").map((p) => (
                <div key={p.id}>
                  <label className={label} htmlFor={`rk-${p.id}`}>{p.name} review link</label>
                  <input id={`rk-${p.id}`} className={input} value={data.links[p.id] ?? ""} placeholder="https://" onChange={(e) => update({ links: { ...data.links, [p.id]: e.target.value } })} />
                </div>
              ))}
            </div>
          </details>
        </div>
      </section>

      {/* 2. Messages */}
      <section className={card} aria-labelledby="rk-msg">
        <h2 id="rk-msg" className={h2}>2. Your request message</h2>
        <p className="text-[14px] text-mid mt-2">Pick the site to send people to and a message. Asking what they had and what stood out gets you longer, more useful reviews.</p>
        <div className="flex flex-wrap gap-2 mt-4" role="group" aria-label="Review site">
          {PLATFORMS.map((p) => (
            <button key={p.id} type="button" className={tabBtn(platform === p.id)} onClick={() => setPlatform(p.id)} aria-pressed={platform === p.id}>
              {p.name}{!linkFor(p.id) && " (no link yet)"}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          <div>
            <label className={label} htmlFor="rk-template">Message</label>
            <select id="rk-template" className={input} value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
              {TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="rk-name">Customer first name</label>
            <input id="rk-name" className={input} value={previewName} onChange={(e) => setPreviewName(e.target.value)} />
          </div>
        </div>
        <div className="mt-4 rounded-[12px] bg-surface p-4 text-[14.5px] text-ink whitespace-pre-wrap leading-[1.55]">{message}</div>
        <div className="flex flex-wrap gap-2 mt-3">
          <CopyButton text={message} label="Copy message" />
          {activeLink && (
            <>
              <a className={btnSmall} href={sendLinks(null).whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a className={btnSmall} href={sendLinks(null).sms}>Text message</a>
              <a className={btnSmall} href={sendLinks(null).email}>Email</a>
            </>
          )}
        </div>
        <p className={`${hint} mt-3`}>
          Ask every customer, not just the happy ones. Filtering out unhappy customers before asking (review gating) breaks Google&apos;s rules, and so does offering anything in return for a review.
        </p>
      </section>

      {/* 3. QR */}
      <section className={card} aria-labelledby="rk-qr">
        <h2 id="rk-qr" className={h2}>3. QR codes for tables, menus and the till</h2>
        {qr ? (
          <div className="flex flex-col sm:flex-row gap-5 mt-4 items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt={`QR code linking to your ${PLATFORMS.find((p) => p.id === platform)!.name} review page`} className="w-40 h-40 rounded-[8px] border border-border" />
            <div className="space-y-2">
              <p className="text-[14px] text-mid">Links to your {PLATFORMS.find((p) => p.id === platform)!.name} review page. Print a sheet, cut along the dashed lines.</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" className={btnSmall} onClick={() => printCards("table")}>Print table cards</button>
                <button type="button" className={btnSmall} onClick={() => printCards("sticker")}>Print menu stickers</button>
                <button type="button" className={btnSmall} onClick={() => printCards("till")}>Print till cards</button>
                <a className={btnSmall} href={qr} download="review-qr-code.png">Download PNG</a>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-[14px] text-muted mt-3">Add a review link in step 1 to make your QR code.</p>
        )}
      </section>

      {/* 4. Log */}
      <section className={card} aria-labelledby="rk-log">
        <h2 id="rk-log" className={h2}>4. Who you&apos;ve asked</h2>
        <p className="text-[14px] text-mid mt-2">
          Add customers, send each one the message, and tick them off. Saved only in this browser. Export a backup if you clear your browser or switch computers.
        </p>
        <div className="mt-4">
          <label className={label} htmlFor="rk-paste">Add customers, one per line: name, phone or email</label>
          <textarea id="rk-paste" className={textarea} value={pasteList} onChange={(e) => setPasteList(e.target.value)} placeholder={"Sam Patel, 07700 900123\nJo Smith, jo@example.com"} />
          <button type="button" className={`${btn} mt-2`} onClick={addCustomers} disabled={!pasteList.trim()}>Add to list</button>
        </div>

        <div className="mt-6">
          <h3 className={h3}>Requests sent per month</h3>
          <div className="flex items-end gap-2 h-28 mt-3" role="img" aria-label={months.map((m) => `${m.label}: ${m.count}`).join(", ")}>
            {months.map((m) => (
              <div key={m.key} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-[12px] font-semibold text-ink">{m.count}</span>
                <div className="w-full rounded-t-[4px] bg-accent" style={{ height: `${(m.count / maxMonth) * 70}%`, minHeight: m.count ? 4 : 1 }} />
                <span className="text-[11px] text-muted mt-1">{m.label}</span>
              </div>
            ))}
          </div>
          <p className="sr-only">{months.map((m) => `${m.label}: ${m.count} requests`).join(". ")}</p>
          {askedToday >= 10 && (
            <p className={`${hint} mt-2`}>You&apos;ve asked {askedToday} people today. Spreading requests out looks more natural than a burst, which Google&apos;s spam filters can flag.</p>
          )}
        </div>

        {data.customers.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-[14px] min-w-[520px]">
              <thead>
                <tr className="text-left text-[12px] text-muted uppercase tracking-[0.06em]">
                  <th className="py-2 pr-2">Customer</th><th className="py-2 pr-2">Asked</th><th className="py-2 pr-2">Send</th><th className="py-2"><span className="sr-only">Remove</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.customers.map((c) => {
                  const s = sendLinks(c);
                  return (
                    <tr key={c.id}>
                      <td className="py-2.5 pr-2"><span className="font-semibold text-ink">{c.name}</span><br /><span className="text-muted text-[13px]">{c.contact}</span></td>
                      <td className="py-2.5 pr-2 text-mid">{c.askedOn ? `${c.askedOn} (${PLATFORMS.find((p) => p.id === c.platform)?.name})` : "Not yet"}</td>
                      <td className="py-2.5 pr-2">
                        <div className="flex flex-wrap gap-1.5">
                          {activeLink && <>
                            <a className={btnSmall} href={s.whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => markAsked(c)}>WhatsApp</a>
                            <a className={btnSmall} href={s.sms} onClick={() => markAsked(c)}>Text</a>
                            <a className={btnSmall} href={s.email} onClick={() => markAsked(c)}>Email</a>
                          </>}
                          <button type="button" className={btnSmall} onClick={() => markAsked(c)}>Mark asked</button>
                        </div>
                      </td>
                      <td className="py-2.5 text-right">
                        <button type="button" className="text-[13px] text-muted hover:text-danger" onClick={() => update({ customers: data.customers.filter((x) => x.id !== c.id) })}>Remove</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-5">
          <button type="button" className={btnGhost} onClick={() => downloadText("review-requests.csv", toCsv([["Name", "Contact", "Asked on", "Site"], ...data.customers.map((c) => [c.name, c.contact, c.askedOn, c.platform])]), "text/csv")}>Export CSV</button>
          <button type="button" className={btnGhost} onClick={() => downloadText("review-kit-backup.json", JSON.stringify(data, null, 2), "application/json")}>Back up</button>
          <label className={`${btnGhost} cursor-pointer`}>
            Restore backup
            <input type="file" accept="application/json,.json" className="sr-only" onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try {
                const parsed = JSON.parse(await f.text()) as Saved;
                if (Array.isArray(parsed.customers)) setData({ ...EMPTY, ...parsed });
              } catch { /* not a backup file */ }
              e.target.value = "";
            }} />
          </label>
        </div>
      </section>
    </div>
  );
}
