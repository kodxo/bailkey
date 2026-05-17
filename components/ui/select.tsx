import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: { label: string; value: string | number }[];
  wrapperClassName?: string;
  label?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, wrapperClassName, label, children, ...props }, ref) => {
    const selectElement = (
      <select
        ref={ref}
        className={cn(
          "border-none bg-transparent text-body-md font-body-md text-on-surface py-0 pl-0 pr-lg focus:ring-0 focus:border-none cursor-pointer focus:outline-hidden",
          className
        )}
        {...props}
      >
        {options
          ? options.map((opt) => (
              <option key={String(opt.value)} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
    );

    if (label) {
      return (
        <div
          className={cn(
            "flex items-center px-sm py-sm bg-surface-container-lowest",
            wrapperClassName
          )}
        >
          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase mr-xs shrink-0 select-none">
            {label}
          </span>
          {selectElement}
        </div>
      );
    }

    return (
      <div
        className={cn(
          "inline-flex items-center px-sm py-sm bg-surface-container-lowest",
          wrapperClassName
        )}
      >
        {selectElement}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
