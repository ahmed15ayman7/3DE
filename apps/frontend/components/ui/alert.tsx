import * as React from "react"
import { LazyMotion, domAnimation, m } from 'framer-motion'
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success: "border-green-200 bg-green-50 text-green-800 [&>svg]:text-green-600",
        warning: "border-yellow-200 bg-yellow-50 text-yellow-800 [&>svg]:text-yellow-600",
        info: "border-blue-200 bg-blue-50 text-blue-800 [&>svg]:text-blue-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, children, ...props }, ref) => {
  const icons = {
    default: null,
    destructive: <XCircle className="h-4 w-4" />,
    success: <CheckCircle className="h-4 w-4" />,
    warning: <AlertCircle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <div
          ref={ref}
          role="alert"
          className={cn(alertVariants({ variant }), className)}
          {...props}
        >
          {icons[variant || "default"]}
          {children}
        </div>
      </m.div>
    </LazyMotion>
  )
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription } 