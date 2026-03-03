import type { JobApplication, BoardView } from "@/lib/api";
import { STAGES, STAGE_MAP } from "@/lib/api";

export default function ListView({
  board,
  activeStage,
  onCardClick,
}: {
  board: BoardView;
  activeStage: string | null;
  onCardClick: (id: string) => void;
}) {
  const allApps: (JobApplication & { _stageKey: string })[] = [];
  for (const stage of STAGES) {
    if (activeStage && activeStage !== stage.key) continue;
    const apps = (board[stage.key as keyof BoardView] ||
      []) as JobApplication[];
    for (const app of apps) {
      allApps.push({ ...app, _stageKey: stage.key });
    }
  }

  return (
    <div className="rounded-xl border border-white/[0.06] overflow-hidden">
      {/* Header */}
      <div className="flex px-5 py-2.5 bg-white/[0.02] border-b border-white/[0.06]">
        <span className="flex-[2] text-[11px] font-semibold text-white/30 uppercase tracking-wider">
          Role
        </span>
        <span className="flex-1 text-[11px] font-semibold text-white/30 uppercase tracking-wider">
          Company
        </span>
        <span className="flex-1 text-[11px] font-semibold text-white/30 uppercase tracking-wider">
          Stage
        </span>
        <span className="flex-1 text-[11px] font-semibold text-white/30 uppercase tracking-wider">
          Salary
        </span>
        <span className="flex-1 text-[11px] font-semibold text-white/30 uppercase tracking-wider">
          Applied
        </span>
      </div>

      {/* Rows */}
      {allApps.map((app, i) => {
        const stage = STAGE_MAP[app._stageKey];
        return (
          <div
            key={app.id}
            onClick={() => onCardClick(app.id)}
            className="flex items-center px-5 py-3.5 border-b border-white/[0.04] cursor-pointer transition-all duration-150 hover:bg-white/[0.025] animate-slide-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {/* Role */}
            <div className="flex-[2] flex items-center gap-3 min-w-0">
              <div className="w-7 h-7 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                <span className="text-[11px] font-semibold text-indigo-400">
                  {(app.company_name || "?")[0].toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-white/90 truncate tracking-tight">
                  {app.role_title || "Untitled Role"}
                </div>
                <div className="flex gap-1 mt-0.5">
                  {app.remote_policy &&
                    app.remote_policy !== "not_specified" && (
                      <span className="text-[10px] text-white/30 uppercase tracking-wide font-medium">
                        {app.remote_policy}
                      </span>
                    )}
                  {app.experience_level && (
                    <span className="text-[10px] text-white/30 uppercase tracking-wide font-medium">
                      {app.experience_level}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Company */}
            <span className="flex-1 text-[13px] text-white/70 font-medium truncate">
              {app.company_name || "Unknown"}
            </span>

            {/* Stage */}
            <span className="flex-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/55">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: stage?.color }}
                />
                {stage?.label}
              </span>
            </span>

            {/* Salary */}
            <span className="flex-1 text-xs text-white/50 font-mono">
              {app.salary_range || "—"}
            </span>

            {/* Date */}
            <span className="flex-1 text-[13px] text-white/35">
              {app.applied_at
                ? new Date(app.applied_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—"}
            </span>
          </div>
        );
      })}

      {allApps.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-white/20">No applications to show</p>
        </div>
      )}
    </div>
  );
}
