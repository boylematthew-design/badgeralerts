"use client";

import { useState } from "react";
import { updateSection } from "./actions";

export default function EditSectionTitle({
  sectionId,
  guideId,
  currentTitle,
  currentDescription,
}: {
  sectionId: string;
  guideId: string;
  currentTitle: string;
  currentDescription: string | null;
}) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription ?? "");

  async function save(newTitle: string, newDescription: string) {
    const formData = new FormData();
    formData.set("section_id", sectionId);
    formData.set("guide_id", guideId);
    formData.set("title", newTitle);
    formData.set("description", newDescription);
    await updateSection(formData);
  }

  async function handleSaveTitle() {
    const trimmed = title.trim();
    if (!trimmed) {
      setTitle(currentTitle);
      setEditingTitle(false);
      return;
    }
    if (trimmed !== currentTitle) {
      await save(trimmed, description);
    }
    setEditingTitle(false);
  }

  async function handleSaveDescription() {
    const trimmed = description.trim();
    if (trimmed !== (currentDescription ?? "")) {
      await save(title, trimmed);
    }
    setEditingDesc(false);
  }

  return (
    <div className="min-w-0">
      {editingTitle ? (
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSaveTitle}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSaveTitle();
            if (e.key === "Escape") { setTitle(currentTitle); setEditingTitle(false); }
          }}
          autoFocus
          className="text-sm font-bold text-slate-700 border border-emerald-400 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-0 w-full"
        />
      ) : (
        <button
          onClick={() => setEditingTitle(true)}
          className="text-sm font-bold text-slate-700 hover:text-emerald-600 transition cursor-pointer"
          title="Click to rename"
        >
          {currentTitle}
        </button>
      )}

      {editingDesc ? (
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleSaveDescription}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSaveDescription();
            if (e.key === "Escape") { setDescription(currentDescription ?? ""); setEditingDesc(false); }
          }}
          autoFocus
          placeholder="Add a subheading..."
          className="text-xs text-slate-500 border border-emerald-400 rounded-lg px-2 py-1 mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-0 w-full"
        />
      ) : (
        <button
          onClick={() => setEditingDesc(true)}
          className="block text-xs text-slate-400 hover:text-emerald-600 transition cursor-pointer mt-0.5 text-left"
          title="Click to edit subheading"
        >
          {currentDescription || "+ Add subheading"}
        </button>
      )}
    </div>
  );
}
