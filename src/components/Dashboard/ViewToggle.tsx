import type { ViewMode } from "@/lib/constants";

export default function ViewToggle({
  view,
  onChange,
}: {
  view: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  return (
    <div className="flex bg-white/[0.04] rounded-lg p-0.5 border border-white/[0.06]">
      <button
        onClick={() => onChange("board")}
        className={`flex items-center px-2.5 py-1.5 rounded-md transition-all duration-150 ${
          view === "board" ? "text-white bg-white/[0.08]" : "text-white/30"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="5" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <rect x="10" y="1" width="5" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>
      <button
        onClick={() => onChange("list")}
        className={`flex items-center px-2.5 py-1.5 rounded-md transition-all duration-150 ${
          view === "list" ? "text-white bg-white/[0.08]" : "text-white/30"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <line x1="1" y1="3" x2="15" y2="3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="1" y1="13" x2="15" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}