"use client";

import { useFormStatus } from "react-dom";
import { createSection } from "./actions";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-sm transition disabled:opacity-50"
    >
      {pending ? "Adding..." : "Add"}
    </button>
  );
}

export default function AddSectionForm({ guideId }: { guideId: string }) {
  return (
    <form action={createSection} className="space-y-3">
      <input type="hidden" name="guide_id" value={guideId} />
      <div className="flex items-center gap-3">
        <input
          name="title"
          required
          placeholder="Section name, e.g. Photos & Media"
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <SubmitBtn />
      </div>
      <input
        name="description"
        placeholder="Optional subheading shown below the section title on the guide"
        className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
    </form>
  );
}
