interface TabToggleProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}

export default function TabToggle<T extends string>({
  value,
  onChange,
  options,
}: TabToggleProps<T>) {
  return (
    <div className="flex gap-1 bg-white/[0.04] rounded-lg p-0.5 border border-[#1e1e2e]">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`flex-1 text-sm py-1.5 rounded transition-all duration-150 ${
            value === option.value
              ? "bg-white/[0.08] text-white"
              : "text-white/30 hover:text-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
