"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/delete-account", { method: "DELETE" });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/");
  }

  if (confirming) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
        <h4 className="font-extrabold text-rose-700 mb-2">Are you absolutely sure?</h4>
        <p className="text-sm text-rose-600 mb-6 leading-relaxed">
          This will permanently delete your account and all your data. This cannot be undone.
        </p>
        {error && (
          <p className="text-sm text-rose-700 font-semibold mb-4">{error}</p>
        )}
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="bg-rose-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-rose-700 transition disabled:opacity-60 disabled:cursor-not-allowed text-sm"
          >
            {loading ? "Deleting..." : "Yes, delete my account"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="bg-white border border-rose-200 text-rose-600 px-6 py-2.5 rounded-xl font-bold hover:bg-rose-50 transition text-sm"
    >
      Delete my account
    </button>
  );
}
