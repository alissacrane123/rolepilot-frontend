import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  disabled = false,
  type,
  ...props
}: React.ComponentProps<"input"> & { disabled?: boolean }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
        "focus:border-indigo-500/40  [color-scheme:dark]",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        `text-xs font-normal bg-white/[0.04] border-[#1e1e2e] ${disabled ? "text-white/35" : "text-slate-200"} input-field`,
        className,
      )}
      disabled={disabled}
      {...props}
    />
  );
}

export { Input };
