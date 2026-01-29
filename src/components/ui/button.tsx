import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]",
  {
    variants: {
      variant: {
        // 30% - The standard high-contrast button
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        
        // 10% - The "Call to Action" / Highlight button
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-md",
        
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive",
        
        // Compact/Clean look using the border color
        outline: "border-1 border-primary/20 bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
        
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        
        ghost: "text-primary hover:bg-primary/10 hover:text-primary",
        
        link: "text-accent underline-offset-4 hover:underline font-bold",
      },
      size: {
        default: "h-10 px-5 py-2",
        xs: "h-7 gap-1 rounded-md px-2.5 text-xs",
        sm: "h-9 rounded-md px-4",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "size-10",
        "icon-xs": "size-7 rounded-md",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }