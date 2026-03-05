import { useState, useRef, useEffect } from "react";
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
import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react";

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

  // Animate content crossfade: `showExpanded` trails `collapsed` so both
  // panels can overlap during the transition.
  const [showExpanded, setShowExpanded] = useState(!collapsed);
  useEffect(() => {
    if (collapsed) {
      // Fade out expanded content immediately -- the CSS opacity transition
      // handles the visual, and we unmount after it completes.
      const timer = setTimeout(() => setShowExpanded(false), 200);
      return () => clearTimeout(timer);
    }
    // When expanding, mount expanded content right away so it can fade in
    setShowExpanded(true);
  }, [collapsed]);

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
        className={`group bg-[#0d0d14] border border-[#1e1e2e] rounded-full text-slate-500 cursor-pointer p-1.5 px-1.5 flex items-center justify-center transition-all duration-150 shrink-0 hover:border-indigo-400/40  ${
          collapsed ? "ml-0  right-[6px] border-none" : "ml-auto right-[-14px]"
        } absolute  top-[14px] z-22`}
      >
        {collapsed ? (
          <ChevronRightIcon
            width="14"
            height="14"
            className="text-slate-500 group-hover:text-indigo-400"
          />
        ) : (
          <ChevronLeftIcon
            width="14"
            height="14"
            className="text-slate-500 group-hover:text-indigo-400"
          />
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
        <div
          className={`flex items-center gap-2 transition-all duration-200 whitespace-nowrap overflow-hidden ${
            collapsed
              ? "opacity-0 max-w-0 -translate-x-2"
              : "opacity-100 max-w-[200px] translate-x-0 delay-100"
          }`}
        >
          <span className="text-[13px] font-bold text-slate-100 tracking-tight">
            Tasks
          </span>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 py-px rounded-[10px] font-semibold">
            {pending.length} pending
          </span>
        </div>
      </div>

      {/* Content area -- both panels stack absolutely so they cross-fade */}
      <div className="flex-1 relative min-h-0 overflow-hidden">
        {/* Collapsed: icon strip */}
        <div
          className={`absolute inset-0 flex flex-col items-center gap-1 py-3 overflow-y-auto transition-all duration-200 ease-in-out ${
            collapsed
              ? "opacity-100 translate-x-0 delay-100"
              : "opacity-0 -translate-x-2 pointer-events-none"
          }`}
        >
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

        {/* Expanded content */}
        {showExpanded && (
          <div
            className={`absolute inset-0 overflow-y-auto p-3 transition-all duration-200 ease-in-out ${
              collapsed
                ? "opacity-0 translate-x-4 pointer-events-none"
                : "opacity-100 translate-x-0 delay-75"
            }`}
          >
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
      </div>

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
