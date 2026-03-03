import type { ViewMode } from "@/lib/constants";
import { BoardViewIcon, ListViewIcon } from "@/components/icons";

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
        <BoardViewIcon />
      </button>
      <button
        onClick={() => onChange("list")}
        className={`flex items-center px-2.5 py-1.5 rounded-md transition-all duration-150 ${
          view === "list" ? "text-white bg-white/[0.08]" : "text-white/30"
        }`}
      >
        <ListViewIcon />
      </button>
    </div>
  );
}