"use client";

import { deleteGuide } from "./actions";

export default function DeleteGuideButton({ guideId }: { guideId: string }) {
  return (
    <form
      action={deleteGuide}
      onSubmit={(e) => {
        if (!confirm("Delete this guide and all of its tips? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="guide_id" value={guideId} />
      <button
        type="submit"
        className="text-slate-400 hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl text-sm font-bold transition"
      >
        Delete guide
      </button>
    </form>
  );
}
