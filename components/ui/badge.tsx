import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-[6px] px-2 py-1 text-[10px] font-label-caps uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-on-primary",
        secondary: "bg-secondary-container text-on-secondary-container border border-outline-variant",
        surface: "bg-surface-variant text-on-surface-variant border border-outline/30",
        destructive: "bg-error-container text-on-error-container",
        outline: "border border-outline-variant text-on-surface bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean | string;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, dot, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "w-[4px] h-[4px] rounded-full shrink-0",
              typeof dot === "string"
                ? dot
                : variant === "default"
                ? "bg-white"
                : variant === "destructive"
                ? "bg-error"
                : "bg-outline-variant"
            )}
          />
        )}
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
