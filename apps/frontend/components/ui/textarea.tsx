import * as React from "react"
import { LazyMotion, domAnimation, m } from 'framer-motion'
import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: boolean
  helperText?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
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
          <div className="relative">
            {label && (
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {props.required && <span className="text-red-500 mr-1">*</span>}
              </label>
            )}
            <textarea
              ref={ref}
              className={cn(
                "w-full px-4 py-3 border rounded-lg transition-colors duration-200 resize-none",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                "min-h-[120px]",
                error 
                  ? "border-red-500 bg-red-50" 
                  : "border-gray-300 hover:border-gray-400 focus:border-primary",
                props.disabled && "bg-gray-100 cursor-not-allowed",
                className
              )}
              {...props}
            />
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

Textarea.displayName = "Textarea"

export { Textarea } 