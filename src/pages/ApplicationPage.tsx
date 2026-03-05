import { useEffect, useState, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  useApplicationQuery,
  useMeetingsQuery,
  queryKeys,
} from "@/hooks/useApi";
import PageContainer from "@/components/common/PageContainer";
import Content from "@/components/common/Content";
import BackButton from "@/components/common/BackButton";
import LoadingScreen from "@/components/common/LoadingScreen";
import ApplicationHero from "@/components/Application/ApplicationHero";
import OverviewTab from "@/components/Application/OverviewTab";
import MeetingsTab from "@/components/Application/MeetingsTab";
import AIAnalysis from "@/components/Application/AIAnalysis";
import StageHistory from "@/components/Application/StageHistory";
import CoverLettersTab from "@/components/Application/CoverLettersTab";
import NotesTab from "@/components/Application/NotesTab";

type Tab = "overview" | "meetings" | "analysis" | "cover-letters" | "notes";

const TAB_DEFS: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "meetings", label: "Meetings" },
  { key: "analysis", label: "AI Analysis" },
  { key: "cover-letters", label: "Cover Letters" },
  { key: "notes", label: "Notes" },
];

export default function ApplicationPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: app, isLoading: loading } = useApplicationQuery(id);
  const { data: meetings = [] } = useMeetingsQuery(id);
  const location = useLocation();
  const navigate = useNavigate();

  const hashRaw = location.hash.replace("#", "");
  const [hashTab, hashSubId] = hashRaw.split(":");
  const tabFromHash = TAB_DEFS.find(t => t.key === hashTab)?.key;
  const [activeTab, setActiveTabState] = useState<Tab>(tabFromHash ?? "overview");

  const setActiveTab = useCallback((tab: Tab) => {
    setActiveTabState(tab);
    navigate({ hash: tab === "overview" ? "" : tab }, { replace: true });
  }, [navigate]);

  const setHash = useCallback((tab: string, subId?: string) => {
    const hash = subId ? `${tab}:${subId}` : tab === "overview" ? "" : tab;
    navigate({ hash }, { replace: true });
  }, [navigate]);

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

  if (loading) return <LoadingScreen />;
  if (!app) return <LoadingScreen message="Application not found" />;

  function tabLabel(tab: Tab) {
    if (tab === "meetings" && meetings.length > 0) {
      return `Meetings (${meetings.length})`;
    }
    return TAB_DEFS.find((t) => t.key === tab)!.label;
  }

  return (
    <PageContainer>
      <Content>
        <BackButton />
        <ApplicationHero app={app} onMoved={handleMoved} />

        {/* Tab bar */}
        <div className="flex gap-0.5 mt-4 border-b border-white/[0.15]">
          {TAB_DEFS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`cursor-pointer px-4 py-3 text-[13px] font-medium border-b-2 transition-all duration-150 ${
                activeTab === tab.key
                  ? "text-white border-indigo-500"
                  : "text-white/35 border-transparent hover:text-white/50"
              }`}
            >
              {tabLabel(tab.key)}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="mt-5">
          {activeTab === "overview" && (
            <div className="space-y-5 animate-fade-in-up">
              <OverviewTab app={app} />
              <StageHistory app={app} />
            </div>
          )}
          {activeTab === "meetings" && (
            <MeetingsTab
              applicationId={app.id}
              companyName={app.company_name}
              roleTitle={app.role_title}
            />
          )}
          {activeTab === "analysis" && <AIAnalysis app={app} />}
          {activeTab === "cover-letters" && (
            <CoverLettersTab app={app} companyName={app.company_name} />
          )}
          {activeTab === "notes" && (
            <NotesTab
              applicationId={app.id}
              initialNoteId={hashTab === "notes" ? hashSubId : undefined}
              onActiveNoteChange={(noteId) => setHash("notes", noteId)}
            />
          )}
        </div>
      </Content>
    </PageContainer>
  );
}
