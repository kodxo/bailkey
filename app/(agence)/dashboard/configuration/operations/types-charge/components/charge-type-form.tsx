"use client";

import React, { useActionState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { createChargeTypeAction, updateChargeTypeAction } from "@/lib/actions/charge.actions";
import { toast } from "sonner";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { ChargeTypeDTO } from "@/lib/dal/charges";

interface ChargeTypeFormProps {
  initialData?: ChargeTypeDTO;
}

export function ChargeTypeForm({ initialData }: ChargeTypeFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("selectedId");
    params.delete("mode");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const action = initialData
    ? updateChargeTypeAction.bind(null, initialData.id)
    : createChargeTypeAction;

  const [state, formAction, isPending] = useActionState(action, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(
        initialData
          ? "Charge mise à jour avec succès"
          : "Charge créée avec succès"
      );
      handleClose();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, initialData]);

  return (
    <Card className="border-outline-variant/60 shadow-md rounded-none overflow-hidden h-full">
      <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-md flex flex-row items-center justify-between">
        <CardTitle className="text-h3 font-display">
          {initialData ? "Modifier la charge" : "Nouvelle charge"}
        </CardTitle>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="h-8 w-8 p-0 rounded-full text-on-surface-variant hover:bg-surface-variant"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </Button>
      </CardHeader>

      <CardContent className="p-md h-[calc(100%-80px)] overflow-y-auto">
        <form action={formAction} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-semibold">
              Nom de la charge *
            </label>
            <Input
              id="name"
              name="name"
              defaultValue={initialData?.name}
              placeholder="ex: Entretien des parties communes"
              required
            />
            {state?.errors?.name && (
              <p className="text-xs text-error">{state.errors.name[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold">Type comptable *</label>
            <div className="flex flex-col gap-3">
              <label htmlFor="credit" className="flex items-start space-x-3 bg-surface-container-lowest border border-outline-variant/40 p-3 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                <input
                  type="radio"
                  name="accountingMode"
                  value="CREDIT"
                  id="credit"
                  defaultChecked={!initialData || initialData.accountingMode === "CREDIT"}
                  className="mt-1"
                />
                <div>
                  <span className="font-bold cursor-pointer block">
                    Crédit (Encaissement)
                  </span>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Charge payée par le locataire et reversée au propriétaire (ex: Provision sur charges).
                  </p>
                </div>
              </label>

              <label htmlFor="debit" className="flex items-start space-x-3 bg-surface-container-lowest border border-outline-variant/40 p-3 rounded-lg cursor-pointer hover:border-error/50 transition-colors">
                <input
                  type="radio"
                  name="accountingMode"
                  value="DEBIT"
                  id="debit"
                  defaultChecked={initialData?.accountingMode === "DEBIT"}
                  className="mt-1"
                />
                <div>
                  <span className="font-bold cursor-pointer block">
                    Débit (Dépense / Travaux)
                  </span>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Charge déduite du versement au propriétaire (ex: Réparations gérées par l'agence).
                  </p>
                </div>
              </label>
            </div>
            {state?.errors?.accountingMode && (
              <p className="text-xs text-error">{state.errors.accountingMode[0]}</p>
            )}
          </div>

          <div className="border-t border-outline-variant/30 pt-6 flex flex-col gap-6">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-bold block mb-1">
                  Appliquer par défaut
                </span>
                <p className="text-xs text-on-surface-variant">
                  S'ajoute automatiquement lors de la création d'un nouveau bail.
                </p>
              </div>
              <input
                type="checkbox"
                name="isDefault"
                defaultChecked={initialData?.isDefault}
                className="w-5 h-5 cursor-pointer accent-primary"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-bold block mb-1">
                  Charge utilitaire
                </span>
                <p className="text-xs text-on-surface-variant">
                  Identifier cette charge comme une facture d'eau ou d'électricité (pour le CRG).
                </p>
              </div>
              <input
                type="checkbox"
                name="isUtility"
                defaultChecked={initialData?.isUtility}
                className="w-5 h-5 cursor-pointer accent-primary"
              />
            </label>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
