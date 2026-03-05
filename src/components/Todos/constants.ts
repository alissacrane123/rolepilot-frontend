export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const PRIORITY_META: Record<number, { label: string; dot: string; ring: string; pill_bg: string; pill_text: string }> = {
  1: { label: "Urgent", dot: "bg-fuchsia-400", ring: "border-fuchsia-400/40", pill_bg: "bg-fuchsia-400/10", pill_text: "text-fuchsia-400" },
  2: { label: "High",   dot: "bg-red-400",     ring: "border-red-400/40",     pill_bg: "bg-red-400/10",     pill_text: "text-red-400"     },
  3: { label: "Medium", dot: "bg-yellow-400",  ring: "border-yellow-400/40",  pill_bg: "bg-yellow-400/10",  pill_text: "text-yellow-400"  },
  4: { label: "Low",    dot: "bg-green-400",   ring: "border-green-400/40",   pill_bg: "bg-green-400/10",   pill_text: "text-green-400"   },
};

export type PriorityMeta = typeof PRIORITY_META[number];
