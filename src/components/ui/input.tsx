
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          // Prevent iOS zoom with consistent 16px font size
          "text-base",
          // Enhanced mobile touch targets
          "min-h-[44px] sm:min-h-[40px]",
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
  }
)
Input.displayName = "Input"

export { Input }
