const VALID_HOSTNAME = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

export function validateWebsite(raw: string): { url: string; error: string | null } {
  const trimmed = raw.trim();
  if (!trimmed) return { url: "", error: "Please enter your website URL." };

  // Add https:// if no scheme present
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(withScheme);
  } catch {
    return { url: "", error: "Please enter a valid website address, e.g. yoursite.co.uk" };
  }

  const hostname = parsed.hostname.toLowerCase();

  if (!VALID_HOSTNAME.test(hostname)) {
    return { url: "", error: "Please enter a valid website address, e.g. yoursite.co.uk" };
  }

  return { url: withScheme, error: null };
}
