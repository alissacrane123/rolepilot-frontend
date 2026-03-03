import type { JobApplication } from "@/lib/api";
import { STAGE_MAP } from "@/lib/api";
import ApplicationCard from "./ApplicationCard";

export default function StageSection({
  stageKey,
  apps,
  onCardClick,
  style,
}: {
  stageKey: string;
  apps: JobApplication[];
  onCardClick: (id: string) => void;
  style?: React.CSSProperties;
}) {
  const stage = STAGE_MAP[stageKey];
  if (!stage) return null;

  return (
    <div
      className="rounded-xl border border-white/[0.06] bg-white/[0.015] overflow-hidden animate-fade-in-up"
      style={style}
    >
      <div className="flex items-center gap-2 px-4 pt-3.5 pb-2.5 border-b border-white/[0.04]">
        <div
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: stage.color }}
        />
        <span className="text-xs font-semibold text-white/60 uppercase tracking-wider flex-1">
          {stage.label}
        </span>
        <span className="text-[11px] font-medium text-white/30 font-mono">
          {apps.length}
        </span>
      </div>
      <div className="p-2 flex flex-col gap-1.5 min-h-[80px]">
        {apps.length === 0 && (
          <div className="flex items-center justify-center py-6">
            <p className="text-xs text-white/15">No applications</p>
          </div>
        )}
        {apps.map((app, i) => (
          <div
            key={app.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <ApplicationCard app={app} onClick={() => onCardClick(app.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
