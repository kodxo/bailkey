"use client";

import React, { useActionState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { createLeaseCharge, updateLeaseCharge } from "@/lib/actions/lease-charges";
import type { LeaseChargeDTO } from "@/lib/dal/lease-charges";

interface LeaseChargeFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  leaseCharge?: LeaseChargeDTO | null;
  leases: { id: string; propertyDesignation: string; tenantFullName: string }[];
  chargeTypes: { id: string; name: string }[];
}

export function LeaseChargeFormModal({
  isOpen,
  onOpenChange,
  leaseCharge,
  leases,
  chargeTypes,
}: LeaseChargeFormModalProps) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      if (leaseCharge) {
        return updateLeaseCharge(leaseCharge.id, prevState, formData);
      }
      return createLeaseCharge(prevState, formData);
    },
    null
  );

  useEffect(() => {
    if (state?.success) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  const isEdit = !!leaseCharge;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Modifier la ligne de charge" : "Nouvelle ligne de charge"}
          </DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4 pt-4">
          {state?.error && (
            <div className="p-3 bg-error/10 text-error rounded-md text-sm">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface-variant">
              Bail concerné
            </label>
            <Select
              name="leaseId"
              defaultValue={leaseCharge?.leaseId || ""}
              disabled={isEdit || isPending}
              options={[
                { label: "Sélectionner un bail...", value: "" },
                ...leases.map((l) => ({
                  label: `${l.propertyDesignation} - ${l.tenantFullName}`,
                  value: l.id,
                })),
              ]}
            />
            {state?.fieldErrors?.leaseId && (
              <p className="text-sm text-error">{state.fieldErrors.leaseId[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface-variant">
              Type de charge
            </label>
            <Select
              name="chargeTypeId"
              defaultValue={leaseCharge?.chargeTypeId || ""}
              disabled={isEdit || isPending}
              options={[
                { label: "Sélectionner un type...", value: "" },
                ...chargeTypes.map((c) => ({
                  label: c.name,
                  value: c.id,
                })),
              ]}
            />
            {state?.fieldErrors?.chargeTypeId && (
              <p className="text-sm text-error">{state.fieldErrors.chargeTypeId[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface-variant">
              Montant par défaut (XAF)
            </label>
            <Input
              name="defaultAmount"
              type="number"
              placeholder="0"
              min={0}
              step={1}
              defaultValue={leaseCharge?.defaultAmount?.toString() || ""}
              disabled={isPending}
            />
            {state?.fieldErrors?.defaultAmount && (
              <p className="text-sm text-error">{state.fieldErrors.defaultAmount[0]}</p>
            )}
          </div>

          <DialogFooter className="pt-4 border-t border-outline-variant mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
