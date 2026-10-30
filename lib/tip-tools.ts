// A tip's optional tools (tips.tools column), shown in a "Tools" box under the tip. Server-side
// validation for the admin "Add a tip" and "Edit tip" forms lives here too. Never trust the
// browser's own checks: someone could post the form directly, so everything is re-checked here.

export interface TipTool {
  name: string;
  url: string;
  pricing: string; // e.g. "Free, paid plans available" — shown as a tooltip on the Free/Paid badge
  paid: boolean; // anything with a paid tier (freemium included) counts as paid
  description: string; // how the tool helps with this particular tip
  icon?: string | null; // self-hosted logo in /public/tool-icons, never an outside URL
}

export const MAX_TOOLS = 10;
export const MAX_TOOL_NAME_LENGTH = 120;
export const MAX_TOOL_PRICING_LENGTH = 160;
export const MAX_TOOL_DESCRIPTION_LENGTH = 500;

function isHttpUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

// Icons are files we host ourselves, so only a plain /tool-icons/<file>.png path is allowed.
function isToolIcon(value: string) {
  return /^\/tool-icons\/[a-z0-9.-]+\.png$/.test(value);
}

// The admin form sends the tools as JSON in a hidden "tools" field. Returns the cleaned list
// (rows left completely blank are dropped), or null if what was submitted isn't valid.
export function parseTipTools(formData: FormData): TipTool[] | null {
  const raw = (formData.get("tools") as string) ?? "";
  if (!raw.trim()) return [];

  let input: unknown;
  try {
    input = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!Array.isArray(input)) return null;

  const tools: TipTool[] = [];
  for (const item of input) {
    if (typeof item !== "object" || item === null) return null;
    const { name, url, pricing, paid, description, icon } = item as Record<string, unknown>;
    if (typeof name !== "string" || typeof url !== "string") return null;
    if (typeof pricing !== "string" || typeof description !== "string" || typeof paid !== "boolean") return null;

    const clean = {
      name: name.trim(),
      url: url.trim(),
      pricing: pricing.trim(),
      description: description.trim(),
    };
    if (!clean.name && !clean.url && !clean.description) continue;
    if (!clean.name || clean.name.length > MAX_TOOL_NAME_LENGTH) return null;
    // Only real web links — blocks javascript:, data: and other schemes that could run code.
    if (!isHttpUrl(clean.url)) return null;
    if (clean.pricing.length > MAX_TOOL_PRICING_LENGTH) return null;
    if (!clean.description || clean.description.length > MAX_TOOL_DESCRIPTION_LENGTH) return null;
    if (icon != null && (typeof icon !== "string" || !isToolIcon(icon))) return null;

    tools.push({ ...clean, paid, icon: (icon as string | null | undefined) ?? null });
  }

  if (tools.length > MAX_TOOLS) return null;
  return tools;
}
