import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  type BoardView,
  type JobApplication,
  STAGES,
} from "@/lib/api";
import { useBoardQuery, queryKeys } from "@/hooks/useApi";
import Content from "@/components/Content";
import NewApplicationDialog from "@/components/Dashboard/NewApplicationDialog";
import PipelineBar from "@/components/Dashboard/PipelineBar";
import StageSection from "@/components/Dashboard/StageSection";
import ListView from "@/components/Dashboard/ListView";
import StageTransitionModal from "@/components/Dashboard/StageTransitionModal";
import InterviewsSection from "@/components/Interviews/InterviewsSection";
import useStageDragAndDrop from "@/hooks/useStageDragAndDrop";
import type { ViewMode } from "@/lib/constants";
import ViewToggle from "@/components/Dashboard/ViewToggle";
import { ALWAYS_VISIBLE_STAGES } from "@/lib/constants";
import EmptyState from "@/components/EmpyState";

export default function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: board, isLoading: loading } = useBoardQuery();
  const [view, setView] = useState<ViewMode>("board");
  const [activeStage, setActiveStage] = useState<string | null>(null);

  const invalidateBoard = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.board });
  };

  const {
    dragState,
    pendingTransition,
    handleDragStart,
    handleDragEnd,
    handleColumnDragEnter,
    handleColumnDragLeave,
    handleColumnDragOver,
    handleColumnDrop,
    handleTransitionConfirm,
    handleTransitionCancel,
  } = useStageDragAndDrop(board ?? null, invalidateBoard);

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

  return (
    <Content>
      {/* Page header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[26px] font-bold text-white tracking-tight leading-tight">
            Applications
          </h1>
          <p className="text-[13px] text-white/35 mt-1">
            {totalApps} active · tracking across {STAGES.length} stages
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <ViewToggle view={view} onChange={setView} />
          <NewApplicationDialog onCreated={invalidateBoard} />
        </div>
      </div>

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
              <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-3 items-start">
                {visibleStages.map((stage, i) => (
                  <StageSection
                    key={stage.key}
                    stageKey={stage.key}
                    apps={
                      (board[stage.key as keyof BoardView] ||
                        []) as JobApplication[]
                    }
                    onCardClick={handleCardClick}
                    isOver={dragState.overStageKey === stage.key}
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

      {/* Interviews section */}
      <div className="mt-12 pt-10 border-t border-white/[0.06]">
        <InterviewsSection />
      </div>

      {pendingTransition && (
        <StageTransitionModal
          transition={pendingTransition}
          onConfirm={handleTransitionConfirm}
          onCancel={handleTransitionCancel}
        />
      )}
    </Content>
  );
}
