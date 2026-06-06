"use client";

import React, { useActionState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { ScheduleDisplayDTO } from "./schedule-serializer";
import { recordPaymentAction } from "@/lib/actions/payments";
import { toast } from "sonner";
import { generateReceipt } from "@/lib/pdf/generate-receipt";
import Link from "next/link";
import { RelationalLink } from "@/components/ui/relational-link";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface ScheduleDetailsPaneProps {
  selectedSchedule: ScheduleDisplayDTO | null;
}

export function ScheduleDetailsPane({
  selectedSchedule,
}: ScheduleDetailsPaneProps): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("selectedId");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const [state, formAction, isPending] = useActionState(recordPaymentAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success("Paiement enregistré avec succès.");
      handleClose();
      router.refresh();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  const defaultDate = new Date().toISOString().split("T")[0];

  if (!selectedSchedule) {
    return (
      <Card className="border-outline-variant/60 shadow-md rounded-none overflow-hidden h-full min-h-[400px] flex items-center justify-center bg-surface-container-lowest relative">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-tertiary/5 pointer-events-none" />
        <CardContent className="p-xl flex flex-col items-center justify-center text-center text-on-surface-variant relative z-10 ">
          <div className="w-24 h-24 mb-6 rounded-full bg-surface flex items-center justify-center shadow-inner border border-outline-variant/30 ring-4 ring-primary/5">
            <span
              className="material-symbols-outlined text-[48px] text-primary/40"
              data-icon="receipt_long"
            >
              receipt_long
            </span>
          </div>
          <h3 className="text-h3 font-display text-on-surface mb-2">
            Détails de l'échéance
          </h3>
          <p className="font-body-md text-body-md leading-relaxed">
            Sélectionnez une ligne dans le tableau à gauche pour consulter les
            détails de l'échéance ou enregistrer un nouveau paiement.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-outline-variant/60 shadow-md rounded-none overflow-hidden">
      <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-md flex flex-row items-center justify-between">
        <CardTitle className="text-h3 font-display">
          Enregistrer un paiement
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="h-8 w-8 p-0 rounded-full text-on-surface-variant hover:bg-surface-variant"
        >
          <span
            className="material-symbols-outlined text-sm select-none"
            data-icon="close"
          >
            close
          </span>
        </Button>
      </CardHeader>
      <CardContent className="p-md flex flex-col gap-md">
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-none mb-2">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-on-surface">
              {selectedSchedule.tenantName}
            </h4>
            {selectedSchedule.tenantId && (
              <RelationalLink entityType="tenant" entityId={selectedSchedule.tenantId} />
            )}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-body-sm text-on-surface-variant">
              {selectedSchedule.propertyInfo}
            </p>
            {selectedSchedule.propertyId && (
              <RelationalLink entityType="property" entityId={selectedSchedule.propertyId} />
            )}
          </div>
          <div className="flex justify-between items-end border-t border-outline-variant/30 pt-2 mt-2">
            <span className="text-body-sm text-on-surface-variant">
              Reste à payer :
            </span>
            <span className="font-bold text-h3 text-primary">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(selectedSchedule.remaining)}
            </span>
          </div>
          
          <details className="mt-2 text-xs text-on-surface-variant group">
            <summary className="cursor-pointer select-none hover:text-primary transition-colors mb-1 list-none flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] group-open:rotate-90 transition-transform">chevron_right</span>
              Voir le détail du montant attendu ({new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(selectedSchedule.amount)})
            </summary>
            <div className="pl-5 space-y-1 mt-2">
              <div className="flex justify-between">
                <span>Loyer de base :</span>
                <span className="font-mono">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(selectedSchedule.rentAmount || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total des charges :</span>
                <span className="font-mono">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(selectedSchedule.chargesAmount || 0)}</span>
              </div>
            </div>
          </details>
          <div className="mt-3 pt-3 border-t border-outline-variant/30 flex justify-end">
             <Link href={`/dashboard/gestion/baux?selectedLeaseId=${selectedSchedule.leaseId}`}>
               <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2">
                 <span className="material-symbols-outlined text-[16px]">description</span>
                 Ouvrir le contrat de bail
               </Button>
             </Link>
          </div>
        </div>

        {/* Liste des paiements existants */}
        {selectedSchedule.payments && selectedSchedule.payments.length > 0 && (
          <div className="mb-4">
            <h5 className="text-label-caps uppercase text-on-surface-variant font-bold mb-2">
              Paiements enregistrés
            </h5>
            <div className="flex flex-col gap-2">
              {selectedSchedule.payments.map((p) => (
                <div
                  key={p.id}
                  className="bg-surface border border-outline-variant/30 p-2 rounded-none flex justify-between items-center text-sm"
                >
                  <div>
                    <div className="font-bold text-on-surface">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(p.amount)}{" "}
                      <span className="font-normal text-on-surface-variant text-xs">
                        le {p.date}
                      </span>
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      {p.method} {p.reference ? `· Réf: ${p.reference}` : ""}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-error"
                  >
                    <span
                      className="material-symbols-outlined text-[16px] select-none"
                      data-icon="delete"
                    >
                      delete
                    </span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulaire de nouveau paiement */}
        {selectedSchedule.remaining > 0 && (
          <form action={formAction} className="flex flex-col gap-sm">
            <h5 className="text-label-caps uppercase text-on-surface-variant font-bold mb-2 border-t border-outline-variant/30 pt-4">
              Nouveau Paiement
            </h5>
            
            <input type="hidden" name="scheduleId" value={selectedSchedule.id} />
            
            <div>
              <label className="text-body-sm font-bold block mb-1">
                Montant encaissé
              </label>
              <Input
                name="amount"
                placeholder="Montant (FCFA)"
                type="number"
                step="0.01"
                defaultValue={selectedSchedule.remaining}
                disabled={isPending}
              />
              {state?.errors?.amount && (
                <p className="text-xs text-error mt-1">{state.errors.amount[0]}</p>
              )}
            </div>
            
            <div>
              <label className="text-body-sm font-bold block mb-1">
                Méthode de paiement
              </label>
              <Select
                name="paymentMethod"
                defaultValue="CASH"
                disabled={isPending}
                options={[
                  { label: "Espèces", value: "CASH" },
                  { label: "Virement bancaire", value: "BANK_TRANSFER" },
                  { label: "Mobile Money", value: "MOBILE_MONEY" },
                  { label: "Chèque", value: "CHEQUE" },
                ]}
              />
              {state?.errors?.paymentMethod && (
                <p className="text-xs text-error mt-1">{state.errors.paymentMethod[0]}</p>
              )}
            </div>
            
            <div>
              <label className="text-body-sm font-bold block mb-1">
                Référence de paiement
              </label>
              <Input
                name="reference"
                placeholder="N° de transaction, N° de chèque..."
                disabled={isPending}
              />
              {state?.errors?.reference && (
                <p className="text-xs text-error mt-1">{state.errors.reference[0]}</p>
              )}
            </div>
            
            <div>
              <label className="text-body-sm font-bold block mb-1">
                Date du paiement
              </label>
              <Input
                name="paymentDate"
                type="date"
                defaultValue={defaultDate}
                disabled={isPending}
              />
              {state?.errors?.paymentDate && (
                <p className="text-xs text-error mt-1">{state.errors.paymentDate[0]}</p>
              )}
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? "Enregistrement..." : "Confirmer le paiement"}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="w-full"
                onClick={handleClose}
                disabled={isPending}
              >
                Annuler
              </Button>
            </div>
          </form>
        )}

        {selectedSchedule.remaining === 0 && (
          <div className="mt-4 p-4 bg-primary/10 text-primary text-center rounded-none border border-primary/20">
            <span
              className="material-symbols-outlined mb-2 text-2xl"
              data-icon="check_circle"
            >
              check_circle
            </span>
            <p className="font-bold">Échéance totalement réglée</p>
          </div>
        )}

        {/* Bouton Télécharger Quittance */}
        {selectedSchedule.amount - selectedSchedule.remaining > 0 && (
          <div className="mt-4 pt-4 border-t border-outline-variant/30">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => generateReceipt(selectedSchedule)}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                data-icon="download"
              >
                download
              </span>
              Télécharger le reçu{" "}
              {selectedSchedule.status === "PARTIAL"
                ? "partiel"
                : "de paiement"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
