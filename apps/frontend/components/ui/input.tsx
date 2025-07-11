import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  helperText?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  clearable?: boolean
  onClear?: () => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, helperText, startIcon, endIcon, clearable, onClear, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {startIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              startIcon && "pl-10",
              (endIcon || clearable) && "pr-10",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            ref={ref}
            {...props}
          />
          {(endIcon || clearable) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              {endIcon && <span className="text-gray-500">{endIcon}</span>}
              {clearable && props.value && (
                <button
                  type="button"
                  onClick={onClear}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
        {helperText && (
          <p
            className={cn(
              "mt-1 text-xs",
              error ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input } 