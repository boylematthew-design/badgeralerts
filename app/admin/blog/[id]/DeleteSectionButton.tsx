"use client";

import { deleteSection } from "./actions";

export default function DeleteSectionButton({ sectionId, guideId }: { sectionId: string; guideId: string }) {
  return (
    <form
      action={deleteSection}
      onSubmit={(e) => {
        if (!confirm("Delete this section? The tips inside it will become unsectioned (they won't be deleted).")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="section_id" value={sectionId} />
      <input type="hidden" name="guide_id" value={guideId} />
      <button
        type="submit"
        className="text-slate-400 hover:text-red-500 text-xs font-semibold transition"
      >
        Remove
      </button>
    </form>
  );
}
