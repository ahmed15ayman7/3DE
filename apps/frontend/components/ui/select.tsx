import * as React from "react"
import { LazyMotion, domAnimation, m } from 'framer-motion'
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: boolean
  helperText?: string
  options: Array<{ value: string; label: string }>
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, ...props }, ref) => {
    return (
      <LazyMotion features={domAnimation}>
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <div className="relative">
            {label && (
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {props.required && <span className="text-red-500 mr-1">*</span>}
              </label>
            )}
            <div className="relative">
              <select
                ref={ref}
                className={cn(
                  "w-full px-4 py-3 border rounded-lg transition-colors duration-200 appearance-none",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                  "bg-white cursor-pointer",
                  error 
                    ? "border-red-500 bg-red-50" 
                    : "border-gray-300 hover:border-gray-400 focus:border-primary",
                  props.disabled && "bg-gray-100 cursor-not-allowed",
                  className
                )}
                {...props}
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none h-4 w-4" />
            </div>
            {error && helperText && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <span className="mr-1">⚠</span>
                {helperText}
              </p>
            )}
          </div>
        </m.div>
      </LazyMotion>
    )
  }
)

Select.displayName = "Select"

export { Select } 