"use client";

import { deleteTip } from "./actions";

export default function DeleteTipButton({ tipId, guideId }: { tipId: string; guideId: string }) {
  return (
    <form
      action={deleteTip}
      onSubmit={(e) => {
        if (!confirm("Delete this tip? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="tip_id" value={tipId} />
      <input type="hidden" name="guide_id" value={guideId} />
      <button
        type="submit"
        className="text-slate-400 hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl text-sm font-bold transition"
      >
        Delete
      </button>
    </form>
  );
}
