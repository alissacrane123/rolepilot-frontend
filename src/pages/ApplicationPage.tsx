import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getApplication,
  type JobApplication,
  STAGE_MAP,
} from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import PageContainer from "@/components/PageContainer";
import Content from "@/components/Content";
import ApplicationHeader from "@/components/Application/ApplicationHeader";
import SummaryCards from "@/components/Application/SummaryCards";
import SkillsSection from "@/components/Application/SkillsSection";
import AIAnalysis from "@/components/Application/AIAnalysis";
import StageHistory from "@/components/Application/StageHistory";

export default function ApplicationPage() {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchApp = async () => {
    if (!id) return;
    try {
      const res = await getApplication(id);
      if (res.data) setApp(res.data);
    } catch (err) {
      console.error("Failed to fetch application:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApp();
  }, [id]);

  useEffect(() => {
    if (app?.processing_status === "processing") {
      const interval = setInterval(fetchApp, 3000);
      return () => clearInterval(interval);
    }
  }, [app?.processing_status]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">Application not found</div>
      </div>
    );
  }

  const stage = STAGE_MAP[app.current_stage];

  return (
    <PageContainer>
      <ApplicationHeader app={app} onMoved={fetchApp} />

      <Content>
        {/* Title Section */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge
              variant="outline"
              className="border-indigo-500/50 text-indigo-400"
            >
              {stage?.emoji} {stage?.label}
            </Badge>
            {app.processing_status === "processing" && (
              <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 animate-pulse">
                AI Analyzing...
              </Badge>
            )}
            {app.match_score != null && app.match_score > 0 && (
              <Badge
                variant="outline"
                className={`${
                  app.match_score >= 75
                    ? "border-emerald-500/50 text-emerald-400"
                    : app.match_score >= 50
                      ? "border-amber-500/50 text-amber-400"
                      : "border-zinc-600 text-zinc-400"
                }`}
              >
                {app.match_score}% match
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">
            {app.role_title || "Untitled Role"}
          </h1>
          <p className="text-lg text-zinc-400">
            {app.company_name || "Unknown Company"}
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm text-zinc-500">
            {app.salary_range && <span>{app.salary_range}</span>}
            {app.location && <span>{app.location}</span>}
            {app.remote_policy && app.remote_policy !== "not_specified" && (
              <Badge
                variant="secondary"
                className="bg-zinc-800 text-zinc-300 text-xs"
              >
                {app.remote_policy}
              </Badge>
            )}
            {app.experience_level && (
              <Badge
                variant="secondary"
                className="bg-zinc-800 text-zinc-300 text-xs"
              >
                {app.experience_level}
              </Badge>
            )}
          </div>
        </div>

        <SummaryCards app={app} />
        <SkillsSection app={app} />
        <AIAnalysis app={app} />
        <StageHistory app={app} />

        {app.job_url && (
          <div className="text-sm">
            <a
              href={app.job_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              View Original Posting →
            </a>
          </div>
        )}
      </Content>
    </PageContainer>
  );
}
