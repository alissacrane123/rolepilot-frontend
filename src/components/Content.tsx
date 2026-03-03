import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export default function Content({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("max-w-5xl mx-auto p-6 space-y-6 w-full", className)}>
      {children}
    </div>
  );
}
