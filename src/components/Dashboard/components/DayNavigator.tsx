import { Button } from "@/components/ui/button";
import type { DayNavigatorProps } from "../types";

export function DayNavigator({
  isToday,
  onSetToday,
  onNavigateDay,
}: DayNavigatorProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between mb-2.5">
      <div className="flex items-center gap-1.5">
        <Button
          onClick={onSetToday}
          aria-label="Go to today"
          variant={isToday ? "indigo" : "gray"}
          size="xs"
        >
          TODAY
        </Button>
      </div>
      <div className="flex gap-[3px] items-center">
        <button
          onClick={() => onNavigateDay(-1)}
          aria-label="Previous day"
          className="bg-white/[0.04] border border-[#1e1e2e] rounded-[5px] text-slate-500 w-[22px] h-[22px] cursor-pointer text-[15px] flex items-center justify-center transition-all duration-100 font-bold leading-none p-0"
        >
          ‹
        </button>
        <button
          onClick={() => onNavigateDay(1)}
          aria-label="Next day"
          className="bg-white/[0.04] border border-[#1e1e2e] rounded-[5px] text-slate-500 w-[22px] h-[22px] cursor-pointer text-[15px] flex items-center justify-center transition-all duration-100 font-bold leading-none p-0"
        >
          ›
        </button>
      </div>
    </div>
  );
}
