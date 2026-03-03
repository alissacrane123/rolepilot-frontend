import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useApplicationQuery, queryKeys } from "@/hooks/useApi";
import PageContainer from "@/components/PageContainer";
import Content from "@/components/Content";
import ApplicationHeader from "@/components/Application/ApplicationHeader";
import ApplicationHero from "@/components/Application/ApplicationHero";
import SummaryCards from "@/components/Application/SummaryCards";
import SkillsSection from "@/components/Application/SkillsSection";
import AIAnalysis from "@/components/Application/AIAnalysis";
import StageHistory from "@/components/Application/StageHistory";

export default function ApplicationPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: app, isLoading: loading } = useApplicationQuery(id);

  useEffect(() => {
    if (app?.processing_status === "processing" && id) {
      const interval = setInterval(() => {
        queryClient.invalidateQueries({ queryKey: queryKeys.application(id) });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [app?.processing_status, id, queryClient]);

  const handleMoved = () => {
    if (id) {
      queryClient.invalidateQueries({ queryKey: queryKeys.application(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.board });
    }
  };

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

  return (
    <PageContainer>
      <Content>
        <ApplicationHeader />
        <ApplicationHero app={app} onMoved={handleMoved} />
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
