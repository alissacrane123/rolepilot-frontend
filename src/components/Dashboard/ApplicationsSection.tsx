import { HStack, VStack } from "@/components/ui/stacks";
import { TextTitle1 } from "@/components/ui/text/TextTitle1";
import { TextBody } from "@/components/ui/text/TextBody";
import ViewToggle from "@/components/Dashboard/ViewToggle";
import NewApplicationDialog from "@/components/Dashboard/NewApplicationDialog";
import EmptyState from "@/components/EmpyState";
import { type BoardView } from "@/lib/api";
import GridView from "@/components/Dashboard/GridView";
import ListView from "@/components/Dashboard/ListView";
import PipelineBar from "@/components/Dashboard/PipelineBar";
import type { StageDragState } from "@/hooks/useStageDragAndDrop";
import type { Stage, ViewState } from "@/lib/constants";

export default function ApplicationsSection({
  totalApps,
  view,
  hanldeViewChange,
  invalidateBoard,
  board,
  activeStage,
  setActiveStage,
  handleCardClick,
  dragState,
  dragAndDropProps,
  visibleStages,
}: {
  totalApps: number;
  view: "board" | "list";
  hanldeViewChange: (view: ViewState) => void;
  invalidateBoard: () => void;
  board: BoardView;
  activeStage: string | null;
  setActiveStage: (stage: string | null) => void;
  handleCardClick: (id: string) => void;
  dragState: StageDragState;
  dragAndDropProps: any;
  visibleStages: Stage[];
}) {
  return (
    <div className="flex flex-col">
      <HStack className="items-start justify-between mb-7">
        <VStack>
          <TextTitle1>Applications</TextTitle1>
          <TextBody className="mt-1">{totalApps} active</TextBody>
        </VStack>
        <HStack className="items-center gap-2.5">
          <ViewToggle
            view={view === "board" ? "start" : "end"}
            onChange={hanldeViewChange}
          />
          <NewApplicationDialog onCreated={invalidateBoard} />
        </HStack>
      </HStack>

      {/* Empty state */}
      {totalApps === 0 && (
        <EmptyState
          title="No applications yet"
          description="Start tracking your job search by adding your first application. Paste the job description for AI-powered analysis."
          cta={<NewApplicationDialog onCreated={invalidateBoard} />}
        />
      )}

      {/* Pipeline bar + content */}
      {totalApps > 0 && board && (
        <>
          <PipelineBar
            board={board}
            activeStage={activeStage}
            onStageClick={setActiveStage}
          />

          <div className="mt-7">
            {view === "board" && (
              <GridView
                visibleStages={visibleStages}
                board={board}
                onCardClick={handleCardClick}
                dragState={dragState}
                {...dragAndDropProps}
              />
            )}

            {view === "list" && (
              <ListView
                board={board}
                activeStage={activeStage}
                onCardClick={handleCardClick}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
