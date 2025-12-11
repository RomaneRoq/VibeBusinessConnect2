import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground shadow-sm shadow-secondary/20 hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow-sm shadow-destructive/20 hover:bg-destructive/90",
        success: "border-transparent bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 hover:bg-emerald-600",
        warning: "border-transparent bg-amber-500 text-white shadow-sm shadow-amber-500/20 hover:bg-amber-600",
        outline: "text-foreground border-2",
        ghost: "border-transparent bg-muted text-muted-foreground hover:bg-muted/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
