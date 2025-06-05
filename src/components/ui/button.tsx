import * as React from "react"
import { cn } from "../../lib/utils";


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'   // <-- add 'icon' here
}


const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'default':
          return 'bg-blue-600 text-white hover:bg-blue-700';
        case 'outline':
          return 'border border-gray-600 bg-transparent hover:bg-gray-700';
        case 'ghost':
          return 'hover:bg-gray-700';
        default:
          return 'bg-blue-600 text-white hover:bg-blue-700';
      }
    };

    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return 'h-9 px-3 text-sm';
        case 'lg':
          return 'h-11 px-8';
        case 'icon':
          return 'h-12 w-12 p-0 flex items-center justify-center';
        case 'default':
        default:
          return 'h-10 py-2 px-4';
      }
    };

    
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none",
          getVariantStyles(),
          getSizeStyles(),
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
