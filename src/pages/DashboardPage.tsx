import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getBoard,
  type BoardView,
  type JobApplication,
  STAGES,
} from "@/lib/api";
import Content from "@/components/Content";
import StageSection from "@/components/Dashboard/StageSection";
import NewApplicationDialog from "@/components/Dashboard/NewApplicationDialog";

const ALWAYS_VISIBLE_STAGES = [
  "applied",
  "recruiter_response",
  "phone_screen",
  "technical_interview",
  "onsite_final",
  "offer",
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [board, setBoard] = useState<BoardView | null>(null);
  const [loading, setLoading] = useState(true);

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
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  const totalApps = board
    ? Object.values(board).reduce(
        (sum, apps) => sum + (apps as JobApplication[]).length,
        0,
      )
    : 0;

  const activeStages = STAGES.filter((stage) => {
    if (!board) return false;
    const apps = board[stage.key as keyof BoardView] || [];
    return ALWAYS_VISIBLE_STAGES.includes(stage.key) || apps.length > 0;
  });

  return (
    <Content>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Applications</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {totalApps} {totalApps === 1 ? "application" : "applications"}{" "}
            tracked
          </p>
        </div>
        <NewApplicationDialog onCreated={fetchBoard} />
      </div>

      {totalApps === 0 && (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">📋</div>
          <h2 className="text-lg font-semibold text-zinc-300 mb-2">
            No applications yet
          </h2>
          <p className="text-sm text-zinc-500 mb-6 max-w-md mx-auto">
            Start tracking your job search by adding your first application.
            Paste the job description for AI-powered analysis.
          </p>
          <NewApplicationDialog onCreated={fetchBoard} />
        </div>
      )}

      {totalApps > 0 && (
        <div className="space-y-2">
          {board &&
            activeStages.map((stage) => (
              <StageSection
                key={stage.key}
                stageKey={stage.key}
                apps={board[stage.key as keyof BoardView] || []}
                onCardClick={handleCardClick}
              />
            ))}
        </div>
      )}
    </Content>
  );
}
