import { cn } from "@/lib/utils";

export default function Grid({
  children,
  className,
  cols = 2,
}: {
  children: React.ReactNode;
  className?: string;
  cols?: number;
}) {
  return (
    <div className={cn(`grid grid-cols-${cols} gap-4`, className)}>
      {children}
    </div>
  );
}
