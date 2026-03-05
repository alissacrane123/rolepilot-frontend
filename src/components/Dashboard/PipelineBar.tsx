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
    <HStack className="gap-1.5 overflow-x-auto pb-3.5">
      {STAGES.map((stage, i) => {
        const apps = (board[stage.key as keyof BoardView] ||
          []) as JobApplication[];
        const isActive = activeStage === stage.key;

        return (
          <button
            key={stage.key}
            onClick={() => onStageClick(isActive ? null : stage.key)}
            className="flex items-center gap-[5px] px-2.5 py-1 rounded-full border whitespace-nowrap transition-all duration-150 animate-fade-in-up text-[11px] font-semibold tracking-wide cursor-pointer"
            style={{
              animationDelay: `${i * 60}ms`,
              background: isActive ? `${stage.color}22` : "rgba(255,255,255,0.03)",
              borderColor: isActive ? `${stage.color}55` : "#1e1e2e",
              color: isActive ? stage.color : "#64748b",
            }}
          >
            <span
              className="w-[5px] h-[5px] rounded-full shrink-0 inline-block"
              style={{ background: stage.color }}
            />
            {stage.label}
            <span style={{ opacity: 0.7 }}>{apps.length}</span>
          </button>
        );
      })}
    </HStack>
  );
}
