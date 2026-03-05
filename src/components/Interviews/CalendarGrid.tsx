import type { MeetingWithApp } from "./calendar-utils";
import { WEEKDAYS, isSameDay } from "./calendar-utils";
import CalendarDayCell from "./CalendarDayCell";

export default function CalendarGrid({
  cells,
  viewYear,
  viewMonth,
  today,
  meetingsByDay,
  onMeetingClick,
  onMeetingEditClick,
}: {
  cells: (number | null)[];
  viewYear: number;
  viewMonth: number;
  today: Date;
  meetingsByDay: Map<number, MeetingWithApp[]>;
  onMeetingClick?: (meeting: MeetingWithApp) => void;
  onMeetingEditClick?: (meeting: MeetingWithApp) => void;
}) {
  return (
    <div className="rounded-xl border border-white/[0.15] overflow-hidden">
      <div className="grid grid-cols-7 border-b border-white/[0.15]">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-[10px] font-semibold text-white/35 uppercase tracking-wider"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => (
          <CalendarDayCell
            key={idx}
            day={day}
            isToday={
              day !== null &&
              isSameDay(new Date(viewYear, viewMonth, day), today)
            }
            isWeekend={idx % 7 === 0 || idx % 7 === 6}
            meetings={day ? meetingsByDay.get(day) || [] : []}
            onMeetingClick={onMeetingClick}
            onMeetingEditClick={onMeetingEditClick}
          />
        ))}
      </div>
    </div>
  );
}
