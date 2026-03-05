import { useState } from "react";
import type { Todo } from "@/lib/types/todos";
import { PRIORITY_META } from "./constants";

export default function TodoRow({ todo, onToggle, onClick }: { todo: Todo; onToggle: (id: string) => void; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const pm = PRIORITY_META[todo.priority] ?? PRIORITY_META[3];

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${hovered ? "bg-white/[0.03]" : ""}`}>

      {/* checkbox */}
      <button onClick={e => { e.stopPropagation(); onToggle(todo.id); }}
        className={`w-5 h-5 rounded-full flex-shrink-0 border-2 flex items-center justify-center transition-all ${
          todo.completed ? `${pm.dot} border-transparent` : `border-white/[0.12] hover:${pm.ring}`
        }`}>
        {todo.completed && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <path d="M1 3.5L3.5 6L8 1" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* text */}
      <div onClick={onClick} className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate transition-all ${todo.completed ? "line-through text-white/20" : "text-white/80"}`}>
          {todo.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {todo.group_name && <span className="text-[10px] font-mono text-white/25">{todo.group_name}</span>}
          {todo.company_name && <span className="text-[10px] font-mono text-indigo-400/50">{todo.company_name}</span>}
          {todo.due_time && <span className="text-[10px] font-mono text-white/20">{todo.due_time}</span>}
          {todo.is_recurring && <span className="text-[9px] font-mono text-white/20 border border-white/[0.06] rounded px-1 py-px">↻</span>}
          {/* {todo.is_reminder && <span className="text-[9px] font-mono text-white/20 border border-white/[0.06] rounded px-1 py-px">⏰</span>} */}
        </div>
      </div>

      <div onClick={onClick} className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-opacity ${pm.dot} ${todo.completed ? "opacity-20" : "opacity-60"}`} />
      {hovered && !todo.completed && <span onClick={onClick} className="text-white/20 text-sm flex-shrink-0">›</span>}
    </div>
  );
}
