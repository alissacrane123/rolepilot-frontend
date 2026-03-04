import { Input } from "./input";
import InputLabel from "./InputLabel";

export default function InputField({
  label,
  value,
  onChange,
  type = "text",
  mono = false,
  disabled = false,
  placeholder = "",
  className = "",
}: {
  label?: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
  mono?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <InputLabel label={label} />}
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`font-normal bg-zinc-800/50 border-zinc-700 text-zinc-${disabled ? "500" : "100"} input-field ${mono ? "input-mono" : ""}`}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  );
}
