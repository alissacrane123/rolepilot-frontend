import type { MeetingWithApp } from "./calendar-utils";
import { getMeetingTypeLabel } from "./calendar-utils";

export default function CalendarMeetingPill({
  meeting,
  onClick,
  onEditClick,
}: {
  meeting: MeetingWithApp;
  onClick: () => void;
  onEditClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group/pill relative w-full text-left rounded px-1.5 py-0.5 bg-indigo-500/[0.12] hover:bg-indigo-500/[0.2] border border-indigo-500/20 transition-colors cursor-pointer"
    >
      <span
        onClick={(e) => {
          e.stopPropagation();
          onEditClick();
        }}
        className="absolute top-0.5 right-0.5 hidden group-hover/pill:flex items-center justify-center w-4 h-4 rounded bg-white/[0.08] hover:bg-white/[0.15] text-white/50 hover:text-white/80 transition-all"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            d="M7.5 1.5L8.5 2.5L3.5 7.5L1.5 8.5L2.5 6.5L7.5 1.5Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div className="text-[10px] font-medium text-indigo-300 truncate pr-4">
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
