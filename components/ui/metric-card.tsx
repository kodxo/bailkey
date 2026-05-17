import * as React from "react";
import { cn } from "@/lib/utils";

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: React.ReactNode;
  label: string;
  valueClassName?: string;
  labelClassName?: string;
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  (
    { className, value, label, valueClassName, labelClassName, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface-container-low border border-outline-variant/30 px-md py-sm flex flex-col items-center min-w-[120px] shrink-0 shadow-sm",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "text-h1 font-h1 text-primary leading-none font-bold",
            valueClassName
          )}
        >
          {value}
        </span>
        <span
          className={cn(
            "text-[10px] font-label-caps text-on-surface-variant uppercase mt-xs tracking-widest text-center",
            labelClassName
          )}
        >
          {label}
        </span>
      </div>
    );
  }
);
MetricCard.displayName = "MetricCard";

export { MetricCard };
