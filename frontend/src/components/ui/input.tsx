import * as React from "react"

import { cn } from "../../lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-sm transition-[border-color,box-shadow] outline-none",
        "bg-[var(--bg-elevated)] border-[rgba(255,255,255,0.1)] text-[var(--text-primary)]",
        "placeholder:text-[var(--text-disabled)]",
        "focus-visible:border-[var(--accent-green)] focus-visible:ring-2 focus-visible:ring-[var(--accent-green)]/15",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
        "file:text-[var(--text-primary)] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      {...props}
    />
  )
}

export { Input }
