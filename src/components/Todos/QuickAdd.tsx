import { useState } from "react";

export default function QuickAdd({
  onAdd,
}: {
  onAdd: (title: string) => void;
}) {
  const [val, setVal] = useState("");
  const submit = () => {
    const t = val.trim();
    if (!t) return;
    onAdd(t);
    setVal("");
  };

  return (
    <div className="flex gap-2 group">
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Add a task..."
        className="flex-1  border border-white/[0.06] rounded-md px-3.5 py-2.5 text-sm text-zinc-100 outline-none focus:border-indigo-500/40 transition-colors placeholder:text-white/20"
      />
      <button
        onClick={submit}
        className={`cursor-pointer group-focus-within:bg-indigo-600 group-focus-within:text-white group-focus-within:hover:bg-indigo-500 px-5 py-2.5 rounded-md text-sm font-semibold transition-all ${val.trim() ? "bg-indigo-600 text-white hover:bg-indigo-500" : "bg-white/[0.04] text-white/20 cursor-default"}`}
      >
        Add
      </button>
    </div>
  );
}
