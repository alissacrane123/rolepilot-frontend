import type { FilterPanelProps } from "../types";
import { PRIORITY_COLORS } from "../TaskRow";

export function CollapsedStrip({
  pending,
}: Pick<FilterPanelProps, "pending">): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-1 py-3">
      {pending.map((t) => (
        <div
          key={t.id}
          title={t.title}
          className="w-[22px] h-[3px] rounded-sm opacity-70"
          style={{
            background: PRIORITY_COLORS[t.priority] ?? PRIORITY_COLORS[3],
          }}
        />
      ))}
      {pending.length > 0 && (
        <span className="mt-2 text-[10px] text-slate-600 font-bold [writing-mode:vertical-lr]">
          {pending.length}
        </span>
      )}
    </div>
  );
}
