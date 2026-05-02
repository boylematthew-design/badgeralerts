"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { updateFullName } from "./actions";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-sm font-bold px-4 py-2 rounded-lg transition"
    >
      {pending ? "Saving..." : "Save"}
    </button>
  );
}

export default function EditNameForm({ currentName }: { currentName: string }) {
  const [editing, setEditing] = useState(false);

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Full name</p>
      {editing ? (
        <form action={updateFullName} className="flex items-center gap-2 mt-1">
          <input
            name="full_name"
            required
            defaultValue={currentName}
            autoFocus
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <SaveButton />
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-sm text-slate-400 hover:text-slate-600 font-semibold px-2 py-2 transition"
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-slate-800 font-semibold">{currentName || "—"}</p>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-bold transition"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
