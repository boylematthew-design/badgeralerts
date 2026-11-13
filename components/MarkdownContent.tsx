"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";

// Plain text of a markdown syntax-tree node (used to get the raw code out of a ``` block).
type TreeNode = { type: string; value?: string; children?: TreeNode[]; properties?: { className?: unknown } };
function textOf(node: TreeNode | undefined): string {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(textOf).join("");
}

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

// baseLevel: the heading level a markdown "#" should render as, so headings written inside
// a tip always sit below the tip's own heading in the page outline (e.g. tip is H3 → "#" is H4).
export default function MarkdownContent({ content, baseLevel = 1 }: { content: string; baseLevel?: number }) {
  const tag = (offset: number) => `h${Math.min(baseLevel + offset, 6)}` as HeadingTag;
  const H1 = tag(0);
  const H2 = tag(1);
  const H3 = tag(2);
  return (
    <div className="text-[15px] text-mid leading-[1.7]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ ...props }) => <H1 className="font-heading font-extrabold tracking-[-0.04em] text-[24px] md:text-[28px] text-ink mt-8 mb-3" {...props} />,
          h2: ({ ...props }) => <H2 className="font-heading font-bold tracking-[-0.03em] text-[20px] md:text-[22px] text-ink mt-7 mb-3" {...props} />,
          h3: ({ ...props }) => <H3 className="text-[16px] md:text-[17px] text-ink font-semibold mt-6 mb-2" {...props} />,
          p: ({ ...props }) => <p className="mb-4" {...props} />,
          ul: ({ ...props }) => <ul className="list-disc pl-5 space-y-1.5 mb-4" {...props} />,
          ol: ({ ...props }) => <ol className="list-decimal pl-5 space-y-1.5 mb-4" {...props} />,
          li: ({ ...props }) => <li className="leading-[1.6]" {...props} />,
          a: ({ ...props }) => <a className="text-accent-dark underline hover:opacity-80 transition-opacity" target="_blank" rel="noopener noreferrer" {...props} />,
          strong: ({ ...props }) => <strong className="font-semibold text-ink" {...props} />,
          blockquote: ({ ...props }) => <blockquote className="border-l-2 border-border pl-4 italic text-muted my-4" {...props} />,
          // ``` blocks become a copyable code box. Raw HTML in tips is never rendered as HTML
          // (no rehype-raw), so pasted code always shows as text and can't run on the page.
          pre: ({ node }) => {
            const codeNode = (node as TreeNode | undefined)?.children?.find((c) => c.type === "element");
            const classes = codeNode?.properties?.className;
            const languageClass = (Array.isArray(classes) ? classes : []).find(
              (c): c is string => typeof c === "string" && c.startsWith("language-")
            );
            return <CodeBlock code={textOf(codeNode).replace(/\n$/, "")} language={languageClass?.slice(9)} />;
          },
          code: ({ ...props }) => <code className="bg-slate-100 text-ink rounded px-1.5 py-0.5 text-[13px] font-mono" {...props} />,
          hr: () => <hr className="border-border my-6" />,
          table: ({ ...props }) => <div className="overflow-x-auto mb-4"><table className="w-full text-left border-collapse" {...props} /></div>,
          th: ({ ...props }) => <th className="border-b border-border py-2 pr-4 font-semibold text-ink" {...props} />,
          td: ({ ...props }) => <td className="border-b border-border py-2 pr-4 align-top" {...props} />,
          // Logos from /public/tool-icons (e.g. a platform's favicon in a table) show small, inline
          // with the name. Self-hosted, so readers' browsers never call the other site. Any other
          // image shows at its own size, up to the column width.
          img: ({ src, alt }) =>
            typeof src === "string" && src.startsWith("/tool-icons/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={alt ?? ""} width={20} height={20} loading="lazy" className="inline-block w-5 h-5 rounded-[4px] mr-2 align-[-4px]" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} loading="lazy" className="max-w-full h-auto rounded-[14px]" />
            ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
