import { BoardViewIcon, ListViewIcon } from "@/components/icons";

export default function ViewToggle({
  view,
  onChange,
  icon1 = <BoardViewIcon />,
  icon2 = <ListViewIcon />,
}: {
  view: 'start' | 'end';
  onChange: (v: 'start' | 'end') => void;
  icon1?: React.ReactNode;
  icon2?: React.ReactNode;
}) {
  return (
    <div className="cursor-pointer flex bg-white/[0.04] rounded-lg p-0.5 border border-white/[0.15]">
      <button
        onClick={() => onChange("start")}
        className={`cursor-pointer flex items-center px-2.5 py-1.5 rounded-md transition-all duration-100 ${
          view === "start" ? "text-white bg-white/[0.08]" : "text-white/30"
        }`}
      >
        {icon1}
      </button>
      <button
        onClick={() => onChange("end")}
        className={`cursor-pointer flex items-center px-2.5 py-1.5 rounded-md transition-all duration-100 ${
          view === "end" ? "text-white bg-white/[0.08]" : "text-white/30"
        }`}
      >
        {icon2}
      </button>
    </div>
  );
}
