import type { MeetingWithApp } from "./calendar-utils";
import CalendarMeetingPill from "./CalendarMeetingPill";

export default function CalendarDayCell({
  day,
  isToday,
  isWeekend,
  meetings,
  onMeetingClick,
  onMeetingEditClick,
}: {
  day: number | null;
  isToday: boolean;
  isWeekend: boolean;
  meetings: MeetingWithApp[];
  onMeetingClick: (meeting: MeetingWithApp) => void;
  onMeetingEditClick: (meeting: MeetingWithApp) => void;
}) {
  return (
    <div
      className={`min-h-[90px] border-b border-r border-white/[0.04] p-1.5 transition-colors ${
        day === null || isWeekend ? "bg-white/[0.01]" : "bg-transparent"
      }`}
    >
      {day !== null && (
        <>
          <div
            className={`text-[11px] font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
              isToday ? "bg-indigo-500 text-white font-bold" : "text-white/40"
            }`}
          >
            {day}
          </div>
          <div className="space-y-0.5">
            {meetings.slice(0, 3).map((m) => (
              <CalendarMeetingPill
                key={m.id}
                meeting={m}
                onClick={() => onMeetingClick(m)}
                onEditClick={() => onMeetingEditClick(m)}
              />
            ))}
            {meetings.length > 3 && (
              <div className="text-[9px] text-white/30 pl-1.5">
                +{meetings.length - 3} more
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
