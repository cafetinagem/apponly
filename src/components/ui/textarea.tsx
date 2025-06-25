
import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        // Prevent iOS zoom with consistent 16px font size
        "text-base",
        // Better mobile touch targets
        "min-h-[100px] sm:min-h-[80px]",
        // Allow vertical resize only
        "resize-y",
        // Smooth transitions
        "transition-all duration-150 ease-in-out",
        // Enhanced focus states
        "focus:border-ring focus:shadow-sm",
        // Better mobile interaction
        "touch-manipulation",
        className
      )}
      style={{
        fontSize: '16px', // Force 16px to prevent zoom on iOS
      }}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
