import * as React from "react";
import { cn } from "@/lib/utils";

export interface TablePaginationProps
  extends React.HTMLAttributes<HTMLDivElement> {
  total: number;
  start?: number;
  end?: number;
  disabledPrev?: boolean;
  disabledNext?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  prevLabel?: string;
  nextLabel?: string;
}

const TablePagination = React.forwardRef<HTMLDivElement, TablePaginationProps>(
  (
    {
      className,
      total,
      start = 1,
      end = 10,
      disabledPrev = true,
      disabledNext = true,
      onPrev,
      onNext,
      ...props
    },
    ref
  ) => {
    const displayEnd = Math.min(end, total);
    const displayStart = total === 0 ? 0 : Math.min(start, total);

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between p-sm border-t border-outline-variant bg-surface-container-low select-none transition-all",
          className
        )}
        {...props}
      >
        <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider">
          Affichage de {displayStart}-{displayEnd} sur {total}
        </span>
        <div className="flex items-center gap-xs">
          <button
            type="button"
            onClick={onPrev}
            disabled={disabledPrev}
            className="p-xs border border-outline-variant bg-surface-container-lowest hover:bg-surface-variant active:bg-surface-container-low text-on-surface transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center shadow-xs"
            aria-label="Page précédente"
          >
            <span className="material-symbols-outlined text-[20px] leading-none">
              chevron_left
            </span>
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={disabledNext}
            className="p-xs border border-outline-variant bg-surface-container-lowest hover:bg-surface-variant active:bg-surface-container-low text-on-surface transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center shadow-xs"
            aria-label="Page suivante"
          >
            <span className="material-symbols-outlined text-[20px] leading-none">
              chevron_right
            </span>
          </button>
        </div>
      </div>
    );
  }
);
TablePagination.displayName = "TablePagination";

export { TablePagination };
