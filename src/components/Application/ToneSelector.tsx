import { COVER_LETTER_TONES } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ToneSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ToneSelector({ value, onChange, className }: ToneSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={`bg-white/[0.04] border-[#1e1e2e] text-slate-200 ${className ?? ""}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-[#0f0f1a] border-[#1e1e2e]">
        {COVER_LETTER_TONES.map((t) => (
          <SelectItem
            key={t.value}
            value={t.value}
            className="text-slate-200"
          >
            {t.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
