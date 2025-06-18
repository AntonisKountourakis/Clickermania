import * as React from "react"

import { cn } from "@/lib/utils"

const Alert = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={cn("relative w-full rounded-lg border p-4", className)} role="alert" ref={ref} {...props}>
        {children}
      </div>
    )
  },
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <h5 className={cn("mb-1 font-semibold leading-tight tracking-tight", className)} {...props} ref={ref}>
        {children}
      </h5>
    )
  },
)
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={cn("text-sm opacity-70", className)} {...props} ref={ref}>
        {children}
      </div>
    )
  },
)
AlertDescription.displayName = "AlertDescription"

import { AlertCircle } from "lucide-react"

export { Alert, AlertTitle, AlertDescription, AlertCircle }
