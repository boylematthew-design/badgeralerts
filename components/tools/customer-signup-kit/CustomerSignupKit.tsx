"use client";

import { useMemo, useState } from "react";
import Papa from "papaparse";
import QRCode from "qrcode";
import DropZone from "../DropZone";
import { CopyButton, downloadText, esc, toCsv, useAsyncValue, useSavedState } from "../shared";
import { btnGhost, btnSmall, card, errorBox, h2, hint, input, label } from "../ui";

// Customer sign-up kit: writes UK GDPR/PECR-friendly consent wording and the questions for a
// Google Form the business owns, makes QR cards that link to it, and reads the business's own
// sheet export to list upcoming birthdays and anniversaries. We never store the customer data:
// it lives in the business's Google account, and the export is only read in the browser.

const STORE = "cw-signup-kit-v1";

interface Saved { business: string; offer: string; email: boolean; sms: boolean; birthday: boolean; anniversary: boolean; privacyUrl: string; formUrl: string }
const EMPTY: Saved = { business: "", offer: "a treat on your birthday", email: true, sms: false, birthday: true, anniversary: true, privacyUrl: "", formUrl: "" };

interface Upcoming { name: string; contact: string; kind: string; date: Date; inDays: number }

function parseDayMonth(raw: string): { d: number; m: number } | null {
  const v = raw.trim();
  if (!v) return null;
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(v); // 1990-05-17
  if (m) return { d: +m[3], m: +m[2] };
  m = /^(\d{1,2})[/.\-](\d{1,2})(?:[/.\-]\d{2,4})?/.exec(v); // 17/05/1990 (UK order)
  if (m) return { d: +m[1], m: +m[2] };
  const t = Date.parse(v); // "17 May"
  if (!isNaN(t)) { const x = new Date(t); return { d: x.getDate(), m: x.getMonth() + 1 }; }
  return null;
}

export default function CustomerSignupKit() {
  const [s, setS] = useSavedState<Saved>(STORE, EMPTY);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [error, setError] = useState("");
  const [window_, setWindow] = useState(30);
  const set = (p: Partial<Saved>) => setS((x) => ({ ...x, ...p }));
  const biz = s.business.trim() || "us";
  const channels = [s.email && "email", s.sms && "text message"].filter(Boolean).join(" and ") || "email";

  const consent = `Yes, I'd like ${biz} to contact me by ${channels} with ${s.offer.trim() || "offers and news"}. I can unsubscribe at any time.`;
  const intro = `Join the ${biz} birthday club. Leave your details and we'll send you ${s.offer.trim() || "something special"}. We only use your details to contact you ourselves and never share them.${s.privacyUrl ? ` Privacy notice: ${s.privacyUrl}` : ""}`;
  const questions = [
    "First name (short answer, required)",
    s.email && "Email address (short answer, required, response validation: email)",
    s.sms && "Mobile number (short answer)",
    s.birthday && "Your birthday, day and month only (date, turn off 'Include year')",
    s.anniversary && "An anniversary you'd like us to remember (date, optional, 'Include year' off)",
    `Consent (checkboxes, required, one option): "${consent}"`,
  ].filter(Boolean) as string[];

  const qr = useAsyncValue(s.formUrl.startsWith("https://") ? s.formUrl : "", (u) => QRCode.toDataURL(u, { margin: 1, width: 480, color: { dark: "#0E1A14", light: "#FFFFFF" } }));

  const printCards = () => {
    if (!qr) return;
    const card = `<div class="c"><p class="t">Join our birthday club</p><img src="${qr}" alt="QR code to sign up"><p class="s">Scan to get ${esc(s.offer || "a birthday treat")} from ${esc(biz === "us" ? "us" : biz)}</p></div>`;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!doctype html><html><head><title>Sign-up QR cards</title><style>@page{margin:10mm}body{font-family:Arial,sans-serif;margin:0;display:flex;flex-wrap:wrap;gap:6mm}.c{width:90mm;height:120mm;border:1px dashed #999;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:6mm;page-break-inside:avoid}img{width:55mm;height:55mm}.t{font-weight:800;font-size:16pt;margin:0 0 4mm}.s{font-size:11pt;margin:4mm 0 0}</style></head><body>${Array(4).fill(card).join("")}<script>window.onload=()=>setTimeout(()=>window.print(),300)</script></body></html>`);
    w.document.close();
  };

  const upcoming = useMemo<Upcoming[]>(() => {
    if (!rows.length) return [];
    const cols = Object.keys(rows[0]);
    const find = (re: RegExp) => cols.find((c) => re.test(c));
    const nameCol = find(/name/i);
    const contactCols = cols.filter((c) => /email|mobile|phone/i.test(c));
    const dateCols = cols.filter((c) => /birthday|anniversary|date of birth|dob/i.test(c));
    const consentCol = find(/consent|yes, i'd like/i);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const out: Upcoming[] = [];
    for (const r of rows) {
      if (consentCol && !r[consentCol]?.trim()) continue; // only people who opted in
      for (const dc of dateCols) {
        const dm = parseDayMonth(r[dc] ?? "");
        if (!dm) continue;
        let next = new Date(today.getFullYear(), dm.m - 1, dm.d);
        if (next < today) next = new Date(today.getFullYear() + 1, dm.m - 1, dm.d);
        const inDays = Math.round((next.getTime() - today.getTime()) / 86400000);
        if (inDays <= window_) out.push({ name: (nameCol && r[nameCol]) || "", contact: contactCols.map((c) => r[c]).filter(Boolean).join(", "), kind: /anniv/i.test(dc) ? "Anniversary" : "Birthday", date: next, inDays });
      }
    }
    return out.sort((a, b) => a.inDays - b.inDays);
  }, [rows, window_]);

  return (
    <div className="space-y-6">
      <section className={card} aria-labelledby="csk-1">
        <h2 id="csk-1" className={h2}>1. What you&apos;re offering</h2>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div><label className={label} htmlFor="csk-b">Business name</label><input id="csk-b" className={input} value={s.business} onChange={(e) => set({ business: e.target.value })} placeholder="e.g. Trattoria Nonna" /></div>
          <div><label className={label} htmlFor="csk-o">What people get</label><input id="csk-o" className={input} value={s.offer} onChange={(e) => set({ offer: e.target.value })} /></div>
          <div><label className={label} htmlFor="csk-p">Privacy notice URL</label><input id="csk-p" className={input} value={s.privacyUrl} onChange={(e) => set({ privacyUrl: e.target.value })} placeholder="https://" /></div>
          <fieldset className="text-[14px] text-mid space-y-1.5">
            <legend className={label}>Collect</legend>
            {([["email", "Email"], ["sms", "Mobile number (texts)"], ["birthday", "Birthday"], ["anniversary", "Anniversary"]] as const).map(([k, l]) => (
              <label key={k} className="flex items-center gap-2"><input type="checkbox" checked={s[k]} onChange={(e) => set({ [k]: e.target.checked })} /> {l}</label>
            ))}
          </fieldset>
        </div>
      </section>

      <section className={card} aria-labelledby="csk-2">
        <h2 id="csk-2" className={h2}>2. Make your sign-up form</h2>
        <p className="text-[14px] text-mid mt-2">
          Create a free form at <a className="text-accent-dark underline" href="https://forms.google.com" target="_blank" rel="noopener noreferrer">forms.google.com</a>, then in Responses choose &ldquo;Link to Sheets&rdquo;. Sign-ups go into a Google Sheet that only you own.
        </p>
        <h3 className="text-[14px] font-semibold text-ink mt-4">Form description</h3>
        <div className="mt-1 rounded-[12px] bg-surface p-3 text-[14px] text-ink [overflow-wrap:anywhere]">{intro}</div>
        <div className="mt-2"><CopyButton text={intro} /></div>
        <h3 className="text-[14px] font-semibold text-ink mt-4">Questions to add</h3>
        <ol className="mt-1 list-decimal pl-5 text-[14px] text-mid space-y-1">{questions.map((q) => <li key={q}>{q}</li>)}</ol>
        <div className="mt-2"><CopyButton text={questions.map((q, i) => `${i + 1}. ${q}`).join("\n")} label="Copy questions" /></div>
        <p className={`${hint} mt-3`}>
          UK rules (GDPR and PECR): the consent box must be unticked by default, say who will contact them and how, and make unsubscribing easy. Keep a privacy notice explaining what you store and for how long, and delete details when people ask.
        </p>
      </section>

      <section className={card} aria-labelledby="csk-3">
        <h2 id="csk-3" className={h2}>3. QR cards for tables, receipts and your Wi-Fi page</h2>
        <label className={label} htmlFor="csk-f">Your form&apos;s link (Send, then the link icon)</label>
        <input id="csk-f" className={input} value={s.formUrl} onChange={(e) => set({ formUrl: e.target.value.trim() })} placeholder="https://forms.gle/…" />
        {qr ? (
          <div className="flex flex-col sm:flex-row gap-4 mt-4 items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="QR code linking to your sign-up form" className="w-36 h-36 rounded-[8px] border border-border" />
            <div className="flex flex-wrap gap-2">
              <button type="button" className={btnSmall} onClick={printCards}>Print table cards</button>
              <a className={btnSmall} href={qr} download="signup-qr-code.png">Download PNG</a>
            </div>
          </div>
        ) : (
          <p className={hint}>Paste your form link (starting https://) to make the QR code.</p>
        )}
      </section>

      <section className={card} aria-labelledby="csk-4">
        <h2 id="csk-4" className={h2}>4. Who to contact this month</h2>
        <p className="text-[14px] text-mid mt-2">In your Google Sheet choose File, Download, CSV, and drop it here. It lists upcoming birthdays and anniversaries for people who ticked the consent box. The file is only read in your browser.</p>
        <div className="mt-4">
          <DropZone accept=".csv,text/csv" onFiles={async (f) => {
            setError("");
            const res = Papa.parse<Record<string, string>>(await f[0].text(), { header: true, skipEmptyLines: true });
            if (!res.data.length) return setError("No rows found in that file.");
            setRows(res.data);
          }} title="Drop in your sign-ups (CSV)" />
        </div>
        {error && <p className={`${errorBox} mt-3`}>{error}</p>}
        {rows.length > 0 && (
          <>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <label className="text-[14px] text-mid" htmlFor="csk-w">Next</label>
              <select id="csk-w" className={`${input} w-auto`} value={window_} onChange={(e) => setWindow(Number(e.target.value))}>
                <option value={7}>7 days</option><option value={14}>14 days</option><option value={30}>30 days</option><option value={60}>60 days</option>
              </select>
              <span className="text-[14px] text-mid">{upcoming.length} coming up from {rows.length} sign-ups</span>
            </div>
            <ul className="mt-3 border-y border-border divide-y divide-border">
              {upcoming.map((u, i) => (
                <li key={i} className="py-2.5 flex flex-wrap gap-x-4 gap-y-0.5 text-[14px]">
                  <span className="font-semibold text-ink w-40">{u.name || "No name"}</span>
                  <span className="text-mid">{u.kind} {u.date.toLocaleDateString("en-GB", { day: "numeric", month: "long" })} ({u.inDays === 0 ? "today" : `in ${u.inDays} days`})</span>
                  <span className="text-muted break-all">{u.contact}</span>
                </li>
              ))}
            </ul>
            {upcoming.length > 0 && <button type="button" className={`${btnGhost} mt-3`} onClick={() => downloadText("upcoming-dates.csv", toCsv([["Name", "Occasion", "Date", "Contact"], ...upcoming.map((u) => [u.name, u.kind, u.date.toLocaleDateString("en-GB"), u.contact])]), "text/csv")}>Export list</button>}
          </>
        )}
      </section>
    </div>
  );
}
