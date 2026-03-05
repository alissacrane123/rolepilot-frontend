import { useState } from "react";
import type { Meeting } from "@/lib/api";
import { useMeetingsQuery } from "@/hooks/useApi";
import { CalendarIcon } from "@/components/icons";
import { TimelineMeeting } from "./TimelineMeeting";
import MeetingDetailModal from "@/components/Interviews/MeetingDetailModal";
import EmptyState from "@/components/common/EmptyState";
import CreateMeetingModal from "../Meeting/CreateMeetingModal";
import type { MeetingsTabProps } from "./types";

export function MeetingsTab({
  applicationId,
  companyName,
  roleTitle,
}: MeetingsTabProps) {
  const { data: meetings = [], isLoading } = useMeetingsQuery(applicationId);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);

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
        icon={<CalendarIcon className="w-6 h-6 text-white/40" />}
        title="No meetings yet"
        cta={<CreateMeetingModal applicationId={applicationId} />}
        description="Meetings will appear here when you move this application to an interview stage."
      />
    );
  }

  const sorted = [...meetings].sort((a, b) => {
    if (!a.scheduled_at) return 1;
    if (!b.scheduled_at) return -1;
    return (
      new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()
    );
  });

  const handleToggle = (meetingId: string) => {
    setExpandedId(expandedId === meetingId ? null : meetingId);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between pb-5">
        <p className="text-[13px] text-white/35 mb-5">
          {meetings.length} meeting{meetings.length !== 1 ? "s" : ""} scheduled
        </p>
        <CreateMeetingModal applicationId={applicationId} />
      </div>

      <div className="flex flex-col">
        {sorted.map((meeting, i) => (
          <TimelineMeeting
            key={meeting.id}
            meeting={meeting}
            isLast={i === sorted.length - 1}
            isExpanded={expandedId === meeting.id}
            onToggle={() => handleToggle(meeting.id)}
            onEdit={() => setEditingMeeting(meeting)}
          />
        ))}
      </div>

      {editingMeeting && (
        <MeetingDetailModal
          meeting={editingMeeting}
          companyName={companyName}
          roleTitle={roleTitle}
          onClose={() => setEditingMeeting(null)}
        />
      )}
    </div>
  );
}

export default MeetingsTab;
