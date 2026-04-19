"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { assignPostsToUser } from "./actions";

type Post = {
  id: string;
  title: string;
  category: string | null;
};

type Props = {
  userId: string;
  posts: Post[];
  assignedPostIds: string[];
};

export default function PostAssigner({ userId, posts, assignedPostIds }: Props) {
  const router = useRouter();
  const assigned = new Set(assignedPostIds);
  const [selections, setSelections] = useState<Record<string, { checked: boolean; date: string }>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedCount = Object.values(selections).filter((s) => s.checked && s.date).length;
  const missingDates = Object.values(selections).filter((s) => s.checked && !s.date).length;

  function toggle(postId: string) {
    setSelections((prev) => ({
      ...prev,
      [postId]: {
        checked: !prev[postId]?.checked,
        date: prev[postId]?.date ?? "",
      },
    }));
  }

  function setDate(postId: string, date: string) {
    setSelections((prev) => ({
      ...prev,
      [postId]: { ...prev[postId], date },
    }));
  }

  async function handleSubmit() {
    if (missingDates > 0) {
      setError("Please set a date for every selected alert.");
      return;
    }

    const toAssign = Object.entries(selections)
      .filter(([_, s]) => s.checked && s.date)
      .map(([postId, s]) => ({ postId, date: s.date }));

    if (toAssign.length === 0) return;

    setLoading(true);
    setError("");

    const result = await assignPostsToUser(userId, toAssign);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSelections({});
    setLoading(false);
    router.refresh();
  }

  return (
    <div>
      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <p className="text-4xl mb-4">📭</p>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No alerts available</h3>
          <p className="text-slate-400 text-sm">Create some alerts first from the Alerts section.</p>
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-24">
            {posts.map((post) => {
              const isAssigned = assigned.has(post.id);
              const sel = selections[post.id];

              return (
                <div
                  key={post.id}
                  className={`bg-white rounded-2xl border px-5 py-4 transition-all ${
                    isAssigned
                      ? "opacity-40 border-slate-200 cursor-not-allowed"
                      : sel?.checked
                      ? "border-emerald-300 shadow-sm"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      disabled={isAssigned}
                      checked={sel?.checked ?? false}
                      onChange={() => toggle(post.id)}
                      className="w-5 h-5 rounded accent-emerald-500 flex-shrink-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {post.category && (
                          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            {post.category}
                          </span>
                        )}
                        {isAssigned && (
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            Already assigned
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-slate-900 mt-1">{post.title}</p>
                    </div>
                    {sel?.checked && !isAssigned && (
                      <input
                        type="datetime-local"
                        value={sel.date}
                        onChange={(e) => setDate(post.id, e.target.value)}
                        className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex-shrink-0"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky footer bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between gap-4 z-50">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                {selectedCount} alert{selectedCount !== 1 ? "s" : ""} selected
              </p>
              {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
              {missingDates > 0 && !error && (
                <p className="text-xs text-amber-500 mt-0.5">{missingDates} selected alert{missingDates !== 1 ? "s" : ""} still need{missingDates === 1 ? "s" : ""} a date</p>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || selectedCount === 0}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Assigning..." : "Assign alerts"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
