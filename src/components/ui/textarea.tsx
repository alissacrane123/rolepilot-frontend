import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "max-h-10 flex field-sizing-content min-h-16 w-full rounded-md border border-input",
        "bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none",
        "placeholder:text-muted-foreground  disabled:cursor-not-allowed",
        "disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
        "w-full bg-white/[0.04] border border-[#1e1e2e] rounded-lg px-3 py-2.5 text-xs text-slate-200 outline-none",
        "focus:border-indigo-500/40 transition-colors resize-none leading-relaxed placeholder:text-white/20",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
