import { getToday } from "./dateHelpers";
import type { Todo } from "@/lib/types/todos";

export default function TodosDaySelector({
  weekDates,
  selectedDate,
  todos,
  setSelectedDate,
}: {
  weekDates: string[];
  selectedDate: string;
  todos: Todo[];
  setSelectedDate: (date: string) => void;
}) {
  return (
    <div className="flex gap-1 mb-5 overflow-x-auto pb-0.5">
      {weekDates.map((date) => {
        const d = new Date(date + "T00:00:00");
        const isActive = date === selectedDate;
        const isToday = date === getToday();
        const hasTodos = todos.some((t) => t.due_date === date);
        return (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`flex-1 min-w-[60px] flex flex-col items-center gap-1 py-2.5 rounded-[10px] border transition-all duration-200 ${isActive ? "border-indigo-500/30 bg-white/[0.04]" : "border-transparent hover:bg-white/[0.02]"}`}
          >
            <span
              className={`text-[10px] font-semibold tracking-widest ${isActive ? "text-indigo-400" : "text-white/20"}`}
            >
              {d
                .toLocaleDateString("en-US", { weekday: "short" })
                .toUpperCase()}
            </span>
            <span
              className={`text-lg font-bold tracking-tight ${isActive ? "text-white" : isToday ? "text-white/70" : "text-white/25"}`}
            >
              {d.getDate()}
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${hasTodos ? (isActive ? "bg-indigo-500" : "bg-white/20") : "bg-transparent"}`}
            />
          </button>
        );
      })}
    </div>
  );
}
