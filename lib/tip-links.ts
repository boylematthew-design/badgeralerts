// A tip's optional "Relevant links" (tip_links table), shown under the tip on the guide page.
// The admin "Add a tip" and "Edit tip" forms send the whole list as JSON in a hidden "links" field,
// and it's saved together with the tip. Never trust the browser: everything is re-checked here.

import type { SupabaseClient } from "@supabase/supabase-js";

export interface TipLinkInput {
  url: string;
  context: string | null;
  preview_title: string | null;
  preview_description: string | null;
  preview_favicon: string | null;
}

export const MAX_TIP_LINKS = 10;
export const MAX_LINK_URL_LENGTH = 2000;
export const MAX_LINK_CONTEXT_LENGTH = 300;
const MAX_PREVIEW_TITLE_LENGTH = 300;
const MAX_PREVIEW_DESCRIPTION_LENGTH = 600;

// Only real web links. Blocks javascript:, data: and other schemes that could run code when clicked.
export function isHttpUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function optionalText(value: unknown, max: number): string | null | undefined {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") return undefined;
  const clean = value.trim();
  return clean ? clean.slice(0, max) : null;
}

// Returns the cleaned list, or null if what was submitted isn't valid.
export function parseTipLinks(formData: FormData): TipLinkInput[] | null {
  const raw = (formData.get("links") as string) ?? "";
  if (!raw.trim()) return [];

  let input: unknown;
  try {
    input = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!Array.isArray(input) || input.length > MAX_TIP_LINKS) return null;

  const links: TipLinkInput[] = [];
  for (const item of input) {
    if (typeof item !== "object" || item === null) return null;
    const i = item as Record<string, unknown>;
    if (typeof i.url !== "string") return null;
    const url = i.url.trim();
    if (!isHttpUrl(url) || url.length > MAX_LINK_URL_LENGTH) return null;

    const context = optionalText(i.context, MAX_LINK_CONTEXT_LENGTH);
    const title = optionalText(i.preview_title, MAX_PREVIEW_TITLE_LENGTH);
    const description = optionalText(i.preview_description, MAX_PREVIEW_DESCRIPTION_LENGTH);
    let favicon = optionalText(i.preview_favicon, MAX_LINK_URL_LENGTH);
    if (context === undefined || title === undefined || description === undefined || favicon === undefined) return null;
    if (favicon && !isHttpUrl(favicon)) favicon = null; // a bad icon just isn't shown, no need to reject

    links.push({ url, context, preview_title: title, preview_description: description, preview_favicon: favicon });
  }
  return links;
}

// Replaces a tip's links with the given list, in order. Uses the admin (service role) client,
// so only call it after checking the user is an admin.
export async function saveTipLinks(admin: SupabaseClient, tipId: string, links: TipLinkInput[]) {
  await admin.from("tip_links").delete().eq("tip_id", tipId);
  if (links.length === 0) return;
  await admin.from("tip_links").insert(links.map((link, i) => ({ ...link, tip_id: tipId, sort_order: i })));
}
