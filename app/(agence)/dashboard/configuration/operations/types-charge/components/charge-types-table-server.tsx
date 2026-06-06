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
import { Button } from "@/components/ui/button";
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
              <TableHead className="text-xs font-bold text-on-surface-variant uppercase">Nom de la charge</TableHead>
              <TableHead className="text-xs font-bold text-on-surface-variant uppercase">Mode Comptable</TableHead>
              <TableHead className="text-xs font-bold text-on-surface-variant uppercase">Options</TableHead>
              <TableHead className="text-xs font-bold text-on-surface-variant uppercase text-right">Actions</TableHead>
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
                  className={`transition-colors ${
                    selectedId === charge.id ? "bg-primary/5" : "hover:bg-surface-variant/20"
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
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary text-primary flex gap-1 items-center">
                          <span className="material-symbols-outlined text-[10px]">share</span>
                          Par défaut
                        </Badge>
                      )}
                      {charge.isUtility && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">Utilitaire</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRowClick(charge.id)}
                    >
                      <span className="material-symbols-outlined text-sm mr-1 select-none" data-icon="edit">edit</span>
                      ÉDITER
                    </Button>
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
