// Escapes text before it goes into an HTML email. Anything a visitor types (name, message, etc.)
// must pass through this, otherwise they could inject their own HTML or fake links into the
// emails we receive.
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
