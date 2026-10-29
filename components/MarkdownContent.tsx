"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
          code: ({ ...props }) => <code className="bg-slate-100 text-ink rounded px-1.5 py-0.5 text-[13px] font-mono" {...props} />,
          hr: () => <hr className="border-border my-6" />,
          table: ({ ...props }) => <div className="overflow-x-auto mb-4"><table className="w-full text-left border-collapse" {...props} /></div>,
          th: ({ ...props }) => <th className="border-b border-border py-2 pr-4 font-semibold text-ink" {...props} />,
          td: ({ ...props }) => <td className="border-b border-border py-2 pr-4" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
