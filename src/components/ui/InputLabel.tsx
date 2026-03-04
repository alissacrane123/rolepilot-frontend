export default function InputLabel({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <label
      className={`text-[10px] font-medium text-white/35 uppercase tracking-widest ${className}`}
    >
      {label}
    </label>
  );
}
