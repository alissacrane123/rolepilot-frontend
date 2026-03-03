import { useState, useMemo } from "react";
import type { Meeting } from "@/lib/api";
import { MEETING_TYPES } from "@/lib/api";

interface MeetingWithApp extends Meeting {
  _companyName?: string;
  _roleTitle?: string;
}

function getMeetingTypeLabel(value: string) {
  return MEETING_TYPES.find((t) => t.value === value)?.label ?? value;
}

function getMonthData(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  return { startOffset, daysInMonth };
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function InterviewCalendarView({
  meetings,
  onMeetingClick,
}: {
  meetings: MeetingWithApp[];
  onMeetingClick?: (meeting: Meeting) => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const { startOffset, daysInMonth } = useMemo(
    () => getMonthData(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const meetingsByDay = useMemo(() => {
    const map = new Map<number, MeetingWithApp[]>();
    for (const m of meetings) {
      if (!m.scheduled_at) continue;
      const d = new Date(m.scheduled_at);
      if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
        const day = d.getDate();
        if (!map.has(day)) map.set(day, []);
        map.get(day)!.push(m);
      }
    }
    return map;
  }, [meetings, viewYear, viewMonth]);

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

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="space-y-4">
      {/* Nav */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-white/80">{monthLabel}</h3>
          <button
            onClick={goToToday}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Today
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={goToPrev}
            className="w-7 h-7 rounded-md flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all"
          >
            ‹
          </button>
          <button
            onClick={goToNext}
            className="w-7 h-7 rounded-md flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all"
          >
            ›
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="rounded-xl border border-white/[0.06] overflow-hidden">
        {/* Weekday header */}
        <div className="grid grid-cols-7 border-b border-white/[0.06]">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="py-2 text-center text-[10px] font-semibold text-white/30 uppercase tracking-wider"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            const isCurrentDay =
              day !== null && isSameDay(new Date(viewYear, viewMonth, day), today);
            const dayMeetings = day ? meetingsByDay.get(day) || [] : [];
            const isWeekend = idx % 7 === 0 || idx % 7 === 6;

            return (
              <div
                key={idx}
                className={`min-h-[90px] border-b border-r border-white/[0.04] p-1.5 transition-colors ${
                  day === null
                    ? "bg-white/[0.01]"
                    : isWeekend
                      ? "bg-white/[0.01]"
                      : "bg-transparent"
                }`}
              >
                {day !== null && (
                  <>
                    <div
                      className={`text-[11px] font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                        isCurrentDay
                          ? "bg-indigo-500 text-white font-bold"
                          : "text-white/40"
                      }`}
                    >
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {dayMeetings.slice(0, 3).map((m) => (
                        <button
                          key={m.id}
                          onClick={() => onMeetingClick?.(m)}
                          className="w-full text-left rounded px-1.5 py-0.5 bg-indigo-500/[0.12] hover:bg-indigo-500/[0.2] border border-indigo-500/20 transition-colors cursor-pointer"
                        >
                          <div className="text-[10px] font-medium text-indigo-300 truncate">
                            {m.scheduled_at
                              ? new Date(m.scheduled_at).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                })
                              : ""}{" "}
                            {m.meeting_type && getMeetingTypeLabel(m.meeting_type)}
                          </div>
                          <div className="text-[9px] text-white/35 truncate">
                            {m._companyName}
                          </div>
                        </button>
                      ))}
                      {dayMeetings.length > 3 && (
                        <div className="text-[9px] text-white/30 pl-1.5">
                          +{dayMeetings.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
