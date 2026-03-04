import { cn } from "@/lib/utils";

export function TextLabel1({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("text-[11px] font-medium text-white/30", className)}>
      {children}
    </span>
  );
}
