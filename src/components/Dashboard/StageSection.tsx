import { useState, useRef, useEffect } from "react";
import type { JobApplication } from "@/lib/api";
import { STAGE_MAP } from "@/lib/api";
import ApplicationCard from "./ApplicationCard";
import { HStack } from "@/components/ui/stacks";
import { TextHeadline } from "@/components/ui/text/TextHeadline";
import { TextLabel1 } from "@/components/ui/text/TextLabel1";

const COLLAPSED_MAX_HEIGHT = 420;

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

  if (!stage) return null;

  const showFade = !expanded && overflows;

  return (
    <div
      onDragEnter={() => onDragEnter(stageKey)}
      onDragLeave={() => onDragLeave(stageKey)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, stageKey)}
      className={`h-full rounded-xl border overflow-hidden animate-fade-in-up transition-all duration-200 ${
        isOver
          ? "border-indigo-500/40 bg-indigo-500/[0.04] ring-1 ring-indigo-500/20"
          : "border-white/[0.06] bg-white/[0.015]"
      }`}
      style={style}
    >
      <HStack className="items-center gap-2 px-4 pt-3.5 pb-2.5 border-b border-white/[0.04]">
        <div
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: stage.color }}
        />
        <TextHeadline className="text-xs font-semibold text-white/60 uppercase tracking-wider flex-1">
          {stage.label}
        </TextHeadline>
        <TextLabel1 className="font-mono">{apps.length}</TextLabel1>
      </HStack>

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
              <p className={`text-xs ${isOver ? "text-indigo-400/50" : "text-white/15"}`}>
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
