import { useState } from "react";
import type { JobApplication } from "@/lib/api";
import { STAGE_MAP } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import ApplicationCard from "./ApplicationCard";

export default function StageSection({
  stageKey,
  apps,
  onCardClick,
}: {
  stageKey: string;
  apps: JobApplication[];
  onCardClick: (id: string) => void;
}) {
  const stage = STAGE_MAP[stageKey];
  const [collapsed, setCollapsed] = useState(false);

  if (!stage) return null;

  return (
    <div>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-3 mb-3 group cursor-pointer w-full"
      >
        <span className="text-lg">{stage.emoji}</span>
        <h2 className="text-sm font-semibold text-zinc-300 group-hover:text-zinc-100 transition-colors">
          {stage.label}
        </h2>
        <div className="h-px flex-1 bg-zinc-800/80" />
        <Badge
          variant="secondary"
          className="bg-zinc-800 text-zinc-500 text-xs font-mono"
        >
          {apps.length}
        </Badge>
        <span
          className={`text-zinc-600 text-xs transition-transform ${
            collapsed ? "-rotate-90" : ""
          }`}
        >
          ▼
        </span>
      </button>
      {!collapsed && (
        <div className="space-y-2 ml-8 mb-6">
          {apps.map((app) => (
            <ApplicationCard
              key={app.id}
              app={app}
              onClick={() => onCardClick(app.id)}
            />
          ))}
          {apps.length === 0 && (
            <div className="text-xs text-zinc-700 py-2">No applications</div>
          )}
        </div>
      )}
    </div>
  );
}
