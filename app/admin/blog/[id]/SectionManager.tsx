"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import Link from "next/link";
import DeleteTipButton from "./DeleteTipButton";
import DeleteSectionButton from "./DeleteSectionButton";
import EditSectionTitle from "./EditSectionTitle";
import AddSectionForm from "./AddSectionForm";
import { reorderTips, reorderSections } from "./actions";

const UNSECTIONED = "unsectioned";

interface TipItem {
  id: string;
  title: string;
  content: string | null;
  published: boolean;
  section_id: string | null;
  sort_order: number;
}

interface SectionItem {
  id: string;
  title: string;
  sort_order: number;
}

interface SectionManagerProps {
  guide: { id: string; slug: string; title: string; topic_name: string };
  sections: SectionItem[];
  tips: TipItem[];
}

function GripIcon() {
  return (
    <svg width="12" height="20" viewBox="0 0 12 20" fill="currentColor" className="text-slate-300">
      <circle cx="3" cy="3" r="1.5" />
      <circle cx="9" cy="3" r="1.5" />
      <circle cx="3" cy="10" r="1.5" />
      <circle cx="9" cy="10" r="1.5" />
      <circle cx="3" cy="17" r="1.5" />
      <circle cx="9" cy="17" r="1.5" />
    </svg>
  );
}

function SortableTip({
  tip,
  index,
  guideId,
}: {
  tip: TipItem;
  index: number;
  guideId: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tip.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing flex-shrink-0 p-1 rounded hover:bg-slate-100 transition touch-none"
        aria-label="Drag to reorder"
      >
        <GripIcon />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-400">Tip {index + 1}</span>
          <h3 className="text-[15px] font-bold text-slate-900 truncate">{tip.title}</h3>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              tip.published ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
            }`}
          >
            {tip.published ? "Published" : "Draft"}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1 truncate">
          {tip.content?.slice(0, 100) || "No content yet"}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href={`/admin/blog/${guideId}/tips/${tip.id}/edit`}
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition"
        >
          Edit
        </Link>
        <DeleteTipButton tipId={tip.id} guideId={guideId} />
      </div>
    </div>
  );
}

function TipOverlay({ tip }: { tip: TipItem }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-emerald-400 p-4 shadow-lg flex items-center gap-3 max-w-2xl">
      <div className="flex-shrink-0 p-1">
        <GripIcon />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] font-bold text-slate-900 truncate">{tip.title}</h3>
      </div>
    </div>
  );
}

function DroppableContainer({
  id,
  children,
  label,
  isEmpty,
}: {
  id: string;
  children: React.ReactNode;
  label?: string;
  isEmpty?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border-2 border-dashed p-3 min-h-[60px] transition-colors ${
        isOver ? "border-emerald-400 bg-emerald-50/50" : "border-slate-200 bg-slate-50/50"
      }`}
    >
      {isEmpty && (
        <p className="text-xs text-slate-400 text-center py-4">
          Drag tips here{label ? ` to add them to "${label}"` : ""}
        </p>
      )}
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function SectionBlock({
  section,
  tips,
  guideId,
  globalTipIndex,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  section: SectionItem;
  tips: TipItem[];
  guideId: string;
  globalTipIndex: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const tipIds = tips.map((t) => t.id);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <EditSectionTitle
            sectionId={section.id}
            guideId={guideId}
            currentTitle={section.title}
          />
          <span className="text-xs text-slate-400">({tips.length})</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className="text-slate-400 hover:text-slate-600 disabled:opacity-30 p-1 rounded transition"
            title="Move section up"
          >
            ↑
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className="text-slate-400 hover:text-slate-600 disabled:opacity-30 p-1 rounded transition"
            title="Move section down"
          >
            ↓
          </button>
          <DeleteSectionButton sectionId={section.id} guideId={guideId} />
        </div>
      </div>

      <DroppableContainer id={section.id} label={section.title} isEmpty={tips.length === 0}>
        <SortableContext items={tipIds} strategy={verticalListSortingStrategy}>
          {tips.map((tip, i) => (
            <SortableTip
              key={tip.id}
              tip={tip}
              index={globalTipIndex + i}
              guideId={guideId}
            />
          ))}
        </SortableContext>
      </DroppableContainer>
    </div>
  );
}

export default function SectionManager({ guide, sections: initialSections, tips: initialTips }: SectionManagerProps) {
  const [localTips, setLocalTips] = useState<TipItem[]>(initialTips);
  const [localSections, setLocalSections] = useState<SectionItem[]>(initialSections);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const tipsRef = useRef(localTips);
  useEffect(() => { tipsRef.current = localTips; }, [localTips]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const unsectionedTips = useMemo(
    () => localTips.filter((t) => !t.section_id).sort((a, b) => a.sort_order - b.sort_order),
    [localTips]
  );

  const sectionGroups = useMemo(
    () =>
      localSections
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((section) => ({
          ...section,
          tips: localTips
            .filter((t) => t.section_id === section.id)
            .sort((a, b) => a.sort_order - b.sort_order),
        })),
    [localSections, localTips]
  );

  const activeTip = activeId ? localTips.find((t) => t.id === activeId) : null;

  const findContainer = useCallback(
    (tipId: string): string => {
      if (tipId === UNSECTIONED) return UNSECTIONED;
      if (localSections.some((s) => s.id === tipId)) return tipId;
      const tip = localTips.find((t) => t.id === tipId);
      return tip?.section_id || UNSECTIONED;
    },
    [localTips, localSections]
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);

    if (activeContainer === overContainer) return;

    setLocalTips((prev) =>
      prev.map((tip) =>
        tip.id === active.id
          ? { ...tip, section_id: overContainer === UNSECTIONED ? null : overContainer }
          : tip
      )
    );
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeContainer = findContainer(active.id as string);

    setLocalTips((prev) => {
      const containerTips = prev
        .filter((t) => (t.section_id || UNSECTIONED) === activeContainer)
        .sort((a, b) => a.sort_order - b.sort_order);

      const oldIndex = containerTips.findIndex((t) => t.id === active.id);
      const newIndex = containerTips.findIndex((t) => t.id === over.id);

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev;

      const reordered = [...containerTips];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);

      const updatedIds = new Map(reordered.map((t, i) => [t.id, i]));

      return prev.map((tip) => {
        const newOrder = updatedIds.get(tip.id);
        if (newOrder !== undefined) {
          return { ...tip, sort_order: newOrder };
        }
        return tip;
      });
    });

    // Small delay so the state update from setLocalTips commits before we read it
    setTimeout(() => saveTipOrder(), 50);
  }

  async function saveTipOrder() {
    setSaveStatus("saving");
    try {
      const currentTips = tipsRef.current;
      const orderedItems = currentTips.map((tip) => ({
        tipId: tip.id,
        sectionId: tip.section_id,
        sortOrder: tip.sort_order,
      }));
      const result = await reorderTips(guide.id, orderedItems);
      if (result?.error) {
        setSaveStatus("error");
      } else {
        setSaveStatus("saved");
      }
    } catch {
      setSaveStatus("error");
    }
    setTimeout(() => setSaveStatus("idle"), 2000);
  }

  async function handleMoveSection(sectionId: string, direction: "up" | "down") {
    const sorted = [...localSections].sort((a, b) => a.sort_order - b.sort_order);
    const index = sorted.findIndex((s) => s.id === sectionId);
    if (index === -1) return;

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;

    const tempOrder = sorted[index].sort_order;
    sorted[index] = { ...sorted[index], sort_order: sorted[swapIndex].sort_order };
    sorted[swapIndex] = { ...sorted[swapIndex], sort_order: tempOrder };

    setLocalSections(sorted);

    setSaveStatus("saving");
    try {
      const result = await reorderSections(
        guide.id,
        sorted.map((s) => ({ sectionId: s.id, sortOrder: s.sort_order }))
      );
      if (result?.error) {
        setSaveStatus("error");
      } else {
        setSaveStatus("saved");
      }
    } catch {
      setSaveStatus("error");
    }
    setTimeout(() => setSaveStatus("idle"), 2000);
  }

  const unsectionedTipIds = unsectionedTips.map((t) => t.id);

  let globalIndex = 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-slate-900">
          Tips <span className="text-slate-400 font-medium">({localTips.length})</span>
        </h2>
        <div className="flex items-center gap-3">
          {saveStatus === "saving" && (
            <span className="text-xs text-slate-400">Saving...</span>
          )}
          {saveStatus === "saved" && (
            <span className="text-xs text-emerald-600">Saved</span>
          )}
          {saveStatus === "error" && (
            <span className="text-xs text-red-500">Error saving</span>
          )}
          <Link
            href={`/admin/blog/${guide.id}/tips/new`}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition"
          >
            + Add tip
          </Link>
        </div>
      </div>

      {localTips.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <p className="text-4xl mb-4">💡</p>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No tips yet</h3>
          <p className="text-slate-400 text-sm">Add your first tip to start building this guide.</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {unsectionedTips.length > 0 && localSections.length > 0 && (
            <div className="space-y-2">
              <div className="px-1">
                <span className="text-sm font-bold text-slate-500">Unsectioned</span>
                <span className="text-xs text-slate-400 ml-2">({unsectionedTips.length})</span>
              </div>
              <DroppableContainer id={UNSECTIONED} isEmpty={unsectionedTips.length === 0}>
                <SortableContext items={unsectionedTipIds} strategy={verticalListSortingStrategy}>
                  {unsectionedTips.map((tip) => {
                    const el = (
                      <SortableTip
                        key={tip.id}
                        tip={tip}
                        index={globalIndex}
                        guideId={guide.id}
                      />
                    );
                    globalIndex++;
                    return el;
                  })}
                </SortableContext>
              </DroppableContainer>
            </div>
          )}

          {localSections.length === 0 && (
            <DroppableContainer id={UNSECTIONED} isEmpty={localTips.length === 0}>
              <SortableContext items={unsectionedTipIds} strategy={verticalListSortingStrategy}>
                {unsectionedTips.map((tip) => {
                  const el = (
                    <SortableTip
                      key={tip.id}
                      tip={tip}
                      index={globalIndex}
                      guideId={guide.id}
                    />
                  );
                  globalIndex++;
                  return el;
                })}
              </SortableContext>
            </DroppableContainer>
          )}

          {sectionGroups.map((group, groupIndex) => {
            const block = (
              <SectionBlock
                key={group.id}
                section={group}
                tips={group.tips}
                guideId={guide.id}
                globalTipIndex={globalIndex}
                onMoveUp={() => handleMoveSection(group.id, "up")}
                onMoveDown={() => handleMoveSection(group.id, "down")}
                isFirst={groupIndex === 0}
                isLast={groupIndex === sectionGroups.length - 1}
              />
            );
            globalIndex += group.tips.length;
            return block;
          })}

          <DragOverlay>
            {activeTip ? <TipOverlay tip={activeTip} /> : null}
          </DragOverlay>
        </DndContext>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <p className="text-sm font-bold text-slate-700 mb-3">Add a section</p>
        <AddSectionForm guideId={guide.id} />
        <p className="text-xs text-slate-400 mt-2">
          Sections group tips under headings on the public page. Drag tips between sections to organise them.
        </p>
      </div>
    </div>
  );
}
