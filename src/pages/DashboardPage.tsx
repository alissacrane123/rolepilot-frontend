import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { type BoardView, type JobApplication, STAGES } from "@/lib/api";
import { useBoardQuery, queryKeys } from "@/hooks/useApi";
import Content from "@/components/Content";
import NewApplicationDialog from "@/components/Dashboard/NewApplicationDialog";
import PipelineBar from "@/components/Dashboard/PipelineBar";
import StageSection from "@/components/Dashboard/StageSection";
import ListView from "@/components/Dashboard/ListView";
import StageTransitionModal from "@/components/Dashboard/StageTransitionModal";
import InterviewsSection from "@/components/Dashboard/InterviewsSection";
import useStageDragAndDrop from "@/hooks/useStageDragAndDrop";
import type { ViewMode } from "@/lib/constants";
import ViewToggle from "@/components/Dashboard/ViewToggle";
import { ALWAYS_VISIBLE_STAGES } from "@/lib/constants";
import EmptyState from "@/components/EmpyState";
import { TextTitle1 } from "@/components/ui/text/TextTitle1";
import { TextBody } from "@/components/ui/text/TextBody";
import { HStack, VStack } from "@/components/ui/stacks";
import GridView from "@/components/Dashboard/GridView";
import ApplicationsSection from "@/components/Dashboard/ApplicationsSection";

export default function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: board, isLoading: loading } = useBoardQuery();
  const [view, setView] = useState<ViewMode>("board");
  const [activeStage, setActiveStage] = useState<string | null>(null);

  const invalidateBoard = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.board });
  };

  const { dragState, pendingTransition, ...dragAndDropProps } =
    useStageDragAndDrop(board ?? null, invalidateBoard);

  const handleCardClick = (id: string) => {
    navigate(`/applications/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-white/40">Loading...</div>
      </div>
    );
  }

  const totalApps = board
    ? Object.values(board).reduce(
        (sum, apps) => sum + (apps as JobApplication[]).length,
        0,
      )
    : 0;

  const visibleStages = STAGES.filter((stage) => {
    if (!board) return false;
    if (activeStage) return stage.key === activeStage;
    const apps = board[stage.key as keyof BoardView] || [];
    return ALWAYS_VISIBLE_STAGES.includes(stage.key) || apps.length > 0;
  });

  const hanldeViewChange = (view: "start" | "end") => {
    setView(view === "start" ? "board" : "list");
  };

  return (
    <Content>
      <ApplicationsSection
        totalApps={totalApps}
        view={view}
        hanldeViewChange={hanldeViewChange}
        invalidateBoard={invalidateBoard}
        board={board}
        activeStage={activeStage}
        setActiveStage={setActiveStage}
        handleCardClick={handleCardClick}
        dragState={dragState}
        dragAndDropProps={dragAndDropProps}
        visibleStages={visibleStages}
      />

      <div className="mt-20 pb-10 border-t border-white/[0.06]" />
      
      <InterviewsSection />

      {pendingTransition && (
        <StageTransitionModal
          transition={pendingTransition}
          onConfirm={dragAndDropProps.handleTransitionConfirm}
          onCancel={dragAndDropProps.handleTransitionCancel}
        />
      )}
    </Content>
  );
}
