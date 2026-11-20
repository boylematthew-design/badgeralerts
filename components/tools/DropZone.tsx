"use client";

import { useRef, useState } from "react";

// File picker that also accepts drag and drop. Files are read in the browser only.
export default function DropZone({
  accept,
  multiple = false,
  onFiles,
  title,
  hint,
}: {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  title: string;
  hint?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const files = Array.from(e.dataTransfer.files ?? []);
        if (files.length) onFiles(multiple ? files : files.slice(0, 1));
      }}
      className={`rounded-[16px] border-2 border-dashed px-4 py-8 sm:py-10 text-center transition-colors ${over ? "border-accent bg-accent-light" : "border-border-strong bg-white"}`}
    >
      <p className="font-heading font-bold text-[17px] text-ink">{title}</p>
      {hint && <p className="text-[13px] text-muted mt-1">{hint}</p>}
      <button type="button" className="btn-light inline-flex px-4 py-2.5 text-[14px] mt-4" onClick={() => ref.current?.click()}>
        Choose {multiple ? "files" : "a file"}
      </button>
      <input
        ref={ref}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        aria-label={title}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onFiles(files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
