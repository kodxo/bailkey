"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { TablePagination } from "./pagination";

export interface ServerTablePaginationProps {
  total: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export function ServerTablePagination({
  total,
  currentPage,
  pageSize,
  totalPages,
}: ServerTablePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePrev = () => {
    if (currentPage > 1) handlePageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) handlePageChange(currentPage + 1);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  return (
    <TablePagination
      total={total}
      start={startIndex + 1}
      end={endIndex}
      currentPage={currentPage}
      totalPages={totalPages}
      onPrev={handlePrev}
      onNext={handleNext}
      onPageChange={handlePageChange}
      disabledPrev={currentPage <= 1}
      disabledNext={currentPage >= totalPages}
    />
  );
}
