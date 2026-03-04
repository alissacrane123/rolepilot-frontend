import type { JobApplication, BoardView } from "@/lib/api";
import { STAGES } from "@/lib/api";
import StageSection from "./StageSection";

export default function GridView({
  visibleStages,
  board,
  onCardClick,
  draggingAppId,
  handleDragStart,
  handleDragEnd,
  handleColumnDragEnter,
  handleColumnDragLeave,
  handleColumnDragOver,
  handleColumnDrop,
  style,
  dragState
}: {
  visibleStages: Stage[];
  board: BoardView;
  handleCardClick: (id: string) => void;
  isOver: boolean;
  draggingAppId: string | null;
  style?: React.CSSProperties;
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
