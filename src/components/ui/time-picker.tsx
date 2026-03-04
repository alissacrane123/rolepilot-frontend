import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);
const DEFAULT_TIME = "09:00";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

/**
 * Converts a 24h "HH:MM" string to { hour12, minute, period }.
 */
function parse24(value: string) {
  const [hStr, mStr] = value.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const period: "AM" | "PM" = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return { hour12: h, minute: m, period };
}

/**
 * Converts { hour12, minute, period } back to 24h "HH:MM".
 */
function to24(hour12: number, minute: number, period: "AM" | "PM") {
  let h = hour12;
  if (period === "AM" && h === 12) h = 0;
  else if (period === "PM" && h !== 12) h += 12;
  return `${pad(h)}:${pad(minute)}`;
}

export default function TimePicker({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const parsed = value ? parse24(value) : parse24(DEFAULT_TIME);

  useEffect(() => {
    if (!value) {
      onChange(DEFAULT_TIME);
    }
  }, []);

  const handleHourChange = (h: string) => {
    onChange(to24(parseInt(h, 10), parsed.minute, parsed.period));
  };

  const handleMinuteChange = (m: string) => {
    onChange(to24(parsed.hour12, parseInt(m, 10), parsed.period));
  };

  const handlePeriodChange = (p: string) => {
    onChange(to24(parsed.hour12, parsed.minute, p as "AM" | "PM"));
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Select value={String(parsed.hour12)} onValueChange={handleHourChange}>
        <SelectTrigger className="w-[70px] bg-zinc-800 border-zinc-700 text-zinc-100">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-zinc-700 max-h-[200px]">
          {HOURS.map((h) => (
            <SelectItem key={h} value={String(h)} className="text-zinc-100">
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="text-zinc-500 text-sm font-medium">:</span>

      <Select value={String(parsed.minute)} onValueChange={handleMinuteChange}>
        <SelectTrigger className="w-[70px] bg-zinc-800 border-zinc-700 text-zinc-100">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-zinc-700 max-h-[200px]">
          {MINUTES.map((m) => (
            <SelectItem key={m} value={String(m)} className="text-zinc-100">
              {pad(m)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={parsed.period} onValueChange={handlePeriodChange}>
        <SelectTrigger className="w-[72px] bg-zinc-800 border-zinc-700 text-zinc-100 ml-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-zinc-700">
          <SelectItem value="AM" className="text-zinc-100">AM</SelectItem>
          <SelectItem value="PM" className="text-zinc-100">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
