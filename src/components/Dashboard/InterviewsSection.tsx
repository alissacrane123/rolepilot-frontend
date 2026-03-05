import { useState, useMemo } from "react";
import { type Meeting, type JobApplication } from "@/lib/api";
import { useUpcomingMeetingsQuery, useApplicationsQuery } from "@/hooks/useApi";
import type { MeetingWithApp } from "@/components/Interviews/calendar-utils";
import InterviewListView from "@/components/Interviews/InterviewListView";
import InterviewCalendarView from "@/components/Interviews/InterviewCalendarView";
import MeetingDetailModal from "@/components/Interviews/MeetingDetailModal";
import { CalendarViewIcon, ListViewIcon } from "@/components/icons";
import EmptyState from "@/components/EmptyState";
import { TextTitle1 } from "@/components/ui/text/TextTitle1";
import { TextBody } from "@/components/ui/text/TextBody";
import ViewToggle from "@/components/Dashboard/ViewToggle";

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
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingWithApp | null>(
    null,
  );

  const { data: rawMeetings = [], isLoading: loadingMeetings } =
    useUpcomingMeetingsQuery();
  const { data: rawApps = [], isLoading: loadingApps } = useApplicationsQuery();

  const loading = loadingMeetings || loadingApps;

  const meetings = useMemo(
    () => enrichMeetings(rawMeetings, rawApps),
    [rawMeetings, rawApps],
  );

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

  const handleViewChange = (view: "start" | "end") => {
    setView(view === "start" ? "calendar" : "list");
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
      {/* Section TextTitle1 */}
      <div className="flex items-center justify-between">
        <div>
          <TextTitle1>Interviews</TextTitle1>
          <TextBody className="mt-0.5">
            {loading ? "Loading..." : `${meetings.length} upcoming`}
          </TextBody>
        </div>
        <ViewToggle
          view={view === "calendar" ? "start" : "end"}
          onChange={handleViewChange}
          icon1={<CalendarViewIcon />}
          icon2={<ListViewIcon />}
        />
      </div>

      {/* Content */}
      {view === "calendar" && (
        <InterviewCalendarView
          meetings={meetings}
          onMeetingClick={handleMeetingClick}
          onMeetingEditClick={handleMeetingClick}
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
        />
      )}
    </div>
  );
}
