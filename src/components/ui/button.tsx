import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", type = "button", ...props }, ref) => {
    const variantClasses = {
      default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      ghost: "hover:bg-accent hover:text-accent-foreground text-foreground/80 hover:text-foreground",
      outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
    }[variant]

    const sizeClasses = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8",
      icon: "h-9 w-9",
    }[size]

    return (
      <button
        type={type}
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer",
          variantClasses,
          sizeClasses,
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"
