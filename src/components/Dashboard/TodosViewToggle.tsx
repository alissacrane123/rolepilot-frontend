export default function TodosViewToggle({
  view,
  onChange,
  filter1 = "Day",
  filter2 = "Groups",
  filter3 = "All",
}: {
  view: "Groups" | "All" | "Day";
  onChange: (v: "Groups" | "All" | "Day") => void;
  filter1?: string;
  filter2?: string;
  filter3?: string;
}) {
  return (
    <div className="cursor-pointer flex bg-white/[0.04] rounded-lg p-0.5 border border-white/[0.06] text-xs">
      <button
        onClick={() => onChange("Day")}
        className={`cursor-pointer flex items-center px-2.5 py-1.5 rounded-md transition-all duration-200 ${
          view === "Day" ? "text-white bg-white/[0.08]" : "text-white/30"
        }`}
      >
        {filter1}
      </button>
      <button
        onClick={() => onChange("Groups")}
        className={`cursor-pointer flex items-center px-2.5 py-1.5 rounded-md transition-all duration-200 ${
          view === "Groups" ? "text-white bg-white/[0.08]" : "text-white/30"
        }`}
      >
        {filter2}
      </button>
      <button
        onClick={() => onChange("All")}
        className={`cursor-pointer flex items-center px-2.5 py-1.5 rounded-md transition-all duration-200 ${
          view === "All" ? "text-white bg-white/[0.08]" : "text-white/30"
        }`}
      >
        {filter3}
      </button>
    </div>
  );
}
