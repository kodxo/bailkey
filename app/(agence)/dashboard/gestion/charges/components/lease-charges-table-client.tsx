"use client";

import React, { useState, useTransition } from "react";
import type { LeaseChargeDTO } from "@/lib/dal/lease-charges";
import { AccountingMode } from "@/lib/generated/prisma/enums";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TablePagination } from "@/components/ui/pagination";
import { deleteLeaseCharge } from "@/lib/actions/lease-charges";
import { LeaseChargeFormModal } from "./lease-charge-form-modal";
import { LeaseChargesFilters } from "./lease-charges-filters";
import { Plus } from "lucide-react";

interface LeaseChargesTableClientProps {
  leaseCharges: LeaseChargeDTO[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  leases: { id: string; propertyDesignation: string; tenantFullName: string }[];
  chargeTypes: { id: string; name: string }[];
  properties: { id: string; name: string }[];
  tenants: { id: string; name: string }[];
}

export function LeaseChargesTableClient({
  leaseCharges,
  totalCount,
  currentPage,
  pageSize,
  leases,
  chargeTypes,
  properties,
  tenants,
}: LeaseChargesTableClientProps): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState<LeaseChargeDTO | null>(null);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleCreate = () => {
    setSelectedCharge(null);
    setIsModalOpen(true);
  };

  const handleEdit = (lc: LeaseChargeDTO) => {
    setSelectedCharge(lc);
    setIsModalOpen(true);
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

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette charge de ce bail ?")) {
      startTransition(async () => {
        const result = await deleteLeaseCharge(id);
        if (!result.success) {
          alert(result.error);
        }
      });
    }
  };

  return (
    <div className="flex flex-col gap-md">
      <LeaseChargesFilters 
        properties={properties}
        tenants={tenants}
        chargeTypes={chargeTypes}
      >
        <Button onClick={handleCreate} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Nouvelle Ligne
        </Button>
      </LeaseChargesFilters>

      <div className="bg-surface border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden flex flex-col relative">
        {isPending && (
          <div className="absolute inset-0 bg-surface/50 flex items-center justify-center z-10">
            <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bail (Propriété)</TableHead>
              <TableHead>Locataire</TableHead>
              <TableHead>Type de Charge</TableHead>
              <TableHead>Montant Défaut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaseCharges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[48px] mb-4 opacity-50">
                      receipt_long
                    </span>
                    <p>Aucune ligne de charge trouvée pour vos critères.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              leaseCharges.map((lc) => (
                <TableRow key={lc.id} className="hover:bg-surface-container-low transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-body-md font-bold text-on-surface leading-snug">
                        {lc.leasePropertyDesignation}
                      </span>
                      <span className="text-body-sm font-mono text-primary">
                        {lc.leasePropertyReference}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-body-md font-medium text-on-surface">
                      {lc.leaseTenantFullName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-body-md text-on-surface font-medium">
                        {lc.chargeTypeName}
                      </span>
                      {lc.chargeTypeAccountingMode === AccountingMode.CREDIT ? (
                        <span className="text-body-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full w-max mt-1">
                          Encaissement
                        </span>
                      ) : (
                        <span className="text-body-xs font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded-full w-max mt-1">
                          Dépense
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-body-md font-semibold text-primary">
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "XAF",
                        maximumFractionDigits: 0,
                      }).format(lc.defaultAmount)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(lc)}
                        disabled={isPending}
                      >
                        <span className="material-symbols-outlined text-sm select-none" data-icon="edit">edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-error hover:text-error hover:bg-error/10"
                        onClick={() => handleDelete(lc.id)}
                        disabled={isPending}
                      >
                        <span className="material-symbols-outlined text-sm select-none" data-icon="delete">delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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

      <LeaseChargeFormModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        leaseCharge={selectedCharge}
        leases={leases}
        chargeTypes={chargeTypes}
      />
    </div>
  );
}
