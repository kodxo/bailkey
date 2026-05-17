import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  iconName?: string;
  wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, iconName, wrapperClassName, ...props }, ref) => {
    if (iconName) {
      return (
        <div
          className={cn(
            "flex items-center px-sm py-xs bg-surface-container-lowest border border-outline-variant focus-within:border-primary transition-colors duration-200",
            wrapperClassName
          )}
        >
          <span className="material-symbols-outlined text-outline mr-xs shrink-0 select-none">
            {iconName}
          </span>
          <input
            type={type}
            className={cn(
              "w-full bg-transparent border-none focus:ring-0 text-body-md font-body-md text-on-surface placeholder:text-outline p-0 focus:outline-hidden",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          "flex w-full px-sm py-xs bg-surface-container-lowest border border-outline-variant text-body-md font-body-md text-on-surface placeholder:text-outline focus:outline-hidden focus:border-primary transition-colors duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
