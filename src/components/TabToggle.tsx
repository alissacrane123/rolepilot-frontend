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
    <div className="flex gap-1 bg-zinc-800 rounded-md p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`flex-1 text-sm py-1.5 rounded transition-colors ${
            value === option.value
              ? "bg-zinc-700 text-zinc-100"
              : "text-zinc-400 hover:text-zinc-300"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
