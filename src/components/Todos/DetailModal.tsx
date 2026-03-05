import { useState } from "react";
import type { Todo, CreateTodoData } from "@/lib/types/todos";
import { PRIORITY_META } from "./constants";
import { SectionLabel, Toggle, PillTag } from "./helpers";

export default function DetailModal({ todo, groups, onClose, onSave, onDelete }: {
  todo: Todo;
  groups: { id: string; name: string; color: string }[];
  onClose: () => void;
  onSave: (id: string, data: Partial<CreateTodoData>) => void;
  onDelete: (id: string) => void;
}) {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description ?? "");
  const [dueDate, setDueDate] = useState(todo.due_date ?? "");
  const [dueTime, setDueTime] = useState(todo.due_time ?? "");
  const [priority, setPriority] = useState(todo.priority);
  const [groupId, setGroupId] = useState(todo.group_id ?? "");
  const [isRecurring, setIsRecurring] = useState(todo.is_recurring);

  const handleSave = () => {
    onSave(todo.id, {
      title,
      description: description || undefined,
      due_date: dueDate || undefined,
      due_time: dueTime || undefined,
      priority,
      group_id: groupId || undefined,
      is_recurring: isRecurring,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative w-[500px] max-h-[88vh] overflow-y-auto bg-[#13131c] border border-zinc-800 rounded-2xl p-7 shadow-2xl z-10">

        {/* header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <p className="text-[10px] font-mono font-semibold tracking-widest uppercase text-zinc-700 mb-1">Task Details</p>
            {todo.company_name && <p className="text-[11px] font-mono text-indigo-400/40">{todo.company_name} · {todo.role_title}</p>}
          </div>
          <div className="flex gap-2">
            <button onClick={() => { onDelete(todo.id); onClose(); }}
              className="px-3 py-1 rounded-lg border border-red-900/50 bg-red-950/40 text-red-400 text-xs font-mono hover:bg-red-900/30 transition-colors">
              Delete
            </button>
            <button onClick={onClose}
              className="w-7 h-7 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-500 hover:text-zinc-300 transition-colors text-lg leading-none flex items-center justify-center">
              ×
            </button>
          </div>
        </div>

        {/* title */}
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Task title"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-3 text-[15px] font-semibold text-zinc-100 outline-none focus:border-indigo-500/40 transition-colors mb-2.5 placeholder:text-zinc-700" />

        {/* description */}
        <textarea value={description} onChange={e => setDescription(e.target.value)}
          placeholder="Add a description... (optional)" rows={2}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-400 outline-none focus:border-indigo-500/40 transition-colors resize-none leading-relaxed mb-5 placeholder:text-zinc-700" />

        <div className="h-px bg-zinc-900 mb-5" />

        {/* date + time */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <SectionLabel>Due Date</SectionLabel>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm font-mono text-zinc-300 outline-none [color-scheme:dark]" />
          </div>
          <div>
            <SectionLabel>Time</SectionLabel>
            <input type="time" value={dueTime} onChange={e => setDueTime(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm font-mono text-zinc-300 outline-none [color-scheme:dark]" />
          </div>
        </div>

        {/* priority */}
        <div className="mb-5">
          <SectionLabel>Priority</SectionLabel>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(PRIORITY_META).map(([value, m]) => (
              <PillTag key={value} active={priority === Number(value)} onClick={() => setPriority(Number(value))} meta={m}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${m.dot} mr-1.5 align-middle`} />{m.label}
              </PillTag>
            ))}
          </div>
        </div>

        {/* group */}
        <div className="mb-5">
          <SectionLabel>Group</SectionLabel>
          <div className="flex gap-2 flex-wrap">
            <PillTag meta={{ dot: "", ring: "", pill_bg: "", pill_text: "" }} active={!groupId} onClick={() => setGroupId("")}>None</PillTag>
            {groups.map(g => (
              <PillTag meta={{ dot: "", ring: "", pill_bg: "", pill_text: "" }} key={g.id} active={groupId === g.id} onClick={() => setGroupId(g.id)}>
                <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle" style={{ backgroundColor: g.color }} />
                {g.name}
              </PillTag>
            ))}
          </div>
        </div>

        {/* linked app */}
        {/* <div className="mb-5">
          <SectionLabel>Link to Application <span className="text-zinc-800 normal-case font-normal">— optional</span></SectionLabel>
          <div className="flex flex-col gap-1.5">
            {APPLICATIONS.map(app => {
              const active = t.application_id === app.id.toString();
              return (
                <button key={app.id} onClick={() => set("application_id", active ? null : app.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left transition-all ${active ? "border-indigo-500/30 bg-indigo-500/5" : "border-zinc-900 bg-zinc-950 hover:border-zinc-800"}`}>
                  <div className={`w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[11px] font-mono font-bold ${active ? "text-indigo-400" : "text-zinc-600"}`}>
                    {app.company[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${active ? "text-zinc-300" : "text-zinc-500"}`}>{app.company}</p>
                    <p className="text-[11px] font-mono text-zinc-700 truncate">{app.role}</p>
                  </div>
                  {active && <span className="text-indigo-400 text-sm">✓</span>}
                </button>
              );
            })}
          </div>
        </div> */}

        <div className="h-px bg-zinc-900 mb-5" />

        {/* toggles */}
        <div className="flex flex-col gap-3.5 mb-5">
          {/* <Toggle checked={t.is_reminder} onChange={v => set("is_reminder", v)} label="Reminder — only show on due date" />
          <Toggle checked={t.is_carry_over}  onChange={v => set("is_carry_over", v)}  label="Carry over if incomplete" /> */}
          <Toggle checked={isRecurring} onChange={setIsRecurring} label="Recurring" />
        </div>

        {/* {t.is_recurring && (
          <div className="mb-5 p-3.5 rounded-xl bg-zinc-950 border border-zinc-900">
            <SectionLabel>Repeat on</SectionLabel>
            <DayPicker selected={t.recurring_days.map(d => d.day)} onChange={v => set("recurring_days", v.map(d => ({ day: d, is_active: true })))} />
          </div>
        )} */}

        <button onClick={handleSave}
          className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
            title.trim()
              ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg hover:opacity-90"
              : "bg-zinc-900 text-zinc-700 cursor-not-allowed"
          }`}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
