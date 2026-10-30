"use client";

import { useState } from "react";
import {
  MAX_TOOLS,
  MAX_TOOL_DESCRIPTION_LENGTH,
  MAX_TOOL_NAME_LENGTH,
  MAX_TOOL_PRICING_LENGTH,
  type TipTool,
} from "@/lib/tip-tools";

const EMPTY_TOOL: TipTool = { name: "", url: "", pricing: "", paid: false, description: "", icon: null };

// Admin form fields for a tip's optional tools. Shared by the "Add a tip" and "Edit tip" pages.
// The list is sent to the server as JSON in a hidden "tools" field and re-checked there.
export default function TipToolsFields({ initial }: { initial?: TipTool[] | null }) {
  const [tools, setTools] = useState<TipTool[]>(initial ?? []);

  const inputClass =
    "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white";

  function updateTool(index: number, patch: Partial<TipTool>) {
    setTools((current) => current.map((tool, i) => (i === index ? { ...tool, ...patch } : tool)));
  }

  return (
    <fieldset className="border border-emerald-200 bg-emerald-50/40 rounded-2xl p-5 space-y-4">
      <legend className="px-2 text-sm font-bold text-slate-700">
        Tools <span className="text-slate-400 font-normal">(optional)</span>
      </legend>
      <p className="text-xs text-slate-500 -mt-1">
        Shows a Tools box under the tip. Each tool shows its logo, name, a Free or Paid badge (anything
        with a paid tier counts as Paid) and your explanation of how it helps with this tip.
      </p>

      <input type="hidden" name="tools" value={JSON.stringify(tools)} />

      {tools.map((tool, index) => (
        <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">Tool {index + 1}</span>
            <button
              type="button"
              onClick={() => setTools((current) => current.filter((_, i) => i !== index))}
              className="text-xs font-bold text-red-500 hover:text-red-600"
            >
              Remove tool
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              required
              maxLength={MAX_TOOL_NAME_LENGTH}
              value={tool.name}
              onChange={(e) => updateTool(index, { name: e.target.value })}
              placeholder="Tool name, e.g. Google Search Console"
              aria-label={`Tool ${index + 1} name`}
              className={inputClass}
            />
            <input
              required
              type="url"
              pattern="https?://.+"
              value={tool.url}
              onChange={(e) => updateTool(index, { url: e.target.value })}
              placeholder="https://..."
              aria-label={`Tool ${index + 1} link`}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-2 sm:items-center">
            <select
              value={tool.paid ? "paid" : "free"}
              onChange={(e) => updateTool(index, { paid: e.target.value === "paid" })}
              aria-label={`Tool ${index + 1} free or paid`}
              className={inputClass}
            >
              <option value="free">Free</option>
              <option value="paid">Paid (incl. freemium)</option>
            </select>
            <input
              maxLength={MAX_TOOL_PRICING_LENGTH}
              value={tool.pricing}
              onChange={(e) => updateTool(index, { pricing: e.target.value })}
              placeholder="Pricing note, e.g. Free, paid plans available"
              aria-label={`Tool ${index + 1} pricing note`}
              className={inputClass}
            />
          </div>
          <textarea
            required
            rows={2}
            maxLength={MAX_TOOL_DESCRIPTION_LENGTH}
            value={tool.description}
            onChange={(e) => updateTool(index, { description: e.target.value })}
            placeholder="How it helps with this tip, e.g. Shows how many people search each phrase."
            aria-label={`Tool ${index + 1} explanation`}
            className={inputClass}
          />
          {!tool.icon && (
            <p className="text-xs text-slate-400">No logo saved for this tool yet. Its first letter will show instead.</p>
          )}
        </div>
      ))}

      {tools.length < MAX_TOOLS && (
        <button
          type="button"
          onClick={() => setTools((current) => [...current, { ...EMPTY_TOOL }])}
          className="text-sm font-bold text-emerald-600 hover:text-emerald-700"
        >
          + Add tool
        </button>
      )}
    </fieldset>
  );
}
