import type { JobApplication, BoardView } from "@/lib/api";
import type { Stage } from "@/lib/constants";
import type { StageDragState } from "@/hooks/useStageDragAndDrop";
import StageSection from "./StageSection";

export default function GridView({
  visibleStages,
  board,
  onCardClick,
  dragState,
  handleDragStart,
  handleDragEnd,
  handleColumnDragEnter,
  handleColumnDragLeave,
  handleColumnDragOver,
  handleColumnDrop,
}: {
  visibleStages: Stage[];
  board: BoardView;
  onCardClick: (id: string) => void;
  dragState: StageDragState;
  handleDragStart: (e: React.DragEvent, appId: string, fromStage: string) => void;
  handleDragEnd: () => void;
  handleColumnDragEnter: (stageKey: string) => void;
  handleColumnDragLeave: (stageKey: string) => void;
  handleColumnDragOver: (e: React.DragEvent) => void;
  handleColumnDrop: (e: React.DragEvent, toStage: string) => void;
}) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-3 items-start">
      {visibleStages.map((stage, i) => (
        <StageSection
          key={stage.key}
          stageKey={stage.key}
          apps={(board[stage.key as keyof BoardView] || []) as JobApplication[]}
          isOver={dragState.overStageKey === stage.key}
          onCardClick={onCardClick}
          draggingAppId={dragState.dragging?.appId ?? null}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragEnter={handleColumnDragEnter}
          onDragLeave={handleColumnDragLeave}
          onDragOver={handleColumnDragOver}
          onDrop={handleColumnDrop}
          style={{ animationDelay: `${i * 80}ms` }}
        />
      ))}
    </div>
  );
}
