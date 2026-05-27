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
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (newSize: number) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
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
      pageSize,
      pageSizeOptions = [10, 20, 50, 100],
      onPageSizeChange,
      currentPage,
      totalPages,
      onPageChange,
      ...props
    },
    ref
  ) => {
    const displayEnd = Math.min(end, total);
    const displayStart = total === 0 ? 0 : Math.min(start, total);

    const pages = [];
    if (totalPages && totalPages > 0) {
      const maxVisiblePages = 5;
      const current = currentPage || 1;
      let startPage = Math.max(1, current - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between p-sm border-t border-outline-variant bg-surface-container-low select-none transition-all",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-md">
          {pageSize && onPageSizeChange && (
            <div className="flex items-center gap-xs">
              <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider">
                Lignes par page :
              </span>
              <select
                className="bg-transparent border border-outline-variant rounded-none px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-primary/50 text-on-surface"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}
          <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider">
            Affichage de {displayStart}-{displayEnd} sur {total}
          </span>
        </div>
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
          
          {pages.length > 0 && (
            <div className="flex items-center gap-1 mx-2">
              {pages.map((p, idx) => {
                if (p === '...') {
                  return <span key={`ellipsis-${idx}`} className="text-on-surface-variant px-1">...</span>;
                }
                const pageNum = p as number;
                const isCurrent = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => onPageChange?.(pageNum)}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center border text-sm font-bold transition-all duration-200",
                      isCurrent 
                        ? "bg-primary border-primary text-on-primary" 
                        : "bg-surface-container-lowest border-outline-variant hover:bg-surface-variant text-on-surface"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}

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
