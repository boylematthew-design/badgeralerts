export function replacePlaceholders(
  text: string,
  user: { full_name?: string | null; website?: string | null }
): string {
  const firstName = user.full_name?.split(" ")[0] ?? "";

  return text
    .replace(/\{name\}/gi, user.full_name ?? "")
    .replace(/\{first_name\}/gi, firstName)
    .replace(/\{website\}/gi, user.website ?? "");
}
