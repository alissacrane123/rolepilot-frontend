import { useState } from "react";
import type { Todo } from "@/lib/types/todos";
import { CheckmarkIcon, CloseSmallIcon } from "./icons";

const PRIORITY_COLORS: Record<number, string> = {
  1: "#d946ef", // fuchsia
  2: "#f97316", // orange/red
  3: "#eab308", // yellow
  4: "#6b7280", // gray
};

export default function TaskRow({
  task,
  onToggle,
  onRemove,
  onClick,
}: {
  task: Todo;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const color = PRIORITY_COLORS[task.priority] ?? PRIORITY_COLORS[3];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex items-center gap-2 px-2 py-[7px] rounded-[7px] transition-colors duration-100 mb-0.5 cursor-default ${
        hovered ? "bg-white/[0.04]" : "bg-transparent"
      }`}
    >
      {/* Circular checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={`w-4 h-4 rounded-full shrink-0 flex items-center justify-center transition-all duration-150 p-0 ${
          task.completed
            ? "bg-gradient-to-br from-indigo-700 to-indigo-500 border-0"
            : "bg-transparent border-2 border-slate-700"
        }`}
      >
        {task.completed && <CheckmarkIcon />}
      </button>

      {/* Title */}
      <span
        onClick={onClick}
        className={`flex-1 text-xs select-none tracking-tight ${
          task.completed
            ? "text-slate-600 line-through"
            : "text-slate-300 cursor-pointer hover:text-slate-200"
        }`}
      >
        {task.title}
      </span>

      {/* Priority dot */}
      {!task.completed && (
        <div
          className="w-1.5 h-1.5 rounded-full shrink-0 transition-opacity"
          style={{ background: color, opacity: hovered ? 1 : 0.5 }}
        />
      )}

      {/* Delete button on hover */}
      {hovered && (
        <button
          onClick={() => onRemove(task.id)}
          className="bg-transparent border-none text-slate-600 cursor-pointer p-0 px-0.5 flex items-center text-xs leading-none hover:text-slate-400"
        >
          <CloseSmallIcon />
        </button>
      )}
    </div>
  );
}

export { PRIORITY_COLORS };
