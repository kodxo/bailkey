"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { TablePagination } from "@/components/ui/pagination";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import type { ChargeTypeDTO } from "@/lib/dal/charges";

interface ChargeTypesTableServerProps {
  data: ChargeTypeDTO[];
  total: number;
  page: number;
  pageSize: number;
  selectedId?: string;
}

export function ChargeTypesTableServer({
  data,
  total,
  page,
  pageSize,
  selectedId,
}: ChargeTypesTableServerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleRowClick = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedId === id) {
      params.delete("selectedId");
    } else {
      params.set("selectedId", id);
      params.delete("mode"); // clear create mode if selecting
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePageSizeChange = (newSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", newSize.toString());
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest border border-outline-variant/30 overflow-hidden">
      <div className="flex-1 overflow-auto relative">
        <Table>
          <TableHeader className="sticky top-0 bg-surface-container z-10 shadow-sm">
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type Comptable</TableHead>
              <TableHead>Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Aucune charge trouvée.
                </TableCell>
              </TableRow>
            ) : (
              data.map((charge) => (
                <TableRow
                  key={charge.id}
                  onClick={() => handleRowClick(charge.id)}
                  className={`cursor-pointer transition-colors ${
                    selectedId === charge.id ? "bg-primary/5" : "hover:bg-surface-variant/50"
                  }`}
                >
                  <TableCell className="font-medium text-on-surface">
                    {charge.name}
                  </TableCell>
                  <TableCell>
                    {charge.accountingMode === "CREDIT" ? (
                      <span className="text-primary flex items-center gap-1 text-sm font-medium">
                        <span className="material-symbols-outlined text-[16px]">add_circle</span>
                        Crédit (Encaissement)
                      </span>
                    ) : (
                      <span className="text-error flex items-center gap-1 text-sm font-medium">
                        <span className="material-symbols-outlined text-[16px]">remove_circle</span>
                        Débit (Dépense)
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {charge.isDefault && (
                        <Badge variant="default" className="text-[10px] px-1.5 py-0">Par défaut</Badge>
                      )}
                      {charge.isUtility && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Utilitaire</Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="border-t border-outline-variant/30 bg-surface-container-low">
        <TablePagination
          total={total}
          currentPage={page}
          pageSize={pageSize}
          totalPages={Math.ceil(total / pageSize)}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}
