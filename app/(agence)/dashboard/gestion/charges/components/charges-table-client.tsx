"use client";

import React, { useState } from "react";
import { Plus, Settings2, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChargeTypeDTO } from "@/lib/dal/charges";
import { ChargeFormModal } from "./charge-form-modal";
import { AccountingMode } from "@/lib/generated/prisma/enums";

export function ChargesTableClient({ charges }: { charges: ChargeTypeDTO[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState<ChargeTypeDTO | null>(null);

  const handleEdit = (charge: ChargeTypeDTO) => {
    setSelectedCharge(charge);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedCharge(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-md">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-on-background">
            Types de Charges
          </h2>
          <p className="text-sm text-on-surface-variant">
            Gérez le catalogue des charges applicables à vos baux.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle charge
        </Button>
      </div>

      <div className="border border-outline-variant rounded-xl overflow-hidden bg-surface">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom de la charge</TableHead>
              <TableHead>Mode comptable</TableHead>
              <TableHead>Options</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {charges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-on-surface-variant">
                  Aucun type de charge configuré. Cliquez sur "Nouvelle charge" pour commencer.
                </TableCell>
              </TableRow>
            ) : (
              charges.map((charge) => (
                <TableRow
                  key={charge.id}
                  className="cursor-pointer hover:bg-surface-variant/50"
                  onClick={() => handleEdit(charge)}
                >
                  <TableCell className="font-medium text-on-surface">
                    {charge.name}
                  </TableCell>
                  <TableCell>
                    {charge.accountingMode === AccountingMode.CREDIT ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        Crédit (Encaissement)
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        Débit (Dépense)
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {charge.isDefault && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                          <Settings2 className="w-3 h-3" />
                          Par défaut
                        </span>
                      )}
                      {charge.isUtility && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          <Droplets className="w-3 h-3" />
                          Utilitaire
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(charge);
                    }}>
                      Modifier
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ChargeFormModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        charge={selectedCharge}
      />
    </div>
  );
}
