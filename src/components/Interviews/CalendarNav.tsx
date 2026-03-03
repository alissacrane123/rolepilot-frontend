export default function CalendarNav({
  monthLabel,
  onPrev,
  onNext,
  onToday,
}: {
  monthLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-semibold text-white/80">{monthLabel}</h3>
        <button
          onClick={onToday}
          className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          Today
        </button>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onPrev}
          className="w-7 h-7 rounded-md flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all"
        >
          ‹
        </button>
        <button
          onClick={onNext}
          className="w-7 h-7 rounded-md flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all"
        >
          ›
        </button>
      </div>
    </div>
  );
}
