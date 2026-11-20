"use client";

import { useState } from "react";
import { CodeOutput, downloadText, esc, useSavedState } from "../shared";
import { btnGhost, btnSmall, card, h2, h3, hint, input, label, tabBtn } from "../ui";

// Website info blocks & schema generator: fill in a form once, get ready-to-paste HTML sections
// (price list, services, address + map, hours, locations, team, trust footer) plus matching
// JSON-LD structured data. Saved in this browser only.

const STORE = "cw-schema-gen-v1";

const TYPES = [
  ["Plumber", "Plumber"], ["Electrician", "Electrician"], ["HVACBusiness", "Heating & air con"], ["RoofingContractor", "Roofer"],
  ["GeneralContractor", "Builder"], ["Locksmith", "Locksmith"], ["HousePainter", "Painter & decorator"], ["Restaurant", "Restaurant"],
  ["CafeOrCoffeeShop", "Cafe"], ["BarOrPub", "Bar or pub"], ["JewelryStore", "Jewellery shop"], ["Store", "Shop"],
  ["Dentist", "Dentist"], ["HairSalon", "Hair salon"], ["BeautySalon", "Beauty salon"], ["AutoRepair", "Garage"],
  ["ProfessionalService", "Professional service"], ["LocalBusiness", "Other local business"],
] as const;

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

interface Hours { open: string; close: string; closed: boolean }
interface Service { name: string; price: string; from: boolean; note: string }
interface Detail { label: string; value: string }
interface Location { name: string; street: string; town: string; postcode: string; phone: string }
interface Person { name: string; role: string; qualifications: string; years: string; photo: string }

interface Form {
  type: string;
  name: string; url: string; phone: string; email: string; logo: string;
  street: string; town: string; postcode: string; country: string;
  areaServed: string; companyNumber: string; vatNumber: string; returnsUrl: string; payments: string;
  cuisine: string; menuUrl: string;
  hours: Hours[];
  services: Service[];
  details: Detail[];
  locations: Location[];
  team: Person[];
}

const EMPTY: Form = {
  type: "Plumber", name: "", url: "", phone: "", email: "", logo: "",
  street: "", town: "", postcode: "", country: "GB",
  areaServed: "", companyNumber: "", vatNumber: "", returnsUrl: "", payments: "Cash, Card, Bank transfer",
  cuisine: "", menuUrl: "",
  hours: DAYS.map((_, i) => ({ open: "08:00", close: "18:00", closed: i >= 5 })),
  services: [{ name: "", price: "", from: false, note: "" }],
  details: [
    { label: "Brands we fit", value: "" },
    { label: "Call-out fee", value: "" },
    { label: "Accreditations", value: "" },
    { label: "Weekend and evening work", value: "" },
  ],
  locations: [],
  team: [],
};

const isRestaurant = (t: string) => ["Restaurant", "CafeOrCoffeeShop", "BarOrPub"].includes(t);
const money = (p: string) => p.replace(/[^\d.]/g, "");
const fullAddress = (f: { street: string; town: string; postcode: string }) => [f.street, f.town, f.postcode].filter(Boolean).join(", ");

function hoursGroups(hours: Hours[]) {
  return DAYS.map((d, i) => ({ day: d, ...hours[i] }));
}

function buildSchema(f: Form) {
  const address = (a: { street: string; town: string; postcode: string }) => ({
    "@type": "PostalAddress",
    streetAddress: a.street || undefined,
    addressLocality: a.town || undefined,
    postalCode: a.postcode || undefined,
    addressCountry: f.country || undefined,
  });
  const openingHoursSpecification = hoursGroups(f.hours)
    .filter((h) => !h.closed)
    .map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.day, opens: h.open, closes: h.close }));
  const services = f.services.filter((s) => s.name.trim());
  const team = f.team.filter((p) => p.name.trim());
  const main: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": f.type,
    name: f.name || undefined,
    url: f.url || undefined,
    logo: f.logo || undefined,
    image: f.logo || undefined,
    telephone: f.phone || undefined,
    email: f.email || undefined,
    address: f.street || f.town || f.postcode ? address(f) : undefined,
    areaServed: f.areaServed ? f.areaServed.split(",").map((a) => a.trim()).filter(Boolean) : undefined,
    openingHoursSpecification: openingHoursSpecification.length ? openingHoursSpecification : undefined,
    paymentAccepted: f.payments || undefined,
    servesCuisine: isRestaurant(f.type) && f.cuisine ? f.cuisine : undefined,
    hasMenu: isRestaurant(f.type) && f.menuUrl ? f.menuUrl : undefined,
    identifier: f.companyNumber ? { "@type": "PropertyValue", name: "Company number", value: f.companyNumber } : undefined,
    vatID: f.vatNumber || undefined,
    hasOfferCatalog: services.length
      ? {
          "@type": "OfferCatalog",
          name: "Services and prices",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.name, description: s.note || undefined },
            ...(money(s.price)
              ? s.from
                ? { priceSpecification: { "@type": "PriceSpecification", minPrice: money(s.price), priceCurrency: "GBP" } }
                : { price: money(s.price), priceCurrency: "GBP" }
              : {}),
          })),
        }
      : undefined,
    additionalProperty: f.details.filter((d) => d.label && d.value).length
      ? f.details.filter((d) => d.label && d.value).map((d) => ({ "@type": "PropertyValue", name: d.label, value: d.value }))
      : undefined,
    employee: team.length
      ? team.map((p) => ({
          "@type": "Person",
          name: p.name,
          jobTitle: p.role || undefined,
          image: p.photo || undefined,
          hasCredential: p.qualifications
            ? p.qualifications.split(",").map((q) => ({ "@type": "EducationalOccupationalCredential", name: q.trim() }))
            : undefined,
        }))
      : undefined,
  };
  const branches = f.locations
    .filter((l) => l.name || l.street)
    .map((l) => ({
      "@context": "https://schema.org",
      "@type": f.type,
      name: l.name || f.name,
      telephone: l.phone || f.phone || undefined,
      address: address(l),
      url: f.url || undefined,
      parentOrganization: { "@type": "Organization", name: f.name || undefined, url: f.url || undefined },
    }));
  const all = [main, ...branches];
  return JSON.stringify(all.length === 1 ? main : all, (_, v) => (v === undefined ? undefined : v), 2);
}

function scriptTag(json: string) {
  return `<script type="application/ld+json">\n${json.replace(/</g, "\\u003c")}\n</script>`;
}

const BLOCKS = ["Prices", "Services & details", "Address & map", "Opening hours", "Locations", "Meet the team", "Trust footer", "Schema only"] as const;
type Block = (typeof BLOCKS)[number];

function buildHtml(block: Block, f: Form): string {
  const name = esc(f.name || "Your business");
  switch (block) {
    case "Prices": {
      const rows = f.services.filter((s) => s.name).map((s) =>
        `    <tr>\n      <td>${esc(s.name)}${s.note ? `<br><small>${esc(s.note)}</small>` : ""}</td>\n      <td>${s.price ? `${s.from ? "From " : ""}£${esc(money(s.price))}` : "Ask for a quote"}</td>\n    </tr>`);
      return `<section class="price-list">\n  <h2>Prices</h2>\n  <table>\n    <thead><tr><th>Service</th><th>Price</th></tr></thead>\n    <tbody>\n${rows.join("\n")}\n    </tbody>\n  </table>\n  <p><small>Prices include VAT. Fixed prices are for the job described; "from" prices depend on the work needed.</small></p>\n</section>`;
    }
    case "Services & details": {
      const services = f.services.filter((s) => s.name).map((s) => `    <li><strong>${esc(s.name)}</strong>${s.note ? ` – ${esc(s.note)}` : ""}</li>`);
      const details = f.details.filter((d) => d.label && d.value).map((d) => `    <dt>${esc(d.label)}</dt>\n    <dd>${esc(d.value)}</dd>`);
      return `<section class="services">\n  <h2>What ${name} does</h2>\n  <ul>\n${services.join("\n")}\n  </ul>\n  <h3>The details</h3>\n  <dl>\n${details.join("\n")}${f.areaServed ? `\n    <dt>Areas we cover</dt>\n    <dd>${esc(f.areaServed)}</dd>` : ""}\n  </dl>\n</section>`;
    }
    case "Address & map": {
      const addr = fullAddress(f);
      return `<section class="find-us">\n  <h2>Find ${name}</h2>\n  <address>\n    ${name}<br>\n    ${esc(f.street)}<br>\n    ${esc(f.town)} ${esc(f.postcode)}<br>\n    ${f.phone ? `<a href="tel:${esc(f.phone.replace(/\s/g, ""))}">${esc(f.phone)}</a>` : ""}\n  </address>\n  <iframe title="Map showing ${name}" src="https://www.google.com/maps?q=${encodeURIComponent(`${f.name} ${addr}`)}&amp;output=embed" width="600" height="400" style="border:0;max-width:100%" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>\n</section>`;
    }
    case "Opening hours": {
      const rows = hoursGroups(f.hours).map((h) => `    <tr><th scope="row">${h.day}</th><td>${h.closed ? "Closed" : `${h.open} to ${h.close}`}</td></tr>`);
      return `<section class="opening-hours">\n  <h2>Opening hours</h2>\n  <table>\n    <tbody>\n${rows.join("\n")}\n    </tbody>\n  </table>\n</section>`;
    }
    case "Locations": {
      const locs = f.locations.map((l) =>
        `  <article class="location">\n    <h3>${esc(l.name || f.name)}</h3>\n    <address>${esc(fullAddress(l))}${l.phone ? `<br><a href="tel:${esc(l.phone.replace(/\s/g, ""))}">${esc(l.phone)}</a>` : ""}</address>\n    <iframe title="Map showing ${esc(l.name || f.name)}" src="https://www.google.com/maps?q=${encodeURIComponent(`${f.name} ${fullAddress(l)}`)}&amp;output=embed" width="600" height="300" style="border:0;max-width:100%" loading="lazy"></iframe>\n  </article>`);
      return locs.length ? `<section class="locations">\n  <h2>Our locations</h2>\n${locs.join("\n")}\n</section>` : "<!-- Add locations in the form to generate this block. Give each location its own page if you can. -->";
    }
    case "Meet the team": {
      const people = f.team.filter((p) => p.name).map((p) =>
        `  <article class="team-member">\n${p.photo ? `    <img src="${esc(p.photo)}" alt="${esc(p.name)}${p.role ? `, ${esc(p.role)}` : ""}" width="300" height="300" loading="lazy">\n` : ""}    <h3>${esc(p.name)}</h3>\n${p.role ? `    <p>${esc(p.role)}</p>\n` : ""}${p.qualifications ? `    <p>Qualifications: ${esc(p.qualifications)}</p>\n` : ""}${p.years ? `    <p>${esc(p.years)} years' experience</p>\n` : ""}  </article>`);
      return people.length ? `<section class="meet-the-team">\n  <h2>Meet the team</h2>\n${people.join("\n")}\n</section>` : "<!-- Add team members in the form to generate this block. -->";
    }
    case "Trust footer": {
      return `<footer class="trust-footer">\n  <p><strong>${name}</strong><br>${esc(fullAddress(f))}</p>\n  <p>${f.phone ? `Phone: <a href="tel:${esc(f.phone.replace(/\s/g, ""))}">${esc(f.phone)}</a><br>` : ""}${f.email ? `Email: <a href="mailto:${esc(f.email)}">${esc(f.email)}</a>` : ""}</p>\n  <p>${f.companyNumber ? `Registered in England and Wales, company number ${esc(f.companyNumber)}.` : ""}${f.vatNumber ? ` VAT number ${esc(f.vatNumber)}.` : ""}</p>\n${f.returnsUrl ? `  <p><a href="${esc(f.returnsUrl)}">Returns and refunds policy</a></p>\n` : ""}${f.payments ? `  <p>We accept: ${esc(f.payments)}</p>\n` : ""}</footer>`;
    }
    default:
      return "";
  }
}

export default function SchemaGenerator() {
  const [f, setF] = useSavedState<Form>(STORE, EMPTY);
  const [block, setBlock] = useState<Block>("Prices");
  const set = (patch: Partial<Form>) => setF((x) => ({ ...x, ...patch }));
  const setIn = <K extends "services" | "details" | "locations" | "team">(key: K, i: number, patch: Partial<Form[K][number]>) =>
    setF((x) => ({ ...x, [key]: (x[key] as Form[K][number][]).map((row, j) => (j === i ? { ...row, ...patch } : row)) }));
  const removeIn = (key: "services" | "details" | "locations" | "team", i: number) =>
    setF((x) => ({ ...x, [key]: (x[key] as unknown[]).filter((_, j) => j !== i) }));

  const schema = buildSchema(f);
  const html = buildHtml(block, f);
  const text = (k: keyof Form, l: string, ph = "", type = "text") => (
    <div>
      <label className={label} htmlFor={`sg-${k}`}>{l}</label>
      <input id={`sg-${k}`} type={type} className={input} value={f[k] as string} placeholder={ph} onChange={(e) => set({ [k]: e.target.value } as Partial<Form>)} />
    </div>
  );

  return (
    <div className="space-y-6">
      <section className={card} aria-labelledby="sg-biz">
        <h2 id="sg-biz" className={h2}>1. Your business</h2>
        <div className="grid sm:grid-cols-2 gap-4 mt-5">
          <div>
            <label className={label} htmlFor="sg-type">Type of business</label>
            <select id="sg-type" className={input} value={f.type} onChange={(e) => set({ type: e.target.value })}>
              {TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          {text("name", "Business name", "Leeds Plumbing Co")}
          {text("url", "Website", "https://", "url")}
          {text("phone", "Phone", "0113 496 0000", "tel")}
          {text("email", "Email", "", "email")}
          {text("logo", "Logo image URL", "https://")}
          {text("street", "Street address", "12 High Street")}
          {text("town", "Town or city", "Leeds")}
          {text("postcode", "Postcode", "LS1 1AA")}
          {text("areaServed", "Areas you cover (comma separated)", "Leeds, Wakefield, Harrogate")}
          {isRestaurant(f.type) && text("cuisine", "Cuisine", "Italian")}
          {isRestaurant(f.type) && text("menuUrl", "Menu page URL", "https://")}
        </div>

        <h3 className={`${h3} mt-6`}>Opening hours</h3>
        <div className="mt-3 space-y-2">
          {DAYS.map((d, i) => (
            <div key={d} className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="w-24 text-[14px] font-semibold text-ink">{d}</span>
              <label className="flex items-center gap-1.5 text-[13px] text-mid">
                <input type="checkbox" checked={f.hours[i].closed} onChange={(e) => set({ hours: f.hours.map((h, j) => (j === i ? { ...h, closed: e.target.checked } : h)) })} /> Closed
              </label>
              {!f.hours[i].closed && (
                <>
                  <input aria-label={`${d} opens`} type="time" className={`${input} w-auto`} value={f.hours[i].open} onChange={(e) => set({ hours: f.hours.map((h, j) => (j === i ? { ...h, open: e.target.value } : h)) })} />
                  <span className="text-[13px] text-muted">to</span>
                  <input aria-label={`${d} closes`} type="time" className={`${input} w-auto`} value={f.hours[i].close} onChange={(e) => set({ hours: f.hours.map((h, j) => (j === i ? { ...h, close: e.target.value } : h)) })} />
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className={card} aria-labelledby="sg-services">
        <h2 id="sg-services" className={h2}>2. Services and prices</h2>
        <p className="text-[14px] text-mid mt-2">Fixed prices wherever you can, &ldquo;from&rdquo; prices otherwise. AI tools use prices to compare businesses, and they can only read them if they&apos;re written on the page.</p>
        <div className="space-y-3 mt-4">
          {f.services.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_1fr_auto_auto] gap-2 items-end border-b border-border pb-3">
              <div className="col-span-2 sm:col-span-1">
                <label className={label} htmlFor={`sg-s${i}`}>Service</label>
                <input id={`sg-s${i}`} className={input} value={s.name} placeholder="Boiler service" onChange={(e) => setIn("services", i, { name: e.target.value })} />
              </div>
              <div>
                <label className={label} htmlFor={`sg-p${i}`}>Price (£)</label>
                <input id={`sg-p${i}`} className={input} inputMode="decimal" value={s.price} placeholder="85" onChange={(e) => setIn("services", i, { price: e.target.value })} />
              </div>
              <label className="flex items-center gap-1.5 text-[13px] text-mid pb-3">
                <input type="checkbox" checked={s.from} onChange={(e) => setIn("services", i, { from: e.target.checked })} /> &ldquo;From&rdquo;
              </label>
              <button type="button" className={`${btnSmall} mb-1`} onClick={() => removeIn("services", i)} aria-label={`Remove ${s.name || "service"}`}>Remove</button>
              <div className="col-span-2 sm:col-span-4">
                <input aria-label="Short description (optional)" className={input} value={s.note} placeholder="Short description (optional), e.g. includes parts up to £50" onChange={(e) => setIn("services", i, { note: e.target.value })} />
              </div>
            </div>
          ))}
        </div>
        <button type="button" className={`${btnGhost} mt-3`} onClick={() => set({ services: [...f.services, { name: "", price: "", from: false, note: "" }] })}>Add a service</button>

        <h3 className={`${h3} mt-6`}>The details customers ask about</h3>
        <div className="space-y-2 mt-3">
          {f.details.map((d, i) => (
            <div key={i} className="grid sm:grid-cols-[1fr_2fr_auto] gap-2">
              <input aria-label="Detail" className={input} value={d.label} onChange={(e) => setIn("details", i, { label: e.target.value })} />
              <input aria-label={`${d.label || "Detail"} answer`} className={input} value={d.value} placeholder="Your answer" onChange={(e) => setIn("details", i, { value: e.target.value })} />
              <button type="button" className={btnSmall} onClick={() => removeIn("details", i)}>Remove</button>
            </div>
          ))}
        </div>
        <button type="button" className={`${btnGhost} mt-3`} onClick={() => set({ details: [...f.details, { label: "", value: "" }] })}>Add a detail</button>
      </section>

      <section className={card} aria-labelledby="sg-more">
        <h2 id="sg-more" className={h2}>3. Locations, team and trust</h2>
        <h3 className={`${h3} mt-4`}>Other locations</h3>
        <p className={hint}>Only if you have more than one branch. Each gets its own block and schema.</p>
        {f.locations.map((l, i) => (
          <div key={i} className="grid sm:grid-cols-2 gap-2 mt-3 border-b border-border pb-3">
            <input aria-label="Location name" className={input} value={l.name} placeholder="Location name, e.g. Harrogate" onChange={(e) => setIn("locations", i, { name: e.target.value })} />
            <input aria-label="Street" className={input} value={l.street} placeholder="Street address" onChange={(e) => setIn("locations", i, { street: e.target.value })} />
            <input aria-label="Town" className={input} value={l.town} placeholder="Town" onChange={(e) => setIn("locations", i, { town: e.target.value })} />
            <input aria-label="Postcode" className={input} value={l.postcode} placeholder="Postcode" onChange={(e) => setIn("locations", i, { postcode: e.target.value })} />
            <input aria-label="Phone" className={input} value={l.phone} placeholder="Phone" onChange={(e) => setIn("locations", i, { phone: e.target.value })} />
            <button type="button" className={btnSmall} onClick={() => removeIn("locations", i)}>Remove location</button>
          </div>
        ))}
        <button type="button" className={`${btnGhost} mt-3`} onClick={() => set({ locations: [...f.locations, { name: "", street: "", town: "", postcode: "", phone: "" }] })}>Add a location</button>

        <h3 className={`${h3} mt-6`}>Meet the team</h3>
        {f.team.map((p, i) => (
          <div key={i} className="grid sm:grid-cols-2 gap-2 mt-3 border-b border-border pb-3">
            <input aria-label="Name" className={input} value={p.name} placeholder="Name" onChange={(e) => setIn("team", i, { name: e.target.value })} />
            <input aria-label="Role" className={input} value={p.role} placeholder="Role, e.g. Gas Safe engineer" onChange={(e) => setIn("team", i, { role: e.target.value })} />
            <input aria-label="Qualifications" className={input} value={p.qualifications} placeholder="Qualifications (comma separated)" onChange={(e) => setIn("team", i, { qualifications: e.target.value })} />
            <input aria-label="Years of experience" className={input} value={p.years} placeholder="Years of experience" inputMode="numeric" onChange={(e) => setIn("team", i, { years: e.target.value })} />
            <input aria-label="Photo URL" className={input} value={p.photo} placeholder="Photo URL (https://)" onChange={(e) => setIn("team", i, { photo: e.target.value })} />
            <button type="button" className={btnSmall} onClick={() => removeIn("team", i)}>Remove person</button>
          </div>
        ))}
        <button type="button" className={`${btnGhost} mt-3`} onClick={() => set({ team: [...f.team, { name: "", role: "", qualifications: "", years: "", photo: "" }] })}>Add a team member</button>

        <h3 className={`${h3} mt-6`}>Trust footer</h3>
        <div className="grid sm:grid-cols-2 gap-4 mt-3">
          {text("companyNumber", "Company number", "12345678")}
          {text("vatNumber", "VAT number", "GB123456789")}
          {text("returnsUrl", "Returns or guarantee policy URL", "https://")}
          {text("payments", "Payment methods", "Cash, Card, Bank transfer")}
        </div>
      </section>

      <section className={card} aria-labelledby="sg-out">
        <h2 id="sg-out" className={h2}>4. Copy it onto your site</h2>
        <p className="text-[14px] text-mid mt-2">Each block is plain HTML with its own class name to style. Paste the schema once per page, in the page&apos;s HTML or your site builder&apos;s custom code box.</p>
        <div className="flex flex-wrap gap-2 mt-4" role="group" aria-label="Block">
          {BLOCKS.map((b) => <button key={b} type="button" className={tabBtn(block === b)} aria-pressed={block === b} onClick={() => setBlock(b)}>{b}</button>)}
        </div>
        {block !== "Schema only" && <CodeOutput title={`${block} HTML`} code={html} />}
        <CodeOutput title="Schema (JSON-LD)" code={scriptTag(schema)} />
        <div className="flex flex-wrap gap-2 mt-4">
          <a className={btnGhost} href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer">Test it in Google&apos;s Rich Results Test</a>
          <button type="button" className={btnGhost} onClick={() => downloadText("all-blocks.html", BLOCKS.filter((b) => b !== "Schema only").map((b) => `<!-- ${b} -->\n${buildHtml(b, f)}`).join("\n\n") + "\n\n" + scriptTag(schema), "text/html")}>Download every block</button>
          <button type="button" className={btnGhost} onClick={() => confirm("Clear the whole form?") && setF(EMPTY)}>Start again</button>
        </div>
      </section>
    </div>
  );
}
