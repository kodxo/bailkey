import * as React from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  separator?: React.ReactNode;
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, ...props }, ref): React.JSX.Element => (
    <nav
      ref={ref}
      aria-label="breadcrumb"
      className={cn("w-full", className)}
      {...props}
    />
  )
);
Breadcrumb.displayName = "Breadcrumb";

export interface BreadcrumbListProps extends React.ComponentPropsWithoutRef<"ol"> {}

const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, ...props }, ref): React.JSX.Element => (
    <ol
      ref={ref}
      className={cn(
        "flex flex-wrap items-center gap-2 text-sm text-on-surface-variant font-body-md",
        className
      )}
      {...props}
    />
  )
);
BreadcrumbList.displayName = "BreadcrumbList";

export interface BreadcrumbItemProps extends React.ComponentPropsWithoutRef<"li"> {}

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, ...props }, ref): React.JSX.Element => (
    <li
      ref={ref}
      className={cn("inline-flex items-center gap-2", className)}
      {...props}
    />
  )
);
BreadcrumbItem.displayName = "BreadcrumbItem";

export interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<"a"> {
  asChild?: boolean;
}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild, className, href, ...props }, ref): React.JSX.Element => {
    const Comp = asChild ? Slot : Link;
    return (
      <Comp
        ref={ref}
        href={href || "#"}
        className={cn("transition-colors hover:text-primary font-medium cursor-pointer", className)}
        {...props}
      />
    );
  }
);
BreadcrumbLink.displayName = "BreadcrumbLink";

export interface BreadcrumbPageProps extends React.ComponentPropsWithoutRef<"span"> {}

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, ...props }, ref): React.JSX.Element => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-semibold text-on-surface", className)}
      {...props}
    />
  )
);
BreadcrumbPage.displayName = "BreadcrumbPage";

export interface BreadcrumbSeparatorProps extends React.ComponentPropsWithoutRef<"li"> {}

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: BreadcrumbSeparatorProps): React.JSX.Element => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("flex items-center text-on-surface-variant/60", className)}
    {...props}
  >
    {children ?? (
      <span className="material-symbols-outlined text-sm">chevron_right</span>
    )}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export interface BreadcrumbEllipsisProps extends React.ComponentPropsWithoutRef<"span"> {}

const BreadcrumbEllipsis = ({
  className,
  ...props
}: BreadcrumbEllipsisProps): React.JSX.Element => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <span className="material-symbols-outlined text-sm">more_horiz</span>
    <span className="sr-only">Plus</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export interface BreadcrumbNavItem {
  label: string;
  href?: string;
}

export interface BreadcrumbNavProps {
  items: BreadcrumbNavItem[];
  className?: string;
}

export function BreadcrumbNav({
  items,
  className,
}: BreadcrumbNavProps): React.JSX.Element {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className="overflow-hidden whitespace-nowrap md:text-base">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.href && !isLast ? (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};

