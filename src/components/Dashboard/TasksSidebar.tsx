import { useState, useRef } from "react";
import type { Todo, CreateTodoData } from "@/lib/types/todos";
import { useTodosQuery, useTodoGroupsQuery } from "@/hooks/queries/todos";
import {
  useCreateTodoMutation,
  useToggleTodoMutation,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from "@/hooks/mutations/todos";
import useResizablePanel from "@/hooks/useResizablePanel";
import ResizeHandle from "@/components/ui/ResizeHandle";
import TaskRow, { PRIORITY_COLORS } from "./TaskRow";
import DetailModal from "@/components/Todos/DetailModal";

const SIDEBAR_DEFAULT = 300;
const SIDEBAR_MIN = 220;
const SIDEBAR_MAX = 480;
const COLLAPSE_THRESHOLD = 140;
const COLLAPSED_WIDTH = 44;

export default function TasksSidebar() {
  const { width, collapsed, isDragging, handlePointerDown, setCollapsed } =
    useResizablePanel({
      defaultWidth: SIDEBAR_DEFAULT,
      minWidth: SIDEBAR_MIN,
      maxWidth: SIDEBAR_MAX,
      collapseThreshold: COLLAPSE_THRESHOLD,
    });

  const [newTask, setNewTask] = useState("");
  const [completedOpen, setCompletedOpen] = useState(true);
  const [selected, setSelected] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: todos = [] } = useTodosQuery();
  const { data: groups = [] } = useTodoGroupsQuery();
  const createMutation = useCreateTodoMutation();
  const toggleMutation = useToggleTodoMutation();
  const deleteMutation = useDeleteTodoMutation();
  const updateMutation = useUpdateTodoMutation();

  const pending = todos.filter((t) => !t.completed);
  const done = todos.filter((t) => t.completed);

  const addTask = () => {
    const text = newTask.trim();
    if (!text) return;
    createMutation.mutate({ title: text, priority: 3 });
    setNewTask("");
  };

  const toggleDone = (id: string) => toggleMutation.mutate(id);
  const removeTask = (id: string) => deleteMutation.mutate(id);
  const saveTodo = (id: string, data: Partial<CreateTodoData>) => {
    updateMutation.mutate({ todoId: id, data });
  };
  const handleDelete = (id: string) => deleteMutation.mutate(id);

  const sidebarWidth = collapsed ? COLLAPSED_WIDTH : width;

  return (
    <div
      className={`border-r border-[#1e1e2e] bg-[#0d0d14] flex flex-col shrink-0 relative  ${
        isDragging
          ? ""
          : "transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
      }`}
      style={{ width: sidebarWidth, minWidth: sidebarWidth }}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={` bg-[#0d0d14] border border-[#1e1e2e] rounded-full text-slate-500 cursor-pointer p-1.5 px-1.5 flex items-center justify-center transition-all duration-150 shrink-0 hover:text-slate-400  ${
          collapsed ? "ml-0" : "ml-auto"
        } absolute right-[-14px] top-4 z-22`}
      >
        {collapsed ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        ) : (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        )}
      </button>
      <ResizeHandle
        onPointerDown={handlePointerDown}
        isDragging={isDragging}
        disabled={collapsed}
      />
      {/* Header */}
      <div
        className={`flex items-center justify-between border-b border-[#1e1e2e] shrink-0 h-[52px] ${
          collapsed ? "px-2.5 py-3.5" : "px-4 py-3.5"
        } `}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-slate-100 tracking-tight">
              Tasks
            </span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 py-px rounded-[10px] font-semibold">
              {pending.length} pending
            </span>
          </div>
        )}
      </div>

      {collapsed ? (
        /* Collapsed: icon strip */
        <div className="flex flex-col items-center gap-1 py-3 overflow-y-auto">
          {pending.map((t) => (
            <div
              key={t.id}
              title={t.title}
              className="w-6 h-1 rounded-sm"
              style={{
                background: PRIORITY_COLORS[t.priority] ?? PRIORITY_COLORS[3],
                opacity: 0.7,
              }}
            />
          ))}
          {pending.length > 0 && (
            <span className="mt-2 text-[10px] text-slate-500 font-bold [writing-mode:vertical-lr] tracking-wide">
              {pending.length}
            </span>
          )}
        </div>
      ) : (
        /* Expanded content */
        <div className="flex-1 overflow-y-auto p-3">
          {/* Add task input */}
          <div className="flex gap-1.5 mb-4">
            <input
              ref={inputRef}
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="Add a task..."
              className="flex-1 bg-white/[0.04] border border-[#1e1e2e] rounded-lg px-2.5 py-[7px] text-xs text-slate-200 outline-none transition-colors duration-150 placeholder:text-slate-600 focus:border-indigo-600"
            />
            <button
              onClick={addTask}
              className="bg-gradient-to-br from-indigo-700 to-indigo-500 border-none rounded-lg text-white px-2.5 text-[11px] font-bold cursor-pointer tracking-wide"
            >
              Add
            </button>
          </div>

          {/* Pending tasks */}
          <div className="mb-2">
            {pending.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={toggleDone}
                onRemove={removeTask}
                onClick={() => setSelected(task)}
              />
            ))}
          </div>

          {/* Completed section */}
          {done.length > 0 && (
            <div>
              <button
                onClick={() => setCompletedOpen((v) => !v)}
                className="bg-transparent border-none text-slate-600 text-[10px] font-bold tracking-widest cursor-pointer flex items-center gap-1 py-1 mb-1 uppercase"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className={`transition-transform duration-150 ${completedOpen ? "rotate-90" : "rotate-0"}`}
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                Completed &middot; {done.length}
              </button>
              {completedOpen &&
                done.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggle={toggleDone}
                    onRemove={removeTask}
                    onClick={() => setSelected(task)}
                  />
                ))}
            </div>
          )}
        </div>
      )}

      {selected && (
        <DetailModal
          todo={selected}
          groups={groups}
          onClose={() => setSelected(null)}
          onSave={saveTodo}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
