import { useState, useMemo } from "react";
import type { Meeting } from "@/lib/api";
import {
  type MeetingWithApp,
  getMonthData,
  buildCells,
  groupMeetingsByDay,
} from "./calendar-utils";
import CalendarNav from "./CalendarNav";
import CalendarGrid from "./CalendarGrid";

export default function InterviewCalendarView({
  meetings,
  onMeetingClick,
  onMeetingEditClick,
}: {
  meetings: MeetingWithApp[];
  onMeetingClick?: (meeting: Meeting) => void;
  onMeetingEditClick?: (meeting: Meeting) => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const { startOffset, daysInMonth } = useMemo(
    () => getMonthData(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const cells = useMemo(
    () => buildCells(startOffset, daysInMonth),
    [startOffset, daysInMonth],
  );

  const meetingsByDay = useMemo(
    () => groupMeetingsByDay(meetings, viewYear, viewMonth),
    [meetings, viewYear, viewMonth],
  );

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const goToPrev = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNext = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const goToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  return (
    <div className="space-y-4">
      <CalendarNav
        monthLabel={monthLabel}
        onPrev={goToPrev}
        onNext={goToNext}
        onToday={goToToday}
      />
      <CalendarGrid
        cells={cells}
        viewYear={viewYear}
        viewMonth={viewMonth}
        today={today}
        meetingsByDay={meetingsByDay}
        onMeetingClick={(m) => onMeetingClick?.(m)}
        onMeetingEditClick={(m) => onMeetingEditClick?.(m)}
      />
    </div>
  );
}
