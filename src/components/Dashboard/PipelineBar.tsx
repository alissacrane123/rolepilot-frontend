import type { BoardView, JobApplication } from "@/lib/api";
import { STAGES } from "@/lib/api";
import { HStack } from "@/components/ui/stacks";

export default function PipelineBar({
  board,
  activeStage,
  onStageClick,
}: {
  board: BoardView;
  activeStage: string | null;
  onStageClick: (key: string | null) => void;
}) {
  return (
    <HStack className="gap-1.5 overflow-x-auto pb-1">
      {STAGES.map((stage, i) => {
        const apps = (board[stage.key as keyof BoardView] ||
          []) as JobApplication[];
        const isActive = activeStage === stage.key;

        return (
          <button
            key={stage.key}
            onClick={() => onStageClick(isActive ? null : stage.key)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border whitespace-nowrap transition-all duration-200 animate-fade-in-up ${
              isActive
                ? "bg-indigo-500/[0.12] border-indigo-500/30"
                : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
            }`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div
              className="w-[7px] h-[7px] rounded-full shrink-0"
              style={{ background: stage.color }}
            />
            <span className="text-xs font-medium text-white/55">
              {stage.label}
            </span>
            <span className="text-[11px] font-semibold text-white/80 font-mono bg-white/[0.06] px-1.5 py-0.5 rounded">
              {apps.length}
            </span>
          </button>
        );
      })}
    </HStack>
  );
}
