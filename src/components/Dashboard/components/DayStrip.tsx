import { TODAY, DOW_LABELS } from "../constants";
import { formatDay, isSameDay, dateKey } from "../date-utils";
import type { DayStripProps } from "../types";

export function DayStrip({
  weekDays,
  selectedDate,
  tasksByDate,
  onSelectDay,
}: DayStripProps): React.JSX.Element {
  return (
    <div className="flex gap-0.5 mb-3">
      {weekDays.map((d, i) => {
        const f = formatDay(d);
        const isSel = isSameDay(d, selectedDate);
        const isT = isSameDay(d, TODAY);
        const hasTasks = (tasksByDate[dateKey(d)] ?? 0) > 0;

        return (
          <button
            key={i}
            onClick={() => onSelectDay(d)}
            aria-label={`Select ${DOW_LABELS[d.getDay()]} ${d.getDate()}`}
            className="flex-1 bg-transparent border-none cursor-pointer p-0"
          >
            <div
              className={`flex flex-col items-center py-[5px] px-0.5 rounded-lg transition-all duration-[120ms] border ${
                isSel
                  ? "bg-indigo-500/[0.18] border-indigo-500/[0.35]"
                  : "bg-transparent border-transparent"
              }`}
            >
              <span
                className={`text-[8px] font-bold tracking-wide uppercase mb-[3px] ${
                  isSel
                    ? "text-indigo-400"
                    : isT
                      ? "text-slate-500"
                      : "text-gray-700"
                }`}
              >
                {f.dow}
              </span>
              <span
                className={`text-xs leading-none ${
                  isSel
                    ? "font-extrabold text-indigo-400"
                    : isT
                      ? "font-extrabold text-slate-200"
                      : "font-semibold text-gray-600"
                }`}
              >
                {f.date}
              </span>
              <div
                className={`w-1 h-1 rounded-full mt-1 transition-all duration-[120ms] ${
                  hasTasks
                    ? isSel
                      ? "bg-indigo-400"
                      : "bg-slate-800"
                    : "bg-transparent"
                }`}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
