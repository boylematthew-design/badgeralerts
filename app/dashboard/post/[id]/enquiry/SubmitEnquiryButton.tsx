"use client";
import { useFormStatus } from "react-dom";

export default function SubmitEnquiryButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-slate-900 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm transition shadow-sm"
    >
      {pending ? "Sending..." : "Send enquiry"}
    </button>
  );
}
