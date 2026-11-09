// A tip's optional "Help" box (tips.help_enabled, tips.help_text): a call to action under tips that a
// small business owner might struggle to do alone, linking to a contact form pre-filled with the tip.
// Server-side validation for the admin "Add a tip" and "Edit tip" forms lives here too. Never trust
// the browser's own checks: someone could post the form directly, so everything is re-checked here.

export const MAX_HELP_TEXT_LENGTH = 120;
export const HELP_SUBJECT = "Help with a tip"; // must match an option in the contact form's Subject list

export interface TipHelpFields {
  help_enabled: boolean;
  help_text: string | null;
}

// Returns the cleaned fields, or null if what was submitted isn't valid.
export function parseTipHelp(formData: FormData): TipHelpFields | null {
  const enabled = formData.get("help_enabled") === "on";
  const text = ((formData.get("help_text") as string) ?? "").trim().replace(/\s+/g, " ").replace(/[?.!]+$/, "");
  if (text.length > MAX_HELP_TEXT_LENGTH) return null;
  return { help_enabled: enabled, help_text: text || null };
}

// What the box asks: "Need help with getting AI agents to find your website?", or with the tip's
// own title in quotes when no phrase was written.
export function helpQuestion(tipTitle: string, helpText: string | null): string {
  return helpText ? `Need help with ${helpText}?` : `Need help with “${tipTitle}”?`;
}

// The contact form link. The form only accepts subjects from its own list, and treats the tip and
// guide names as plain text to pre-fill the message, so nothing here can inject anything.
export function helpContactHref(tipTitle: string, guideName: string, pageUrl: string): string {
  const params = new URLSearchParams({ subject: HELP_SUBJECT, tip: tipTitle, guide: guideName, page: pageUrl });
  return `/contact?${params.toString()}`;
}
