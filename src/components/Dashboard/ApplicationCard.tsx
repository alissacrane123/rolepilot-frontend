import type { JobApplication } from "@/lib/api";
import { STAGE_MAP } from "@/lib/api";
import { formatDate } from "@/lib/dateUtils";

export default function ApplicationCard({
  app,
  stageKey,
  onClick,
  onDragStart,
  onDragEnd,
  isDragging,
  index,
}: {
  app: JobApplication;
  stageKey: string;
  onClick: () => void;
  onDragStart: (e: React.DragEvent, appId: string, stageKey: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  index: number;
}) {
  const initial = (app.company_name || "?")[0].toUpperCase();
  const stageColor = STAGE_MAP[stageKey]?.color ?? "#6366f1";

  return (
    <div
      draggable
      style={{ animationDelay: `${index * 60}ms` }}
      onDragStart={(e) => onDragStart(e, app.id, stageKey)}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={`animate-fade-in-up rounded-[10px] p-3 bg-[#0f0f1a] border border-[#1a1a2e] cursor-pointer transition-all duration-150 select-none
        ${isDragging ? "opacity-40 scale-[0.97]" : "hover:bg-[#131320] hover:border-[#2d2d42] hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)]"}`}
    >
      {/* Company + date */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-[22px] h-[22px] rounded-md flex items-center justify-center shrink-0 bg-indigo-600">
            <span className="text-[10px] font-extrabold text-white">
              {initial}
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-300">
            {app.company_name || "Unknown"}
          </span>
        </div>
        <span className="text-[10px] text-slate-700">
          {app.applied_at ? formatDate(app.applied_at) : ""}
        </span>
      </div>

      {/* Role */}
      <p className="text-xs font-semibold text-slate-200 leading-snug mb-2 tracking-tight">
        {app.role_title || "Untitled Role"}
        {app.processing_status === "processing" && (
          <span className="ml-1.5 text-[11px] text-indigo-400 animate-pulse">
            analyzing...
          </span>
        )}
      </p>

      {/* Tags */}
      <div className={`flex flex-wrap gap-1 ${app.salary_range ? "mb-2" : ""}`}>
        {app.remote_policy && app.remote_policy !== "not_specified" && (
          <span className="text-[9px] font-bold tracking-wide bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded uppercase">
            {app.remote_policy}
          </span>
        )}
        {app.experience_level && (
          <span
            className="text-[9px] font-bold tracking-wide px-1.5 py-0.5 rounded uppercase"
            style={{
              background: `${stageColor}18`,
              color: stageColor,
            }}
          >
            {app.experience_level}
          </span>
        )}
      </div>

      {/* Salary */}
      {app.salary_range && (
        <p className="text-[10px] font-semibold text-emerald-400 tracking-tight">
          {app.salary_range}
        </p>
      )}
    </div>
  );
}
