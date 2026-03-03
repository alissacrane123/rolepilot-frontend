import type { Meeting } from "@/lib/api";
import { MEETING_TYPES, LOCATION_TYPES } from "@/lib/api";

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function getMeetingTypeLabel(value: string) {
  return MEETING_TYPES.find((t) => t.value === value)?.label ?? value;
}

function getLocationLabel(value: string) {
  return LOCATION_TYPES.find((t) => t.value === value)?.label ?? value;
}

function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function isTomorrow(dateStr: string) {
  const d = new Date(dateStr);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return d.toDateString() === tomorrow.toDateString();
}

function getRelativeLabel(dateStr: string) {
  if (isToday(dateStr)) return "Today";
  if (isTomorrow(dateStr)) return "Tomorrow";
  return null;
}

export default function InterviewCard({
  meeting,
  companyName,
  roleTitle,
  onClick,
}: {
  meeting: Meeting;
  companyName?: string;
  roleTitle?: string;
  onClick?: () => void;
}) {
  const relativeLabel = meeting.scheduled_at ? getRelativeLabel(meeting.scheduled_at) : null;
  const urgent = relativeLabel === "Today";

  return (
    <div
      onClick={onClick}
      className={`rounded-[10px] p-4 border transition-all duration-200 cursor-pointer
        ${urgent
          ? "bg-indigo-500/[0.06] border-indigo-500/20 hover:border-indigo-500/35"
          : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.055] hover:border-indigo-500/25"
        }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {meeting.meeting_type && (
              <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
                {getMeetingTypeLabel(meeting.meeting_type)}
              </span>
            )}
            {relativeLabel && (
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                urgent ? "text-amber-400" : "text-white/40"
              }`}>
                {relativeLabel}
              </span>
            )}
          </div>
          <h4 className="text-[13px] font-medium text-white/90 truncate tracking-tight">
            {roleTitle || "Interview"}
          </h4>
          {companyName && (
            <p className="text-xs text-white/50">{companyName}</p>
          )}
        </div>

        <div className="text-right shrink-0">
          {meeting.scheduled_at && (
            <>
              <div className="text-[13px] font-semibold text-white/80 font-mono">
                {formatTime(meeting.scheduled_at)}
              </div>
              <div className="text-[11px] text-white/35">
                {formatDate(meeting.scheduled_at)}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 text-[11px] text-white/40">
        {meeting.duration_minutes && (
          <span>{meeting.duration_minutes}min</span>
        )}
        {meeting.location_type && (
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-white/20" />
            {getLocationLabel(meeting.location_type)}
          </span>
        )}
        {meeting.contact_name && (
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-white/20" />
            {meeting.contact_name}
            {meeting.contact_title && (
              <span className="text-white/25">({meeting.contact_title})</span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}
