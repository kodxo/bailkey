import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  iconName?: string;
  wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, iconName, wrapperClassName, ...props }, ref) => {
    const wrapperStyle = cn(
      "group flex items-center bg-surface border border-outline-variant hover:border-primary/60 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors overflow-hidden px-4 h-14 w-full",
      wrapperClassName
    );

    const inputElement = (
      <input
        type={type}
        className={cn(
          "w-full bg-transparent border-none focus:ring-0 text-body-md font-medium text-on-surface placeholder:text-on-surface-variant/50 p-0 focus:outline-hidden",
          className
        )}
        ref={ref}
        {...props}
      />
    );

    if (iconName) {
      return (
        <div className={wrapperStyle}>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary group-focus-within:text-primary mr-2.5 text-xl shrink-0 select-none transition-colors duration-200">
            {iconName}
          </span>
          {inputElement}
        </div>
      );
    }

    return (
      <div className={wrapperStyle}>
        {inputElement}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
