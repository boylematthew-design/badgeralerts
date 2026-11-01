// Tidies tip text before it's saved, so lists render as real <ul>/<ol> lists that search engines
// and AI tools recognise. Tip content is markdown (see components/MarkdownContent.tsx), where a list
// item is a line starting with "- " or "1. ". Lists pasted from Google Docs, Word or Notes arrive with
// "•", "●", "–" or emoji bullets instead, which markdown would show as one plain paragraph.

// A pasted bullet: •, ●, ▪, ◦, ‣, ·, –, —, a single *, or a tick/arrow emoji, then the item text.
const PASTED_BULLET = /^(\s*)(?:[•●▪◦‣·–—+]|\*(?!\*)|✅|✔️?|✓|→|➡️?|👉)\s*(?=\S)/u;
// "1)" style numbering, which markdown doesn't treat as a list as reliably as "1.".
const PAREN_NUMBER = /^(\s*)(\d+)\)\s+(?=\S)/;
const LIST_ITEM = /^\s*(?:[-*+]|\d+\.)\s+\S/;

export function isListItem(line: string) {
  return LIST_ITEM.test(line);
}

export function normalizeTipContent(text: string): string {
  const lines = text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+$/, "").replace(PASTED_BULLET, "$1- ").replace(PAREN_NUMBER, "$1$2. "));

  // A list needs a blank line between it and ordinary paragraphs: without one before it, some
  // lists render as plain text, and a paragraph straight after a list gets swallowed into the last item.
  const out: string[] = [];
  lines.forEach((line, i) => {
    const prev = out[out.length - 1];
    if (i > 0 && line !== "" && prev !== "" && isListItem(line) !== isListItem(prev)) out.push("");
    out.push(line);
  });
  return out.join("\n").trim();
}
