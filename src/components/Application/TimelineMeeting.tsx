import { formatDate, formatTime } from "@/lib/dateUtils";
import { getMeetingTypeLabel } from "@/components/Interviews/calendar-utils";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  ChevronDownIcon,
} from "@/components/icons";
import { MeetingDetailItem } from "@/components/Application/MeetingDetailItem";
import type { TimelineMeetingProps } from "./types";

export function TimelineMeeting({
  meeting,
  isLast,
  isExpanded,
  onToggle,
  onEdit,
}: TimelineMeetingProps) {
  const isUpcoming = meeting.scheduled_at
    ? new Date(meeting.scheduled_at) > new Date()
    : false;

  const title = meeting.meeting_type
    ? getMeetingTypeLabel(meeting.meeting_type)
    : "Meeting";

  return (
    <div className="flex gap-4 animate-fade-in-up">
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

      <div className="flex-1 min-w-0 mb-2">
        <button
          onClick={onToggle}
          className="w-full text-left rounded-[10px] border border-white/[0.15] bg-white/[0.02] px-4 py-3 hover:bg-white/[0.04] hover:border-indigo-500/20 transition-all cursor-pointer flex items-center justify-between gap-4"
        >
          <div className="min-w-0 flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-white tracking-tight">
              {title}
            </h3>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              {meeting.scheduled_at && (
                <MeetingDetailItem>
                  <CalendarIcon className="opacity-60" />
                  {formatDate(meeting.scheduled_at)}
                </MeetingDetailItem>
              )}
              {meeting.scheduled_at && (
                <MeetingDetailItem>
                  <ClockIcon className="opacity-60" />
                  {formatTime(meeting.scheduled_at)}
                  {meeting.duration_minutes &&
                    ` · ${meeting.duration_minutes} min`}
                </MeetingDetailItem>
              )}
              {meeting.contact_name && (
                <MeetingDetailItem>
                  <UserIcon className="opacity-60" />
                  {meeting.contact_name}
                  {meeting.contact_title && `, ${meeting.contact_title}`}
                </MeetingDetailItem>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {isUpcoming && (
              <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/15 px-2 py-0.5 rounded">
                Upcoming
              </span>
            )}
            <ChevronDownIcon
              className="transition-transform duration-200 text-white/35"
              style={{
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </div>
        </button>

        {isExpanded && (
          <div className="border-l border-white/[0.15] ml-[18px] mt-2 mb-4 pl-5 pt-1 space-y-5 animate-fade-in-up">
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
