import { cn } from "@/lib/utils";

export function TextHeadline({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-xs font-semibold text-white/60 uppercase tracking-wider flex-1",
        className,
      )}
    >
      {children}
    </span>
  );
}
