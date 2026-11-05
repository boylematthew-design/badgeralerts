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
  // What's in the database. Shown instead of the props because SectionManager keeps its own copy of
  // the sections for drag-and-drop and doesn't pick up the refreshed data after a save.
  const [saved, setSaved] = useState({ title: currentTitle, description: currentDescription ?? "" });

  async function save(newTitle: string, newDescription: string) {
    const formData = new FormData();
    formData.set("section_id", sectionId);
    formData.set("guide_id", guideId);
    formData.set("title", newTitle);
    formData.set("description", newDescription);
    setSaved({ title: newTitle, description: newDescription });
    await updateSection(formData);
  }

  async function handleSaveTitle() {
    const trimmed = title.trim();
    if (!trimmed) {
      setTitle(saved.title);
      setEditingTitle(false);
      return;
    }
    setTitle(trimmed);
    setEditingTitle(false);
    if (trimmed !== saved.title) await save(trimmed, saved.description);
  }

  async function handleSaveDescription() {
    const trimmed = description.trim();
    setDescription(trimmed);
    setEditingDesc(false);
    if (trimmed !== saved.description) await save(saved.title, trimmed);
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
            if (e.key === "Escape") { setTitle(saved.title); setEditingTitle(false); }
          }}
          autoFocus
          className="text-sm font-bold text-slate-700 border border-emerald-400 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-0 w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditingTitle(true)}
          className="text-sm font-bold text-slate-700 hover:text-emerald-600 transition cursor-pointer"
          title="Click to rename"
        >
          {saved.title}
        </button>
      )}

      {editingDesc ? (
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleSaveDescription}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSaveDescription();
            if (e.key === "Escape") { setDescription(saved.description); setEditingDesc(false); }
          }}
          autoFocus
          placeholder="Add a subheading..."
          className="text-xs text-slate-500 border border-emerald-400 rounded-lg px-2 py-1 mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-0 w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditingDesc(true)}
          className="block text-xs text-slate-400 hover:text-emerald-600 transition cursor-pointer mt-0.5 text-left"
          title="Click to edit subheading"
        >
          {saved.description || "+ Add subheading"}
        </button>
      )}
    </div>
  );
}
