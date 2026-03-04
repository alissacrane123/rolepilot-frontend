import { useState } from "react";
import type { Meeting } from "@/lib/api";
import { useMeetingsQuery } from "@/hooks/useApi";
import { getMeetingTypeLabel } from "@/components/Interviews/calendar-utils";
import MeetingDetailModal from "@/components/Interviews/MeetingDetailModal";
import EmptyState from "@/components/EmpyState";

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

function TimelineMeeting({
  meeting,
  isLast,
  isExpanded,
  onToggle,
  onEdit,
}: {
  meeting: Meeting;
  isLast: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
}) {
  const isUpcoming = meeting.scheduled_at
    ? new Date(meeting.scheduled_at) > new Date()
    : false;

  const title = meeting.meeting_type
    ? getMeetingTypeLabel(meeting.meeting_type)
    : "Meeting";

  return (
    <div
      className="flex gap-4 animate-fade-in-up"
    >
      {/* Timeline track */}
      <div className="flex flex-col items-center w-5 shrink-0 pt-3.5">
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0 z-[2] transition-all"
          style={{
            background: isUpcoming ? "#6366f1" : "rgba(255,255,255,0.15)",
            boxShadow: isUpcoming
              ? "0 0 0 4px rgba(99,102,241,0.15)"
              : "none",
          }}
        />
        {!isLast && <div className="w-px flex-1 bg-white/[0.06] mt-1" />}
      </div>

      {/* Card */}
      <div className="flex-1 min-w-0 mb-2">
        <button
          onClick={onToggle}
          className="w-full text-left rounded-[10px] border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 hover:bg-white/[0.04] hover:border-indigo-500/20 transition-all cursor-pointer flex items-center justify-between gap-3"
        >
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-white tracking-tight">
              {title}
            </h3>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              {meeting.scheduled_at && (
                <span className="text-[11px] text-white/35 flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="opacity-60">
                    <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.1" />
                    <line x1="1.5" y1="5.5" x2="12.5" y2="5.5" stroke="currentColor" strokeWidth="1.1" />
                    <line x1="4.5" y1="1" x2="4.5" y2="3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                    <line x1="9.5" y1="1" x2="9.5" y2="3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                  </svg>
                  {formatDate(meeting.scheduled_at)}
                </span>
              )}
              {meeting.scheduled_at && (
                <span className="text-[11px] text-white/35 flex items-center gap-1">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="opacity-60">
                    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.1" />
                    <path d="M6 3V6L8 7.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {formatTime(meeting.scheduled_at)}
                  {meeting.duration_minutes && ` · ${meeting.duration_minutes} min`}
                </span>
              )}
              {meeting.contact_name && (
                <span className="text-[11px] text-white/35 flex items-center gap-1">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="opacity-60">
                    <circle cx="6" cy="3.5" r="2.5" stroke="currentColor" strokeWidth="1.1" />
                    <path d="M1 11C1 8.5 3 7 6 7C9 7 11 8.5 11 11" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                  </svg>
                  {meeting.contact_name}
                  {meeting.contact_title && `, ${meeting.contact_title}`}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {isUpcoming && (
              <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/15 px-2 py-0.5 rounded">
                Upcoming
              </span>
            )}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="transition-transform duration-200 text-white/35"
              style={{
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <path
                d="M3.5 5L7 8.5L10.5 5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>

        {/* Expanded content */}
        {isExpanded && (
          <div className="border-l border-white/[0.06] ml-[18px] mt-2 mb-4 pl-5 pt-1 space-y-5 animate-fade-in-up">
            {/* Notes */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-[11px] font-semibold text-white/40 uppercase tracking-widest">
                  Notes
                </h4>
                <button
                  onClick={onEdit}
                  className="text-[12px] font-medium text-indigo-400/70 hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Edit
                </button>
              </div>
              <p className="text-[13px] text-white/50 leading-relaxed">
                {meeting.prep_notes || "No notes yet — click Edit to add some."}
              </p>
            </div>

            {/* Post-interview notes */}
            {meeting.post_notes && (
              <div>
                <h4 className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2.5">
                  Post-Interview
                </h4>
                <p className="text-[13px] text-white/50 leading-relaxed">
                  {meeting.post_notes}
                </p>
              </div>
            )}

            {/* Outcome */}
            {meeting.outcome && (
              <div>
                <h4 className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2.5">
                  Outcome
                </h4>
                <p className="text-[13px] text-white/50 leading-relaxed">
                  {meeting.outcome}
                </p>
              </div>
            )}

            {/* Location details */}
            {(meeting.location_type || meeting.location_details) && (
              <div>
                <h4 className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2.5">
                  Location
                </h4>
                <p className="text-[13px] text-white/50 leading-relaxed">
                  {meeting.location_type && (
                    <span className="capitalize">{meeting.location_type}</span>
                  )}
                  {meeting.location_type && meeting.location_details && " — "}
                  {meeting.location_details}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
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
        title="No meetings yet"
        description="Meetings will appear here when you move this application to an interview stage."
      />
    );
  }

  const sorted = [...meetings].sort((a, b) => {
    if (!a.scheduled_at) return 1;
    if (!b.scheduled_at) return -1;
    return new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime();
  });

  return (
    <div className="animate-fade-in-up">
      <p className="text-[13px] text-white/35 mb-5">
        {meetings.length} meeting{meetings.length !== 1 ? "s" : ""} scheduled
      </p>

      <div className="flex flex-col">
        {sorted.map((meeting, i) => (
          <TimelineMeeting
            key={meeting.id}
            meeting={meeting}
            isLast={i === sorted.length - 1}
            isExpanded={expandedId === meeting.id}
            onToggle={() =>
              setExpandedId(expandedId === meeting.id ? null : meeting.id)
            }
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
