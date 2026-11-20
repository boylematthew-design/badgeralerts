"use client";

import { useMemo, useState } from "react";
import Papa from "papaparse";
import DropZone from "../DropZone";
import { CodeOutput, downloadText, esc, toCsv } from "../shared";
import { btnGhost, btnSmall, card, errorBox, h2, hint, input, label, tabBtn } from "../ui";

// Catalogue page toolkit: reads a product export (Shopify's, or any CSV with a title column)
// in the browser and answers: which filter combinations have enough stock for their own page,
// which quick links to put on a category, what's in each gift price band, and a comparison
// table built from product attributes.

interface Product {
  title: string;
  price: number | null;
  url: string;
  attrs: Record<string, string[]>; // e.g. { Type: ["Necklace"], Tags: ["gold", "gift"], Colour: ["Black"] }
}

const SAMPLE = `Title,Price,Type,Tags,Metal,Stone,Shape
Oval diamond solitaire ring,1250,Engagement ring,"engagement, diamond, gift",Platinum,Diamond,Oval
Oval sapphire halo ring,980,Engagement ring,"engagement, sapphire",White gold,Sapphire,Oval
Round diamond solitaire ring,1100,Engagement ring,"engagement, diamond",Yellow gold,Diamond,Round
Round diamond trilogy ring,1650,Engagement ring,"engagement, diamond",Platinum,Diamond,Round
Oval diamond trilogy ring,1490,Engagement ring,"engagement, diamond",Yellow gold,Diamond,Oval
Oval emerald ring,890,Engagement ring,"engagement, emerald",Yellow gold,Emerald,Oval
Gold hoop earrings,45,Earrings,"gift, everyday",Yellow gold,,
Silver huggie earrings,32,Earrings,"gift, everyday",Silver,,
Pearl drop earrings,68,Earrings,"gift, bridal",Yellow gold,Pearl,
Birthstone necklace,49,Necklace,"gift, birthstone",Silver,Birthstone,
Initial pendant,39,Necklace,"gift, personalised",Yellow gold,,
Tennis bracelet,149,Bracelet,"gift, bridal",White gold,Cubic zirconia,
Chain bracelet,29,Bracelet,"gift, everyday",Silver,,
Signet ring,95,Ring,"gift, personalised",Yellow gold,,Oval`;

const pick = (row: Record<string, string>, names: string[]) => {
  const key = Object.keys(row).find((k) => names.includes(k.trim().toLowerCase()));
  return key ? (row[key] ?? "").trim() : "";
};
const TITLE = ["title", "name", "product name", "product title", "product"];
const PRICE = ["variant price", "price", "sale price", "regular price"];
const URL_COLS = ["url", "link", "product url"];
const SKIP = new Set([...TITLE, ...PRICE, ...URL_COLS, "handle", "body (html)", "description", "image src", "variant sku", "sku", "seo title", "seo description", "variant grams", "variant inventory qty", "image alt text", "published", "status", "id", "image position", "gift card", "variant barcode", "variant image", "variant weight unit", "cost per item", "variant compare at price", "variant requires shipping", "variant taxable", "variant inventory policy", "variant fulfillment service", "variant inventory tracker", "variant tax code", "image", "images"]);

function parseProducts(rows: Record<string, string>[], storeUrl: string): Product[] {
  const byHandle = new Map<string, Product>();
  const optionNames = new Map<string, string>();
  const out: Product[] = [];
  let last: Product | null = null;
  for (const row of rows) {
    const handle = pick(row, ["handle"]);
    const title = pick(row, TITLE);
    // Shopify puts each extra variant on its own row with the same handle and an empty title.
    let p = handle ? byHandle.get(handle) : undefined;
    if (!p && !title && last && handle === "") p = last;
    if (!p) {
      if (!title) continue;
      const base = storeUrl.replace(/\/+$/, "");
      p = { title, price: null, url: pick(row, URL_COLS) || (handle && base ? `${base}/products/${handle}` : ""), attrs: {} };
      out.push(p);
      if (handle) byHandle.set(handle, p);
    }
    last = p;
    const price = parseFloat(pick(row, PRICE).replace(/[^\d.]/g, ""));
    if (!isNaN(price)) p.price = p.price === null ? price : Math.min(p.price, price);
    // Shopify options: "Option1 Name" = Colour, "Option1 Value" = Black. The name is only on
    // the product's first row, so it's remembered for the variant rows after it.
    for (let i = 1; i <= 3; i++) {
      const n = pick(row, [`option${i} name`]);
      const v = pick(row, [`option${i} value`]);
      if (n) optionNames.set(`${handle}|${i}`, n);
      const name = n || optionNames.get(`${handle}|${i}`) || `Option ${i}`;
      if (v && v !== "Default Title" && name.toLowerCase() !== "title") add(p, name, v);
    }
    for (const [k, raw] of Object.entries(row)) {
      const key = k.trim();
      const lk = key.toLowerCase();
      if (!raw || SKIP.has(lk) || /^option\d/.test(lk) || lk.startsWith("variant ")) continue;
      const values = lk === "tags" || lk === "categories" ? raw.split(/[,|]/) : [raw];
      for (const v of values) add(p, key === "Product Type" || lk === "product category" ? "Type" : key, v.trim());
    }
  }
  return out;
}
function add(p: Product, field: string, value: string) {
  if (!value) return;
  const list = (p.attrs[field] ??= []);
  if (!list.some((x) => x.toLowerCase() === value.toLowerCase())) list.push(value);
}

const TABS = ["Filter pages", "Quick links", "Gift guides", "Comparison table"] as const;
type Tab = (typeof TABS)[number];
const money = (n: number | null) => (n === null ? "" : `£${n % 1 ? n.toFixed(2) : n}`);

export default function CatalogueToolkit() {
  const [products, setProducts] = useState<Product[]>([]);
  const [fileName, setFileName] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([]);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("Filter pages");

  const load = (text: string, name: string) => {
    setError("");
    const res = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });
    const parsed = parseProducts(res.data, storeUrl);
    if (!parsed.length) return setError("No products found. The file needs a header row with a Title (or Name) column.");
    setRawRows(res.data);
    setProducts(parsed);
    setFileName(name);
  };

  const fields = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) for (const f of Object.keys(p.attrs)) counts[f] = (counts[f] ?? 0) + 1;
    return Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  }, [products]);

  if (!products.length) {
    return (
      <div className="space-y-4">
        <div>
          <label className={label} htmlFor="ct-store">Your shop address (optional, for product links)</label>
          <input id="ct-store" className={input} value={storeUrl} onChange={(e) => setStoreUrl(e.target.value)} placeholder="https://www.yourshop.co.uk" />
        </div>
        <DropZone
          accept=".csv,text/csv"
          onFiles={async (files) => {
            if (files[0].size > 50 * 1024 * 1024) return setError("That file is over 50 MB.");
            load(await files[0].text(), files[0].name);
          }}
          title="Drop in your product export (CSV)"
          hint="Shopify: Products → Export. WooCommerce: Products → Export. Or any spreadsheet saved as CSV with a Title column."
        />
        {error && <p className={errorBox}>{error}</p>}
        <button type="button" className={btnGhost} onClick={() => load(SAMPLE, "sample jewellery shop")}>Try it with sample products</button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <p className="text-[14px] text-mid"><strong className="text-ink">{products.length} products</strong> from {fileName}, with {fields.length} fields to filter by.</p>
        <button type="button" className={btnSmall} onClick={() => { setProducts([]); setRawRows([]); }}>Use a different file</button>
      </div>
      <div className="flex flex-wrap gap-2" role="tablist">
        {TABS.map((t) => <button key={t} type="button" role="tab" aria-selected={tab === t} className={tabBtn(tab === t)} onClick={() => setTab(t)}>{t}</button>)}
      </div>
      {tab === "Filter pages" && <FilterPages products={products} fields={fields} />}
      {tab === "Quick links" && <QuickLinks products={products} fields={fields} />}
      {tab === "Gift guides" && <GiftGuides products={products} fields={fields} />}
      {tab === "Comparison table" && <Comparison products={products} fields={fields} />}
      {rawRows.length > 0 && <p className={hint}>Read {rawRows.length} rows in your browser. Nothing was uploaded.</p>}
    </div>
  );
}

function FieldSelect({ id, value, onChange, fields, allowNone = false, text }: { id: string; value: string; onChange: (v: string) => void; fields: string[]; allowNone?: boolean; text: string }) {
  return (
    <div>
      <label className={label} htmlFor={id}>{text}</label>
      <select id={id} className={input} value={value} onChange={(e) => onChange(e.target.value)}>
        {allowNone && <option value="">None</option>}
        {fields.map((f) => <option key={f} value={f}>{f}</option>)}
      </select>
    </div>
  );
}

function valuesOf(products: Product[], field: string) {
  const m = new Map<string, number>();
  for (const p of products) for (const v of p.attrs[field] ?? []) m.set(v, (m.get(v) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function FilterPages({ products, fields }: { products: Product[]; fields: string[] }) {
  const [a, setA] = useState(fields[0] ?? "");
  const [b, setB] = useState(fields[1] ?? "");
  const [min, setMin] = useState(6);
  const rows = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of products) {
      for (const va of p.attrs[a] ?? []) {
        if (!b) { m.set(va, (m.get(va) ?? 0) + 1); continue; }
        for (const vb of p.attrs[b] ?? []) {
          const key = `${va} + ${vb}`;
          m.set(key, (m.get(key) ?? 0) + 1);
        }
      }
    }
    return [...m.entries()].sort((x, y) => y[1] - x[1]);
  }, [products, a, b]);
  const worthy = rows.filter((r) => r[1] >= min).length;
  return (
    <section className={card} aria-labelledby="ct-fp">
      <h2 id="ct-fp" className={h2}>Which filter pages have enough stock?</h2>
      <p className="text-[14px] text-mid mt-2">A filter page (like &ldquo;oval engagement rings&rdquo;) is only worth creating if there&apos;s search demand and enough products to fill it. This checks the stock side.</p>
      <div className="grid sm:grid-cols-3 gap-3 mt-4">
        <FieldSelect id="ct-a" value={a} onChange={setA} fields={fields} text="Filter" />
        <FieldSelect id="ct-b" value={b} onChange={setB} fields={fields.filter((f) => f !== a)} allowNone text="Combined with" />
        <div>
          <label className={label} htmlFor="ct-min">Minimum products for a page</label>
          <input id="ct-min" type="number" min={1} className={input} value={min} onChange={(e) => setMin(Math.max(1, Number(e.target.value)))} />
        </div>
      </div>
      <p className="text-[14px] text-ink mt-4"><strong>{worthy}</strong> of {rows.length} combinations have {min}+ products.</p>
      <div className="mt-3 max-h-[420px] overflow-y-auto border-y border-border">
        <table className="w-full text-[14px]">
          <thead className="sticky top-0 bg-white"><tr className="text-left text-[12px] text-muted uppercase tracking-[0.06em]"><th className="py-2">Combination</th><th className="py-2 text-right">Products</th><th className="py-2 pl-3">Page?</th></tr></thead>
          <tbody className="divide-y divide-border">
            {rows.map(([k, n]) => (
              <tr key={k}><td className="py-2 pr-2 text-ink">{k}</td><td className="py-2 text-right tabular-nums">{n}</td><td className={`py-2 pl-3 font-semibold ${n >= min ? "text-accent-dark" : "text-muted"}`}>{n >= min ? "Enough stock" : "Too few"}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <button type="button" className={btnGhost} onClick={() => downloadText("filter-pages.csv", toCsv([["Combination", "Products", "Enough stock"], ...rows.map(([k, n]) => [k, n, n >= min ? "Yes" : "No"])]), "text/csv")}>Export CSV</button>
      </div>
      <p className={`${hint} mt-3`}>Next, check search demand for the ones with enough stock using the <a className="text-accent-dark underline" href="/tools">question and keyword tools</a> or Google Search Console.</p>
    </section>
  );
}

function Scope({ products, fields, scopeField, setScopeField, scopeValue, setScopeValue }: { products: Product[]; fields: string[]; scopeField: string; setScopeField: (v: string) => void; scopeValue: string; setScopeValue: (v: string) => void }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <FieldSelect id="ct-sf" value={scopeField} onChange={(v) => { setScopeField(v); setScopeValue(""); }} fields={fields} allowNone text="Limit to products where" />
      {scopeField && (
        <div>
          <label className={label} htmlFor="ct-sv">is</label>
          <select id="ct-sv" className={input} value={scopeValue} onChange={(e) => setScopeValue(e.target.value)}>
            <option value="">Any</option>
            {valuesOf(products, scopeField).map(([v, n]) => <option key={v} value={v}>{v} ({n})</option>)}
          </select>
        </div>
      )}
    </div>
  );
}
const inScope = (products: Product[], f: string, v: string) => (f && v ? products.filter((p) => (p.attrs[f] ?? []).includes(v)) : products);
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function QuickLinks({ products, fields }: { products: Product[]; fields: string[] }) {
  const [sf, setSf] = useState("Type");
  const [sv, setSv] = useState("");
  const [field, setField] = useState(fields.find((f) => f !== "Type") ?? fields[0] ?? "");
  const [base, setBase] = useState("/collections/all");
  const scoped = inScope(products, fields.includes(sf) ? sf : "", sv);
  const top = valuesOf(scoped, field).slice(0, 8);
  const prices = scoped.map((p) => p.price).filter((n): n is number => n !== null).sort((x, y) => x - y);
  const bands = [25, 50, 100, 250, 500, 1000].filter((b) => prices.some((p) => p <= b) && prices.some((p) => p > b)).slice(0, 3);
  const html = `<nav class="quick-links" aria-label="Shop by ${esc(field.toLowerCase())}">\n${top.map(([v]) => `  <a href="${esc(base.replace(/\/+$/, ""))}/${slug(v)}">${esc(v)}</a>`).join("\n")}${bands.map((b) => `\n  <a href="${esc(base.replace(/\/+$/, ""))}?price-max=${b}">Under £${b}</a>`).join("")}\n</nav>`;
  return (
    <section className={card} aria-labelledby="ct-ql">
      <h2 id="ct-ql" className={h2}>Quick-link buttons for a category page</h2>
      <p className="text-[14px] text-mid mt-2">The most common types, sizes and price bands in a category, as buttons for the top of the page, so shoppers get to the right products in one tap.</p>
      <div className="space-y-3 mt-4">
        <Scope products={products} fields={fields} scopeField={fields.includes(sf) ? sf : ""} setScopeField={setSf} scopeValue={sv} setScopeValue={setSv} />
        <div className="grid sm:grid-cols-2 gap-3">
          <FieldSelect id="ct-qf" value={field} onChange={setField} fields={fields} text="Buttons for" />
          <div>
            <label className={label} htmlFor="ct-base">Category page address</label>
            <input id="ct-base" className={input} value={base} onChange={(e) => setBase(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-5" aria-label="Preview">
        {top.map(([v, n]) => <span key={v} className="rounded-full border border-border-strong px-3.5 py-1.5 text-[13px] font-semibold text-ink">{v} <span className="text-muted font-normal">({n})</span></span>)}
        {bands.map((b) => <span key={b} className="rounded-full border border-border-strong px-3.5 py-1.5 text-[13px] font-semibold text-ink">Under £{b}</span>)}
      </div>
      <CodeOutput title="HTML" code={html} />
      <p className={`${hint} mt-2`}>Check each link goes to a real filtered page on your shop before publishing. The URL format differs between platforms.</p>
    </section>
  );
}

function GiftGuides({ products, fields }: { products: Product[]; fields: string[] }) {
  const [sf, setSf] = useState(fields.includes("Tags") ? "Tags" : "");
  const [sv, setSv] = useState(valuesOf(products, "Tags").find(([v]) => /gift/i.test(v))?.[0] ?? "");
  const [bandsText, setBandsText] = useState("25, 50, 100");
  const bands = bandsText.split(",").map((b) => parseFloat(b)).filter((b) => b > 0).sort((a, b) => a - b);
  const scoped = inScope(products, sf, sv).filter((p) => p.price !== null);
  const groups = bands.map((b, i) => ({ b, items: scoped.filter((p) => p.price! <= b && (i === 0 || p.price! > bands[i - 1])).sort((x, y) => x.price! - y.price!) }));
  const html = groups.filter((g) => g.items.length).map((g) => `<section class="gift-guide">\n  <h2>Gifts under £${g.b}</h2>\n  <ul>\n${g.items.map((p) => `    <li>${p.url ? `<a href="${esc(p.url)}">${esc(p.title)}</a>` : esc(p.title)} – ${money(p.price)}</li>`).join("\n")}\n  </ul>\n</section>`).join("\n\n");
  return (
    <section className={card} aria-labelledby="ct-gg">
      <h2 id="ct-gg" className={h2}>Gift guides from your own stock</h2>
      <p className="text-[14px] text-mid mt-2">People ask Google and AI tools for &ldquo;gifts under £50&rdquo;. A page listing your own products in each price band answers that directly.</p>
      <div className="space-y-3 mt-4">
        <Scope products={products} fields={fields} scopeField={sf} setScopeField={setSf} scopeValue={sv} setScopeValue={setSv} />
        <div>
          <label className={label} htmlFor="ct-bands">Price bands (£, comma separated)</label>
          <input id="ct-bands" className={input} value={bandsText} onChange={(e) => setBandsText(e.target.value)} />
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3 mt-5">
        {groups.map((g) => (
          <div key={g.b} className="rounded-[12px] bg-surface p-3">
            <p className="font-semibold text-ink text-[14px]">Under £{g.b} <span className="text-muted font-normal">({g.items.length})</span></p>
            <ul className="text-[13px] text-mid mt-1 space-y-0.5">{g.items.slice(0, 6).map((p, i) => <li key={i}>{p.title} – {money(p.price)}</li>)}{g.items.length > 6 && <li>and {g.items.length - 6} more</li>}</ul>
          </div>
        ))}
      </div>
      <CodeOutput title="HTML" code={html || "<!-- No products in these price bands. -->"} />
    </section>
  );
}

function Comparison({ products, fields }: { products: Product[]; fields: string[] }) {
  const [sf, setSf] = useState("Type");
  const [sv, setSv] = useState("");
  const [cols, setCols] = useState<string[]>(fields.filter((f) => f !== "Tags" && f !== "Type").slice(0, 3));
  const scoped = inScope(products, fields.includes(sf) ? sf : "", sv).slice(0, 30);
  const html = `<table class="comparison">\n  <thead>\n    <tr><th scope="col">Product</th><th scope="col">Price</th>${cols.map((c) => `<th scope="col">${esc(c)}</th>`).join("")}</tr>\n  </thead>\n  <tbody>\n${scoped.map((p) => `    <tr><th scope="row">${p.url ? `<a href="${esc(p.url)}">${esc(p.title)}</a>` : esc(p.title)}</th><td>${money(p.price)}</td>${cols.map((c) => `<td>${esc((p.attrs[c] ?? []).join(", ") || "–")}</td>`).join("")}</tr>`).join("\n")}\n  </tbody>\n</table>`;
  return (
    <section className={card} aria-labelledby="ct-cmp">
      <h2 id="ct-cmp" className={h2}>Comparison table</h2>
      <p className="text-[14px] text-mid mt-2">A table comparing products side by side helps shoppers decide, and AI tools quote tables like this when people ask which product to buy. Use it on category pages and buying guides.</p>
      <div className="space-y-3 mt-4">
        <Scope products={products} fields={fields} scopeField={fields.includes(sf) ? sf : ""} setScopeField={setSf} scopeValue={sv} setScopeValue={setSv} />
        <div>
          <span className={label}>Columns</span>
          <div className="flex flex-wrap gap-2">
            {fields.map((f) => (
              <button key={f} type="button" className={tabBtn(cols.includes(f))} aria-pressed={cols.includes(f)} onClick={() => setCols((c) => (c.includes(f) ? c.filter((x) => x !== f) : [...c, f]))}>{f}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-[13px] border-collapse">
          <thead><tr className="text-left bg-surface"><th className="p-2">Product</th><th className="p-2">Price</th>{cols.map((c) => <th key={c} className="p-2">{c}</th>)}</tr></thead>
          <tbody className="divide-y divide-border">{scoped.map((p, i) => <tr key={i}><td className="p-2 font-semibold text-ink">{p.title}</td><td className="p-2">{money(p.price)}</td>{cols.map((c) => <td key={c} className="p-2 text-mid">{(p.attrs[c] ?? []).join(", ") || "–"}</td>)}</tr>)}</tbody>
        </table>
      </div>
      {scoped.length === 30 && <p className={hint}>Showing the first 30 products. Narrow it down with the filter above.</p>}
      <CodeOutput title="HTML" code={html} />
    </section>
  );
}
