import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: { label: string; value: string | number }[];
  wrapperClassName?: string;
  label?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, wrapperClassName, label, children, ...props }, ref) => {
    const selectElement = (
      <div className="relative flex-1 flex items-center w-full">
        <select
          ref={ref}
          className={cn(
            "w-full appearance-none bg-transparent text-body-md font-medium text-on-surface py-2 pl-3 pr-10 border-none focus:ring-0 focus:outline-hidden cursor-pointer h-10",
            className
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={String(opt.value)} value={opt.value} className="bg-surface text-on-surface py-2 font-medium">
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <span className="absolute right-3 pointer-events-none text-on-surface-variant flex items-center justify-center transition-transform duration-200 group-hover:text-primary group-hover:translate-y-0.5">
          <span className="material-symbols-outlined text-xl select-none" data-icon="expand_more">
            expand_more
          </span>
        </span>
      </div>
    );

    const wrapperStyle = cn(
      "group flex items-center bg-surface-container-lowest border border-outline-variant/60 hover:border-primary/60 focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/15 rounded-xl transition-all shadow-2xs overflow-hidden min-w-[160px]",
      wrapperClassName
    );

    if (label) {
      return (
        <div className={wrapperStyle}>
          <span className="text-label-caps font-bold text-on-surface-variant uppercase ml-3 shrink-0 select-none tracking-wide">
            {label}
          </span>
          {selectElement}
        </div>
      );
    }

    return <div className={wrapperStyle}>{selectElement}</div>;
  }
);
Select.displayName = "Select";

export { Select };
