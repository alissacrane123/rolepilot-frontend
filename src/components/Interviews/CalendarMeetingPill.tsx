import type { MeetingWithApp } from "./calendar-utils";
import { getMeetingTypeLabel } from "./calendar-utils";

export default function CalendarMeetingPill({
  meeting,
  onClick,
}: {
  meeting: MeetingWithApp;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded px-1.5 py-0.5 bg-indigo-500/[0.12] hover:bg-indigo-500/[0.2] border border-indigo-500/20 transition-colors cursor-pointer"
    >
      <div className="text-[10px] font-medium text-indigo-300 truncate">
        {meeting.scheduled_at
          ? new Date(meeting.scheduled_at).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })
          : ""}{" "}
        {meeting.meeting_type && getMeetingTypeLabel(meeting.meeting_type)}
      </div>
      <div className="text-[9px] text-white/35 truncate">
        {meeting._companyName}
      </div>
    </button>
  );
}
