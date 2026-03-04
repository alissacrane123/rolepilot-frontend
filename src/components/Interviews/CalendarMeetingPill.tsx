import type { MeetingWithApp } from "./calendar-utils";
import { getMeetingTypeLabel, formatMeetingTime } from "./calendar-utils";
import { PencilIcon } from "@/components/icons";

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
        <PencilIcon />
      </span>
      <div className="text-[10px] font-medium text-indigo-300 truncate pr-4">
        {meeting.scheduled_at ? formatMeetingTime(meeting.scheduled_at) : ""}{" "}
        {meeting.meeting_type && getMeetingTypeLabel(meeting.meeting_type)}
      </div>
      <div className="text-[9px] text-white/35 truncate">
        {meeting._companyName}
      </div>
    </button>
  );
}
