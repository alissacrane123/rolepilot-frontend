import { cn } from "@/lib/utils";

export function TextTitle2({ children, className }: { children: React.ReactNode, className?: string }) {   return (
    <h2 className={cn("text-lg font-bold text-slate-100 tracking-tight", className)}>
      {children}
    </h2>
  );
}