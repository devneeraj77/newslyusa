"use client"

import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  variant?: "default" | "destructive" | "success"
  [key: string]: any
}

export function useToast() {
  return {
    toast: ({ title, description, variant, action, ...props }: ToastProps) => {
      const toastFn = variant === "destructive" 
        ? sonnerToast.error 
        : variant === "success" 
          ? sonnerToast.success 
          : sonnerToast

      return toastFn(title, {
        description,
        action,
        ...props,
      })
    },
    dismiss: (id?: string | number) => sonnerToast.dismiss(id),
  }
}
