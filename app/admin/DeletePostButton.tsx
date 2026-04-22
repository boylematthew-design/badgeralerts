"use client";

import { deletePost } from "./actions";

export default function DeletePostButton({ postId }: { postId: string }) {
  return (
    <form
      action={deletePost}
      onSubmit={(e) => {
        if (!confirm("Delete this alert? This will also remove all assignments.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="post_id" value={postId} />
      <button
        type="submit"
        className="text-slate-400 hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl text-sm font-bold transition"
      >
        Delete
      </button>
    </form>
  );
}
