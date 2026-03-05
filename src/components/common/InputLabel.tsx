export default function InputLabel({
  label,
  className,
  children
}: {
  label: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <label
      className={`text-[10px] font-medium text-white/35 uppercase  ${className}`}
    >
      {label}
      {children}
    </label>
  );
}
