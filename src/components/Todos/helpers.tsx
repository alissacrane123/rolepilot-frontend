import { DAYS } from "./constants";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-mono font-semibold tracking-widest uppercase text-zinc-600 mb-2">{children}</p>;
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button type="button" onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full border transition-all flex-shrink-0 ${checked ? "bg-indigo-500 border-indigo-500" : "bg-zinc-900 border-zinc-700"}`}>
        <span className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all ${checked ? "left-[18px] bg-white" : "left-0.5 bg-zinc-600"}`} />
      </button>
      <span className="text-sm text-zinc-500">{label}</span>
    </label>
  );
}

export function PillTag({ children, active, onClick, meta }: { children: React.ReactNode; active: boolean; onClick: () => void; meta: { dot: string; ring: string; pill_bg: string; pill_text: string } }) {
  return (
    <button onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-mono font-medium border transition-all whitespace-nowrap ${
        active && meta
          ? `${meta.ring} ${meta.pill_bg} ${meta.pill_text}`
          : active
          ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-300"
          : "border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400"
      }`}>
      {children}
    </button>
  );
}

export function DayPicker({ selected, onChange }: { selected: string[]; onChange: (selected: string[]) => void }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {DAYS.map(d => {
        const on = selected.includes(d);
        return (
          <button key={d} onClick={() => onChange(on ? selected.filter(x => x !== d) : [...selected, d])}
            className={`w-9 h-9 rounded-lg text-[11px] font-mono font-semibold border transition-all ${on ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-300" : "border-zinc-800 bg-zinc-950 text-zinc-600 hover:border-zinc-700"}`}>
            {d}
          </button>
        );
      })}
    </div>
  );
}
