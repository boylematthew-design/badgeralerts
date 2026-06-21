"use client";

import { useState, useRef } from "react";
import { updateSection } from "./actions";

export default function EditSectionTitle({
  sectionId,
  guideId,
  currentTitle,
}: {
  sectionId: string;
  guideId: string;
  currentTitle: string;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSave() {
    const trimmed = title.trim();
    if (!trimmed || trimmed === currentTitle) {
      setTitle(currentTitle);
      setEditing(false);
      return;
    }

    const formData = new FormData();
    formData.set("section_id", sectionId);
    formData.set("guide_id", guideId);
    formData.set("title", trimmed);
    await updateSection(formData);
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") {
            setTitle(currentTitle);
            setEditing(false);
          }
        }}
        autoFocus
        className="text-sm font-bold text-slate-700 border border-emerald-400 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-0"
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="text-sm font-bold text-slate-700 hover:text-emerald-600 transition cursor-pointer"
      title="Click to rename"
    >
      {currentTitle}
    </button>
  );
}
