import type { JobApplication } from "@/lib/api";
import { STAGE_MAP } from "@/lib/api";
import ApplicationCard from "./ApplicationCard";
import { useState, useEffect, useRef } from "react";

const COLLAPSED_MAX_HEIGHT = 350;

export default function StageSection({
  stageKey,
  apps,
  onCardClick,
  isOver,
  draggingAppId,
  onDragStart,
  onDragEnd,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  style,
}: {
  stageKey: string;
  apps: JobApplication[];
  onCardClick: (id: string) => void;
  isOver: boolean;
  draggingAppId: string | null;
  onDragStart: (e: React.DragEvent, appId: string, stageKey: string) => void;
  onDragEnd: () => void;
  onDragEnter: (stageKey: string) => void;
  onDragLeave: (stageKey: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, stageKey: string) => void;
  style?: React.CSSProperties;
}) {
  const stage = STAGE_MAP[stageKey];

  const [expanded, setExpanded] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    setOverflows(el.scrollHeight > COLLAPSED_MAX_HEIGHT);
  }, [apps.length]);

  const showFade = !expanded && overflows;
  if (!stage) return null;

  return (
    <div
      onDragEnter={() => onDragEnter(stageKey)}
      onDragLeave={() => onDragLeave(stageKey)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, stageKey)}
      className={`w-full border border-[#1e1e2e] flex-col min-w-[240px] flex rounded-xl  overflow-hidden animate-fade-in-up bg-[#0a0a0f]  ${isOver ? "bg-indigo-500/[0.03]" : ""}`}
      // className={`w-[240px] min-w-[240px] flex flex-col h-full overflow-y-auto animate-fade-in-up bg-[#0a0a0f] ${
      //   !isLast ? "border-r border-[#1e1e2e]" : ""
      // } ${isOver ? "bg-indigo-500/[0.03]" : ""}`}
      style={style}
    >
      {/* Column header */}
      <div className="px-3.5 pt-3.5 pb-2.5 sticky top-0 bg-[#0a0a0f] border-b border-[#131320] z-10 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[7px]">
            <span
              className="w-[7px] h-[7px] rounded-full block shrink-0"
              style={{ background: stage.color }}
            />
            <span className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase">
              {stage.label}
            </span>
          </div>
          <span className="text-[10px] text-slate-600 font-bold bg-white/[0.05] px-1.5 py-px rounded-lg">
            {apps.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="relative">
        <div
          ref={listRef}
          className={`p-2 flex flex-col gap-1.5 min-h-[80px] transition-all duration-300 ${
            isOver ? "bg-indigo-500/[0.02]" : ""
          } ${!expanded ? "overflow-y-auto scrollbar-hide" : ""}`}
          style={!expanded ? { maxHeight: COLLAPSED_MAX_HEIGHT } : undefined}
        >
          {apps.length === 0 && (
            <div className="flex items-center justify-center py-6">
              <p
                className={`text-xs ${isOver ? "text-indigo-400/50" : "text-white/15"}`}
              >
                {isOver ? "Drop here" : "No applications"}
              </p>
            </div>
          )}
          {apps.map((app, i) => (
            <ApplicationCard
              app={app}
              key={app.id}
              index={i}
              stageKey={stageKey}
              onClick={() => onCardClick(app.id)}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              isDragging={draggingAppId === app.id}
            />
          ))}
        </div>
        {showFade && (
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-zinc-950/90 to-transparent pointer-events-none" />
        )}
      </div>
      {overflows && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full py-2 text-[11px] font-medium text-white/35 hover:text-white/60 transition-colors border-t border-white/[0.04]"
        >
          {expanded ? "Show less" : `Show all ${apps.length}`}
        </button>
      )}
    </div>
  );
}
