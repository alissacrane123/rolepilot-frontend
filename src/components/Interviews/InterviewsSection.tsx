import { useState, useEffect, useCallback } from "react";
import {
  getUpcomingMeetings,
  getApplications,
  type Meeting,
  type JobApplication,
} from "@/lib/api";
import type { MeetingWithApp } from "./calendar-utils";
import InterviewListView from "./InterviewListView";
import InterviewCalendarView from "./InterviewCalendarView";
import MeetingDetailModal from "./MeetingDetailModal";
import { CalendarViewIcon, ListViewIcon } from "@/components/icons";
import EmptyState from "../EmpyState";

type InterviewView = "calendar" | "list";

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
  const [view, setView] = useState<InterviewView>("calendar");
  const [meetings, setMeetings] = useState<MeetingWithApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingWithApp | null>(
    null,
  );

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
    const enriched = meetings.find((m) => m.id === meeting.id);
    setSelectedMeeting(
      enriched ?? {
        ...meeting,
        _companyName: undefined,
        _roleTitle: undefined,
      },
    );
  };

  if (loading) {
    return (
      <EmptyState
        title="Loading interviews..."
        description="Please wait while we load your interviews."
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Interviews
          </h2>
          <p className="text-[13px] text-white/35 mt-0.5">
            {loading ? "Loading..." : `${meetings.length} upcoming`}
          </p>
        </div>
        <div className="flex bg-white/[0.04] rounded-lg p-0.5 border border-white/[0.06]">
          <button
            onClick={() => setView("calendar")}
            className={`flex items-center px-2.5 py-1.5 rounded-md transition-all duration-150 ${
              view === "calendar"
                ? "text-white bg-white/[0.08]"
                : "text-white/30"
            }`}
          >
            <CalendarViewIcon />
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex items-center px-2.5 py-1.5 rounded-md transition-all duration-150 ${
              view === "list" ? "text-white bg-white/[0.08]" : "text-white/30"
            }`}
          >
            <ListViewIcon />
          </button>
        </div>
      </div>

      {/* Content */}
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

      {/* Meeting detail modal */}
      {selectedMeeting && (
        <MeetingDetailModal
          meeting={selectedMeeting}
          companyName={selectedMeeting._companyName}
          roleTitle={selectedMeeting._roleTitle}
          onClose={() => setSelectedMeeting(null)}
          onUpdated={fetchData}
        />
      )}
    </div>
  );
}
