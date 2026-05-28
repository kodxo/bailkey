"use client";

import React from "react";
import type { LeaseDTO } from "@/lib/types/property";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TablePagination } from "@/components/ui/pagination";

interface LeasesTableClientProps {
  leases: LeaseDTO[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export function LeasesTableClient({
  leases,
  totalCount,
  currentPage,
  pageSize,
}: LeasesTableClientProps): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedLeaseId = searchParams.get("selectedLeaseId");
  const totalPages = Math.ceil(totalCount / pageSize);

  const setSelectedLease = (ls: LeaseDTO | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (ls) {
      params.set("selectedLeaseId", ls.id);
    } else {
      params.delete("selectedLeaseId");
    }
    params.delete("mode");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleStartEdit = (ls: LeaseDTO) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("selectedLeaseId", ls.id);
    params.set("mode", "edit");
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

  const mode = searchParams.get("mode");

  return (
    <>
      <Table wrapperClassName="max-h-[calc(100vh-250px)] rounded-xl border border-outline-variant/60 shadow-xs relative transition-all bg-surface-container-lowest">
        <TableHeader>
          <TableRow>
            <TableHead>PROPRIÉTÉ</TableHead>
            <TableHead>LOCATAIRE</TableHead>
            <TableHead>LOYER / CAUTION</TableHead>
            <TableHead>STATUT</TableHead>
            <TableHead className="text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="p-lg text-center text-on-surface-variant font-medium">
                Aucun contrat de location trouvé.
              </TableCell>
            </TableRow>
          ) : (
            leases.map((ls) => {
              const isSelected = selectedLeaseId === ls.id;

              return (
                <TableRow
                  key={ls.id}
                  onClick={() => setSelectedLease(ls)}
                  className={`cursor-pointer transition-colors relative ${
                    isSelected 
                      ? "bg-primary/5 font-medium after:absolute after:inset-y-0 after:left-0 after:w-1 after:bg-primary" 
                      : "hover:bg-surface-container-low"
                  }`}
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-body-md font-bold text-on-surface leading-snug">
                        {ls.propertyDesignation}
                      </span>
                      <span className="text-body-sm font-mono text-primary">
                        {ls.propertyReference}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-body-md font-medium text-on-surface">
                      {ls.tenantFullName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-body-md font-semibold text-primary">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "XAF",
                          maximumFractionDigits: 0,
                        }).format(ls.rentAmount)}
                      </span>
                      <span className="text-body-xs text-on-surface-variant">
                        Dépôt: {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "XAF",
                          maximumFractionDigits: 0,
                        }).format(ls.depositAmount || 0)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {ls.status === "ACTIVE" && <Badge variant="default" dot>Actif</Badge>}
                    {ls.status === "DRAFT" && <Badge variant="surface" dot>Brouillon</Badge>}
                    {ls.status === "TERMINATED" && <Badge variant="destructive">Résilié</Badge>}
                    {ls.status === "EXPIRED" && <Badge variant="surface">Expiré</Badge>}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={mode !== null}
                      onClick={() => handleStartEdit(ls)}
                    >
                      <span className="material-symbols-outlined text-sm mr-1 select-none" data-icon="edit">edit</span>
                      Éditer
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

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
