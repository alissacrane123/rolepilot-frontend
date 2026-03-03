import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUpcomingMeetings,
  getApplications,
  type Meeting,
  type JobApplication,
} from "@/lib/api";
import InterviewListView from "./InterviewListView";
import InterviewCalendarView from "./InterviewCalendarView";

type InterviewView = "calendar" | "list";

interface MeetingWithApp extends Meeting {
  _companyName?: string;
  _roleTitle?: string;
}

function enrichMeetings(
  meetings: Meeting[],
  apps: JobApplication[],
): MeetingWithApp[] {
  const appMap = new Map(apps.map((a) => [a.id, a]));
  return meetings.map((m) => {
    const app = appMap.get(m.application_id);
    return {
      ...m,
      _companyName: app?.company_name,
      _roleTitle: app?.role_title,
    };
  });
}

export default function InterviewsSection() {
  const navigate = useNavigate();
  const [view, setView] = useState<InterviewView>("calendar");
  const [meetings, setMeetings] = useState<MeetingWithApp[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [meetingsRes, appsRes] = await Promise.all([
        getUpcomingMeetings(),
        getApplications(),
      ]);
      const rawMeetings = meetingsRes.data || [];
      const rawApps = appsRes.data || [];
      setMeetings(enrichMeetings(rawMeetings, rawApps));
    } catch (err) {
      console.error("Failed to fetch interviews:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleMeetingClick = (meeting: Meeting) => {
    navigate(`/applications/${meeting.application_id}`);
  };

  return (
    <div className="space-y-5">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Interviews
          </h2>
          <p className="text-[13px] text-white/35 mt-0.5">
            {loading
              ? "Loading..."
              : `${meetings.length} upcoming`}
          </p>
        </div>
        <div className="flex bg-white/[0.04] rounded-lg p-0.5 border border-white/[0.06]">
          <button
            onClick={() => setView("calendar")}
            className={`flex items-center px-2.5 py-1.5 rounded-md transition-all duration-150 ${
              view === "calendar" ? "text-white bg-white/[0.08]" : "text-white/30"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1.5" y="2.5" width="13" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
              <line x1="1.5" y1="6.5" x2="14.5" y2="6.5" stroke="currentColor" strokeWidth="1.2" />
              <line x1="5" y1="1" x2="5" y2="4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="11" y1="1" x2="11" y2="4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex items-center px-2.5 py-1.5 rounded-md transition-all duration-150 ${
              view === "list" ? "text-white bg-white/[0.08]" : "text-white/30"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <line x1="1" y1="3" x2="15" y2="3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="1" y1="13" x2="15" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      {!loading && (
        <>
          {view === "calendar" && (
            <InterviewCalendarView
              meetings={meetings}
              onMeetingClick={handleMeetingClick}
            />
          )}
          {view === "list" && (
            <InterviewListView
              meetings={meetings}
              onMeetingClick={handleMeetingClick}
            />
          )}
        </>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-white/30 text-sm">Loading interviews...</div>
        </div>
      )}
    </div>
  );
}
