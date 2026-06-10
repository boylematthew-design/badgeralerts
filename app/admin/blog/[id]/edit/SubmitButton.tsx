"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? "Saving..." : "Save guide"}
    </button>
  );
}
