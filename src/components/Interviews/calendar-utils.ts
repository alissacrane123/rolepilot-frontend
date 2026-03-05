import type { Meeting } from "@/lib/api";
import { MEETING_TYPES, LOCATION_TYPES } from "@/lib/api";

export interface MeetingWithApp extends Meeting {
  _companyName?: string;
  _roleTitle?: string;
}

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function getMonthData(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  return { startOffset: firstDay.getDay(), daysInMonth: lastDay.getDate() };
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getMeetingTypeLabel(value: string) {
  return MEETING_TYPES.find((t) => t.value === value)?.label ?? value;
}

export function getLocationLabel(value: string) {
  return LOCATION_TYPES.find((t) => t.value === value)?.label ?? value;
}

export {
  formatTime as formatMeetingTime,
  formatShortDate as formatMeetingDate,
} from "@/lib/dateUtils";

export function getRelativeLabel(dateStr: string): string | null {
  const d = new Date(dateStr).toDateString();
  const now = new Date();
  if (d === now.toDateString()) return "Today";
  now.setDate(now.getDate() + 1);
  if (d === now.toDateString()) return "Tomorrow";
  return null;
}

export function buildCells(
  startOffset: number,
  daysInMonth: number,
): (number | null)[] {
  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function groupMeetingsByDay(
  meetings: MeetingWithApp[],
  year: number,
  month: number,
): Map<number, MeetingWithApp[]> {
  const map = new Map<number, MeetingWithApp[]>();
  for (const m of meetings) {
    if (!m.scheduled_at) continue;
    const d = new Date(m.scheduled_at);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(m);
    }
  }
  return map;
}
