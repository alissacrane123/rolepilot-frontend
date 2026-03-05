import { useState } from "react";

export default function QuickAdd({ onAdd }: { onAdd: (title: string) => void }) {
  const [val, setVal] = useState("");
  const submit = () => { const t = val.trim(); if (!t) return; onAdd(t); setVal(""); };

  return (
    <div className="flex gap-2">
      <input value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()}
        placeholder="Add a task..."
        className="flex-1 bg-zinc-950 border border-zinc-800/80 rounded-xl px-3.5 py-2.5 text-sm text-zinc-300 outline-none focus:border-indigo-500/30 transition-colors placeholder:text-zinc-700" />
      <button onClick={submit}
        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${val.trim() ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg" : "bg-zinc-900 text-zinc-700 cursor-default"}`}>
        Add
      </button>
    </div>
  );
}
