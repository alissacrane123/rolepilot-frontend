import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { type BoardView, type JobApplication, STAGES } from "@/lib/api";
import { useBoardQuery, queryKeys } from "@/hooks/useApi";
import { StageTransitionModal } from "@/components/Dashboard/StageTransitionModal";
import InterviewsSection from "@/components/Dashboard/InterviewsSection";
import useStageDragAndDrop from "@/hooks/useStageDragAndDrop";
import type { ViewMode } from "@/lib/constants";
import { ALWAYS_VISIBLE_STAGES } from "@/lib/constants";
import ApplicationsSection from "@/components/Dashboard/ApplicationsSection";
import EmptyState from "@/components/common/EmptyState";
import LoadingScreen from "@/components/common/LoadingScreen";
import TasksSidebar from "@/components/Dashboard/TasksSidebar";

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
    return <LoadingScreen />;
  }

  if (!board) {
    return (
      <EmptyState
        title="No applications yet"
        description="Start tracking your job search by adding your first application. Paste the job description for AI-powered analysis."
      />
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
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      <TasksSidebar />

      {/* Main scrollable area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6 flex flex-col gap-16 pb-72">
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

            <div className="pb-10 border-t border-white/[0.15]" />

            <InterviewsSection />
          </div>
        </div>
      </div>

      {pendingTransition && (
        <StageTransitionModal
          transition={pendingTransition}
          onConfirm={dragAndDropProps.handleTransitionConfirm}
          onCancel={dragAndDropProps.handleTransitionCancel}
        />
      )}
    </div>
  );
}
