import { useState } from "react";
import type { Meeting } from "@/lib/api";
import { useMeetingsQuery } from "@/hooks/useApi";
import { getMeetingTypeLabel } from "@/components/Interviews/calendar-utils";
import MeetingDetailModal from "@/components/Interviews/MeetingDetailModal";
import EmptyState from "@/components/EmpyState";
import InterviewListView from "../Interviews/InterviewListView";
import { InterviewSection } from "../Interviews/InterviewSection";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function MeetingCard({
  meeting,
  isLast,
  onClick,
}: {
  meeting: Meeting;
  isLast: boolean;
  onClick: () => void;
}) {
  const isUpcoming = meeting.scheduled_at
    ? new Date(meeting.scheduled_at) > new Date()
    : false;

  return (
    <div className="flex gap-4 animate-fade-in-up">
      {/* Timeline track */}
      <div className="flex flex-col items-center w-5 shrink-0 pt-3.5">
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0 z-[2] transition-all"
          style={{
            background: isUpcoming ? "#6366f1" : "rgba(255,255,255,0.15)",
            boxShadow: isUpcoming ? "0 0 0 4px rgba(99,102,241,0.15)" : "none",
          }}
        />
        {!isLast && <div className="w-px flex-1 bg-white/[0.06] mt-1" />}
      </div>

      {/* Card */}
      <button
        onClick={onClick}
        className="flex-1 min-w-0 text-left rounded-[10px] border border-white/[0.06] bg-white/[0.02] p-3.5 mb-2 hover:bg-white/[0.04] hover:border-indigo-500/20 transition-all cursor-pointer"
      >
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white tracking-tight truncate">
              {meeting.meeting_type
                ? getMeetingTypeLabel(meeting.meeting_type)
                : "Meeting"}
            </h3>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              {meeting.scheduled_at && (
                <span className="text-[11px] text-white/35 flex items-center gap-1">
                  {formatDate(meeting.scheduled_at)}
                </span>
              )}
              {meeting.scheduled_at && (
                <span className="text-[11px] text-white/35 flex items-center gap-1">
                  {formatTime(meeting.scheduled_at)}
                  {meeting.duration_minutes &&
                    ` · ${meeting.duration_minutes} min`}
                </span>
              )}
              {meeting.contact_name && (
                <span className="text-[11px] text-white/35">
                  {meeting.contact_name}
                  {meeting.contact_title && `, ${meeting.contact_title}`}
                </span>
              )}
            </div>
          </div>

          {isUpcoming && (
            <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/15 px-2 py-0.5 rounded shrink-0">
              Upcoming
            </span>
          )}
        </div>

        {meeting.prep_notes && (
          <p className="text-[12px] text-white/30 mt-2 line-clamp-2 leading-relaxed">
            {meeting.prep_notes}
          </p>
        )}
      </button>
    </div>
  );
}

export default function MeetingsTab({
  applicationId,
  companyName,
  roleTitle,
}: {
  applicationId: string;
  companyName?: string;
  roleTitle?: string;
}) {
  const { data: meetings = [], isLoading } = useMeetingsQuery(applicationId);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  if (isLoading) {
    return (
      <EmptyState
        title="Loading meetings..."
        description="Please wait while we load your meetings."
      />
    );
  }

  if (meetings.length === 0) {
    return (
      <EmptyState
        title="No meetings yet"
        description="Meetings will appear here when you move this application to an interview stage."
      />
    );
  }

  const sorted = [...meetings].sort((a, b) => {
    if (!a.scheduled_at) return 1;
    if (!b.scheduled_at) return -1;
    return (
      new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
    );
  });

  const upcomingMeetings = sorted.filter(
    (meeting) => new Date(meeting.scheduled_at) > new Date(),
  );
  const pastMeetings = sorted.filter(
    (meeting) => new Date(meeting.scheduled_at) < new Date(),
  );

  return (
    <div className="animate-fade-in-up">
      <InterviewSection
        meetings={upcomingMeetings}
        onMeetingClick={setSelectedMeeting}
        title="Upcoming Interviews"
      />
      <InterviewSection
        meetings={pastMeetings}
        onMeetingClick={setSelectedMeeting}
        title="Past Interviews"
      />

      {selectedMeeting && (
        <MeetingDetailModal
          meeting={selectedMeeting}
          companyName={companyName}
          roleTitle={roleTitle}
          onClose={() => setSelectedMeeting(null)}
        />
      )}
    </div>
  );
}
