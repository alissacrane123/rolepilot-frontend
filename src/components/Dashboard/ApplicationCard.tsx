import type { JobApplication } from "@/lib/api";

export default function ApplicationCard({
  app,
  stageKey,
  onClick,
  onDragStart,
  onDragEnd,
  isDragging,
}: {
  app: JobApplication;
  stageKey: string;
  onClick: () => void;
  onDragStart: (e: React.DragEvent, appId: string, stageKey: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}) {
  const initial = (app.company_name || "?")[0].toUpperCase();

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, app.id, stageKey)}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={`rounded-[10px] p-3.5 bg-white/[0.03] border border-white/[0.06] cursor-grab transition-all duration-200 select-none active:cursor-grabbing
        ${isDragging ? "opacity-40 scale-[0.97]" : "hover:bg-white/[0.055] hover:border-indigo-500/25 hover:-translate-y-px"}`}
    >
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
          <span className="text-[13px] font-bold text-indigo-400">
            {initial}
          </span>
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-xs font-semibold text-white/80 truncate tracking-tight">
            {app.company_name || "Unknown Company"}
          </span>
          <span className="text-[11px] text-white/25">
            {app.applied_at
              ? new Date(app.applied_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : ""}
          </span>
        </div>
      </div>

      <h3 className="text-[13px] font-medium text-white/90 leading-snug mb-2 tracking-tight">
        {app.role_title || "Untitled Role"}
        {app.processing_status === "processing" && (
          <span className="ml-1.5 text-[11px] text-indigo-400 animate-pulse">
            analyzing...
          </span>
        )}
      </h3>

      <div className="flex flex-wrap gap-1 mb-2.5">
        {app.remote_policy && app.remote_policy !== "not_specified" && (
          <span className="text-[10px] font-medium text-white/40 bg-white/[0.04] px-2 py-0.5 rounded uppercase tracking-wide">
            {app.remote_policy}
          </span>
        )}
        {app.experience_level && (
          <span className="text-[10px] font-medium text-white/40 bg-white/[0.04] px-2 py-0.5 rounded uppercase tracking-wide">
            {app.experience_level}
          </span>
        )}
      </div>

      {app.salary_range && (
        <div className="text-[11px] font-medium text-white/35 font-mono">
          {app.salary_range}
        </div>
      )}
    </div>
  );
}
