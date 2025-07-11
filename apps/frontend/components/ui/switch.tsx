import * as React from "react"
import { LazyMotion, domAnimation, m } from 'framer-motion'
import { cn } from "@/lib/utils"

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: boolean
  helperText?: string
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <LazyMotion features={domAnimation}>
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <div className="flex items-center justify-between">
            {label && (
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 cursor-pointer">
                  {label}
                  {props.required && <span className="text-red-500 mr-1">*</span>}
                </label>
                {error && helperText && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span>
                    {helperText}
                  </p>
                )}
              </div>
            )}
            <div className="relative">
              <input
                ref={ref}
                type="checkbox"
                className={cn(
                  "sr-only",
                  className
                )}
                {...props}
              />
              <div className={cn(
                "w-11 h-6 rounded-full transition-colors duration-200 relative cursor-pointer",
                "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
                error 
                  ? "bg-red-200" 
                  : props.checked 
                    ? "bg-primary" 
                    : "bg-gray-300",
                props.disabled && "cursor-not-allowed opacity-50"
              )}>
                <div className={cn(
                  "w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 absolute top-0.5",
                  props.checked ? "translate-x-5" : "translate-x-0.5"
                )} />
              </div>
            </div>
          </div>
        </m.div>
      </LazyMotion>
    )
  }
)

Switch.displayName = "Switch"

export { Switch } 