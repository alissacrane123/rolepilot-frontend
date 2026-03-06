import { Input } from "../ui/input";
import InputLabel from "../common/InputLabel";
import { Textarea } from "../ui/textarea";

export default function InputField({
  label,
  value,
  onChange,
  type = "text",
  mono = false,
  disabled = false,
  placeholder = "",
  className = "",
  isTextarea = false,
  children,
}: {
  label?: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
  mono?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  isTextarea?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <InputLabel label={label} />}
      {isTextarea && !children && (
        <Textarea
          className={`font-normal bg-white/[0.04] border-[#1e1e2e] ${disabled ? "text-white/35" : "text-slate-200"} input-field ${mono ? "input-mono" : ""}`}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
        />
      )}
      {!isTextarea && !children && (
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={`font-normal bg-white/[0.04] border-[#1e1e2e] ${disabled ? "text-white/35" : "text-slate-200"} input-field ${mono ? "input-mono" : ""}`}
          disabled={disabled}
          placeholder={placeholder}
        />
      )}
      {children}
    </div>
  );
}
