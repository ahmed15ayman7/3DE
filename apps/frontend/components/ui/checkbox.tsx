import * as React from "react"
import { LazyMotion, domAnimation, m } from 'framer-motion'
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: boolean
  helperText?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
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
          <div className="flex items-start space-x-3">
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
                "w-5 h-5 border-2 rounded transition-colors duration-200 flex items-center justify-center",
                "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
                error 
                  ? "border-red-500 bg-red-50" 
                  : "border-gray-300 hover:border-gray-400",
                props.checked && "bg-primary border-primary",
                props.disabled && "bg-gray-100 cursor-not-allowed"
              )}>
                {props.checked && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
            </div>
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
          </div>
        </m.div>
      </LazyMotion>
    )
  }
)

Checkbox.displayName = "Checkbox"

export { Checkbox } 