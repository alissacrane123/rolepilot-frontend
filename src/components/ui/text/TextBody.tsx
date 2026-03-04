import { cn } from "@/lib/utils";

export function TextBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("text-[13px] text-white/35", className)}>
      {children}
    </span>
  );
}
