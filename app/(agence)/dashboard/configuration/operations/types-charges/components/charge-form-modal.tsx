"use client";

import React, { useActionState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChargeTypeDTO } from "@/lib/dal/charges";
import {
  createChargeTypeAction,
  updateChargeTypeAction,
} from "@/lib/actions/charge.actions";
import { toast } from "sonner";
import { AccountingMode } from "@/lib/generated/prisma/enums";

export function ChargeFormModal({
  isOpen,
  onOpenChange,
  charge,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  charge: ChargeTypeDTO | null;
}) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      if (charge) {
        return updateChargeTypeAction(charge.id, prevState, formData);
      }
      return createChargeTypeAction(prevState, formData);
    },
    null,
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(
        charge ? "Charge modifiée avec succès" : "Charge ajoutée avec succès",
      );
      onOpenChange(false);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, charge, onOpenChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {charge ? "Modifier la charge" : "Nouvelle charge"}
          </DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nom de la charge
            </label>
            <Input
              id="name"
              name="name"
              defaultValue={charge?.name}
              placeholder="Ex: Gardiennage, Ordures, Eau..."
              autoFocus
            />
            {state?.errors?.name && (
              <p className="text-sm text-error">{state.errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Mode comptable</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-surface-variant/30 transition-colors">
                <input
                  type="radio"
                  name="accountingMode"
                  value={AccountingMode.CREDIT}
                  defaultChecked={
                    !charge || charge.accountingMode === AccountingMode.CREDIT
                  }
                  className="mr-3"
                />
                <div>
                  <p className="font-medium text-sm">Crédit (Encaissement)</p>
                  <p className="text-xs text-on-surface-variant">
                    Payé par le locataire, reversé au propriétaire.
                  </p>
                </div>
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-surface-variant/30 transition-colors">
                <input
                  type="radio"
                  name="accountingMode"
                  value={AccountingMode.DEBIT}
                  defaultChecked={
                    charge?.accountingMode === AccountingMode.DEBIT
                  }
                  className="mr-3"
                />
                <div>
                  <p className="font-medium text-sm">Débit (Dépense)</p>
                  <p className="text-xs text-on-surface-variant">
                    Retenu sur le versement au propriétaire.
                  </p>
                </div>
              </label>
            </div>
            {state?.errors?.accountingMode && (
              <p className="text-sm text-error">
                {state.errors.accountingMode[0]}
              </p>
            )}
          </div>

          <div className="space-y-4 pt-2">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="isDefault"
                defaultChecked={charge?.isDefault}
                className="mt-1"
              />
              <div>
                <p className="font-medium text-sm">
                  Ajout automatique (Par défaut)
                </p>
                <p className="text-xs text-on-surface-variant">
                  Sera proposée automatiquement lors de la création d'un nouveau
                  bail.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="isUtility"
                defaultChecked={charge?.isUtility}
                className="mt-1"
              />
              <div>
                <p className="font-medium text-sm">Charge utilitaire</p>
                <p className="text-xs text-on-surface-variant">
                  Identifie les factures de type Eau ou Électricité (SEEG,
                  ENEO...).
                </p>
              </div>
            </label>
          </div>

          <DialogFooter className="pt-4">
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
