import type { FormattedDay } from "./types";
import { DOW_LABELS, MONTH_LABELS } from "./constants";

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDay(d: Date): FormattedDay {
  return {
    dow: DOW_LABELS[d.getDay()],
    date: d.getDate(),
  };
}

export function getWeekDays(anchor: Date): Date[] {
  const dayOfWeek = anchor.getDay();
  const start = addDays(anchor, -dayOfWeek);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function getDayLabel(date: Date, today: Date): string {
  if (isSameDay(date, today)) return "Today";
  const diff = Math.round(
    (date.getTime() - today.getTime()) / 86_400_000,
  );
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  return `${MONTH_LABELS[date.getMonth()]} ${date.getDate()}`;
}

export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 55%, 45%)`;
}
