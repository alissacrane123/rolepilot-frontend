import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export default function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-screen bg-zinc-950 w-full flex flex-col", className)}>
      {children}
    </div>
  );
}
