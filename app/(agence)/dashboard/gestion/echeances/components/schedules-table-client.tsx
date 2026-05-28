"use client";

import React from "react";
import type { ScheduleDisplayDTO } from "./schedule-serializer";
import { SchedulesTable } from "./schedules-table";
import { TablePagination } from "@/components/ui/pagination";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface SchedulesTableClientProps {
  schedules: ScheduleDisplayDTO[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export function SchedulesTableClient({
  schedules,
  totalCount,
  currentPage,
  pageSize,
}: SchedulesTableClientProps): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedId = searchParams.get("selectedId");
  const totalPages = Math.ceil(totalCount / pageSize);

  const setSelectedId = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("selectedId", id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", newPageSize.toString());
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <SchedulesTable
        schedules={schedules}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <TablePagination
        total={totalCount}
        start={(currentPage - 1) * pageSize + 1}
        end={Math.min(currentPage * pageSize, totalCount)}
        disabledPrev={currentPage <= 1}
        disabledNext={currentPage >= totalPages || totalPages <= 1}
        onPrev={() => handlePageChange(Math.max(currentPage - 1, 1))}
        onNext={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
