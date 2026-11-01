// Tidies tip text before it's saved, so lists and tables render as real <ul>/<ol>/<table> HTML that
// search engines and AI tools recognise. Tip content is markdown (see components/MarkdownContent.tsx):
// a list item is a line starting with "- " or "1. ", and a table is "| a | b |" rows under a
// "| --- | --- |" line. Pasted content often arrives in other shapes, which markdown would show as
// one plain paragraph:
// - lists from Google Docs, Word or Notes use "•", "●", "–" or emoji bullets
// - tables copied from Claude, ChatGPT, Docs, Word, Excel or a web page arrive as tab-separated rows

// A pasted bullet: •, ●, ▪, ◦, ‣, ·, –, —, a single *, or a tick/arrow emoji, then the item text.
const PASTED_BULLET = /^(\s*)(?:[•●▪◦‣·–—+]|\*(?!\*)|✅|✔️?|✓|→|➡️?|👉)\s*(?=\S)/u;
// "1)" style numbering, which markdown doesn't treat as a list as reliably as "1.".
const PAREN_NUMBER = /^(\s*)(\d+)\)\s+(?=\S)/;
const LIST_ITEM = /^\s*(?:[-*+]|\d+\.)\s+\S/;
const TABLE_ROW = /^\s*\|/;

export const TABLE_TEMPLATE = "| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n|  |  |  |\n|  |  |  |";

type Kind = "blank" | "list" | "table" | "text";

function kindOf(line: string): Kind {
  if (line.trim() === "") return "blank";
  if (LIST_ITEM.test(line)) return "list";
  if (TABLE_ROW.test(line)) return "table";
  return "text";
}

// Turns 2+ consecutive tab-separated lines into a markdown table, using the first line as the header.
function tabsToTables(lines: string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < lines.length; ) {
    let j = i;
    while (j < lines.length && lines[j].includes("\t") && kindOf(lines[j]) !== "list") j++;
    if (j - i < 2) {
      out.push(lines[i]);
      i++;
      continue;
    }
    const rows = lines.slice(i, j).map((l) => l.split("\t").map((c) => c.trim().replace(/\|/g, "\\|")));
    const width = Math.max(...rows.map((r) => r.length));
    const row = (cells: string[]) =>
      `| ${Array.from({ length: width }, (_, k) => cells[k] ?? "").join(" | ")} |`;
    out.push(row(rows[0]), row(Array(width).fill("---")), ...rows.slice(1).map(row));
    i = j;
  }
  return out;
}

export function normalizeTipContent(text: string): string {
  const lines = tabsToTables(
    text
      .replace(/\r\n?/g, "\n")
      .split("\n")
      .map((line) => line.replace(PASTED_BULLET, "$1- ").replace(PAREN_NUMBER, "$1$2. "))
  ).map((line) => line.replace(/\s+$/, ""));

  // Lists and tables need a blank line between them and ordinary paragraphs. Without one before,
  // they can render as plain text; without one after, the next paragraph is swallowed into the last
  // list item or table row.
  const out: string[] = [];
  for (const line of lines) {
    const prev = out[out.length - 1];
    const kind = kindOf(line);
    if (prev !== undefined && kind !== "blank" && kindOf(prev) !== "blank" && kind !== kindOf(prev)) out.push("");
    out.push(line);
  }
  return out.join("\n").trim();
}
