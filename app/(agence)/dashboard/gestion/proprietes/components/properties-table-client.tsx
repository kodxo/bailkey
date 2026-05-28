"use client";

import React from "react";
import type { PropertyDTO } from "@/lib/types/property";
import { PropertiesTable } from "./properties-table";
import { TablePagination } from "@/components/ui/pagination";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface PropertiesTableClientProps {
  properties: PropertyDTO[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export function PropertiesTableClient({
  properties,
  totalCount,
  currentPage,
  pageSize,
}: PropertiesTableClientProps): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedId = searchParams.get("selectedId");
  const totalPages = Math.ceil(totalCount / pageSize);

  const setSelectedId = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("selectedId", id);
    params.delete("mode");
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
      <PropertiesTable
        properties={properties}
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
