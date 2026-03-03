import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getBoard,
  type BoardView,
  type JobApplication,
  STAGES,
} from "@/lib/api";
import Content from "@/components/Content";
import NewApplicationDialog from "@/components/Dashboard/NewApplicationDialog";
import PipelineBar from "@/components/Dashboard/PipelineBar";
import StageSection from "@/components/Dashboard/StageSection";
import ListView from "@/components/Dashboard/ListView";

type ViewMode = "board" | "list";

const ALWAYS_VISIBLE_STAGES = [
  "applied",
  "recruiter_response",
  "phone_screen",
  "technical_interview",
  "onsite_final",
  "offer",
];

function ViewToggle({
  view,
  onChange,
}: {
  view: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  return (
    <div className="flex bg-white/[0.04] rounded-lg p-0.5 border border-white/[0.06]">
      <button
        onClick={() => onChange("board")}
        className={`flex items-center px-2.5 py-1.5 rounded-md transition-all duration-150 ${
          view === "board" ? "text-white bg-white/[0.08]" : "text-white/30"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect
            x="1"
            y="1"
            width="5"
            height="14"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <rect
            x="10"
            y="1"
            width="5"
            height="14"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      </button>
      <button
        onClick={() => onChange("list")}
        className={`flex items-center px-2.5 py-1.5 rounded-md transition-all duration-150 ${
          view === "list" ? "text-white bg-white/[0.08]" : "text-white/30"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <line
            x1="1"
            y1="3"
            x2="15"
            y2="3"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <line
            x1="1"
            y1="8"
            x2="15"
            y2="8"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <line
            x1="1"
            y1="13"
            x2="15"
            y2="13"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [board, setBoard] = useState<BoardView | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("board");
  const [activeStage, setActiveStage] = useState<string | null>(null);

  const fetchBoard = async () => {
    try {
      const res = await getBoard();
      if (res.data) setBoard(res.data);
    } catch (err) {
      console.error("Failed to fetch board:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoard();
    const interval = setInterval(fetchBoard, 5000);
    return () => clearInterval(interval);
  }, []);

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
          <NewApplicationDialog onCreated={fetchBoard} />
        </div>
      </div>

      {/* Empty state */}
      {totalApps === 0 && (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">📋</div>
          <h2 className="text-lg font-semibold text-white/70 mb-2">
            No applications yet
          </h2>
          <p className="text-sm text-white/35 mb-6 max-w-md mx-auto">
            Start tracking your job search by adding your first application.
            Paste the job description for AI-powered analysis.
          </p>
          <NewApplicationDialog onCreated={fetchBoard} />
        </div>
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
    </Content>
  );
}
