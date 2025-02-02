import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        secondaryGold:
          "border-transparent bg-[#FFD700] text-[#8B4513] hover:bg-[#FFD700]/90",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        purple: "text-base bg-purple-100 text-purple-600",
        green: "text-base bg-green-100 text-green-600",
        blue: "text-base bg-blue-100 text-blue-600",
        yellow: "text-base bg-yellow-100 text-yellow-600",
        red: "text-base bg-red-100 text-red-600",
        orange: "text-base bg-orange-100 text-orange-600",
        cyan: "text-base bg-cyan-100 text-cyan-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
