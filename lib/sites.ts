// Every site sharing this Supabase project as its "master" database. Guides
// are tagged with one of these via their `site` column (see migration 006).
// Adding a new site here is the only change needed to offer it in the admin
// — the dropdown and filter on the guides list both read from this list.
export const SITES = [
  { value: "badgeralerts", label: "BadgerAlerts" },
  { value: "localmapsmarketing", label: "Local Maps Marketing" },
] as const;

export type SiteValue = (typeof SITES)[number]["value"];

export const DEFAULT_SITE: SiteValue = "badgeralerts";

export function siteLabel(value: string): string {
  return SITES.find((s) => s.value === value)?.label ?? value;
}
