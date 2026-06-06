"use client";

import React, { useActionState, useEffect } from "react";
import { LeaseStatus } from "@/lib/generated/prisma/enums";
import type { LeaseDTO, PropertyDTO, TenantDTO } from "@/lib/types/property";
import type { ChargeTypeDTO } from "@/lib/dal/charges";
import { createLeaseAction, updateLeaseAction, type LeaseActionState } from "@/lib/actions/lease.actions";
import { VALID_STATUS_TRANSITIONS } from "@/lib/schemas/lease.schema";
import { toast } from "sonner";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RelationalFieldWrapper } from "@/components/ui/relational-link";

interface LeaseFormClientProps {
  mode: "create" | "edit";
  lease?: LeaseDTO;
  properties: PropertyDTO[];
  tenants: TenantDTO[];
  chargeTypes?: ChargeTypeDTO[];
}

export function LeaseFormClient({
  mode,
  lease,
  properties,
  tenants,
  chargeTypes = [],
}: LeaseFormClientProps): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [state, formAction, isPending] = useActionState(
    async (prevState: LeaseActionState | null, formData: FormData) => {
      if (mode === "edit" && lease) {
        return updateLeaseAction(lease.id, prevState, formData);
      }
      return createLeaseAction(prevState, formData);
    },
    null
  );

  const handleCancel = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("mode");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (state?.success && state.lease) {
      if (mode === "edit") {
        let msg = "Contrat de location mis à jour.";
        if (state.schedulesGenerated) msg += ` ${state.schedulesGenerated} échéance(s) générée(s).`;
        if (state.schedulesDeleted) msg += ` ${state.schedulesDeleted} échéance(s) annulée(s).`;
        toast.success(msg);
      } else {
        toast.success(`Contrat créé avec succès. ${state.schedulesGenerated || 0} échéance(s) générée(s).`);
      }
      const params = new URLSearchParams(searchParams.toString());
      params.delete("mode");
      params.set("selectedLeaseId", state.lease.id);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, mode, router, pathname, searchParams]);

  const defaultPropertyId = lease?.propertyId || properties[0]?.id || "";
  const defaultTenantId = lease?.tenantId || tenants[0]?.id || "";
  const defaultRentAmount = lease?.rentAmount ?? "";
  const defaultDepositAmount = lease?.depositAmount ?? "";
  const defaultStartDate = lease
    ? new Date(lease.startDate).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];
  const defaultEndDate = lease?.endDate
    ? new Date(lease.endDate).toISOString().split("T")[0]
    : new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split("T")[0];
  const defaultStatus = lease?.status || LeaseStatus.ACTIVE;

  const [selectedPropertyId, setSelectedPropertyId] = React.useState<string>(defaultPropertyId);
  const [selectedTenantId, setSelectedTenantId] = React.useState<string>(defaultTenantId);
  const [selectedCharges, setSelectedCharges] = React.useState<{chargeTypeId: string, amount: number}[]>(
    lease?.charges?.map((c: any) => ({ chargeTypeId: c.chargeTypeId, amount: c.amount })) || []
  );

  useEffect(() => {
    // If the lease has default charges, set them up on initial load
    if (mode === "create" && chargeTypes.length > 0 && selectedCharges.length === 0) {
      const defaultCharges = chargeTypes.filter((c) => c.isDefault).map((c) => ({
        chargeTypeId: c.id,
        amount: 0,
      }));
      if (defaultCharges.length > 0) {
        setSelectedCharges(defaultCharges);
      }
    }
  }, [mode, chargeTypes, selectedCharges.length]);

  return (
    <Card className="border-outline-variant/60 shadow-md rounded-xl overflow-hidden">
      <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-md flex flex-row items-center justify-between">
        <CardTitle className="text-h3 font-display">
          {mode === "create" ? "Nouveau Contrat" : "Modifier le Contrat"}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCancel}>
          Annuler
        </Button>
      </CardHeader>
      <CardContent className="pt-md max-h-[calc(100vh-220px)] overflow-y-auto">
        {lease?.status === "DRAFT" && (
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md text-orange-800 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined">warning</span>
            Ce bail est en brouillon. Passez-le au statut "Actif" pour générer les échéances automatiquement.
          </div>
        )}
        <form 
          action={formAction} 
          className="flex flex-col gap-md"
          onSubmit={(e) => {
            const formData = new FormData(e.currentTarget);
            const newStatus = formData.get("status") as string;
            const currentStatus = lease?.status;

            if (newStatus === "ACTIVE" && currentStatus !== "ACTIVE") {
              if (!window.confirm("Vous êtes sur le point d'activer ce bail. Le système va générer automatiquement les échéances jusqu'à la fin de l'année (ou fin du contrat). Voulez-vous continuer ?")) {
                e.preventDefault();
              }
            } else if ((newStatus === "TERMINATED" || newStatus === "EXPIRED") && currentStatus === "ACTIVE") {
               if (!window.confirm(`Vous allez passer le bail à ${newStatus}. Toutes les échéances futures non payées seront supprimées. Continuer ?`)) {
                  e.preventDefault();
               }
            }
          }}
        >
          <div className="flex flex-col gap-xs">
            <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
              Bien Immobilier *
            </label>
            <RelationalFieldWrapper entityType="property" entityId={selectedPropertyId}>
              <Select
                name="propertyId"
                defaultValue={defaultPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                options={properties.map((p) => ({
                  label: `${p.designation} (${p.reference})`,
                  value: p.id,
                }))}
                wrapperClassName="w-full"
              />
            </RelationalFieldWrapper>
            {state?.errors?.propertyId && <p className="text-xs text-error">{state.errors.propertyId[0]}</p>}
          </div>

          <div className="flex flex-col gap-xs">
            <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
              Locataire *
            </label>
            <RelationalFieldWrapper entityType="tenant" entityId={selectedTenantId}>
              <Select
                name="tenantId"
                defaultValue={defaultTenantId}
                onChange={(e) => setSelectedTenantId(e.target.value)}
                options={tenants.map((t) => ({
                  label: `${t.firstName || ""} ${t.lastName || ""} ${t.companyName ? `(${t.companyName})` : ""}`.trim() || t.id,
                  value: t.id,
                }))}
                wrapperClassName="w-full"
              />
            </RelationalFieldWrapper>
            {state?.errors?.tenantId && <p className="text-xs text-error">{state.errors.tenantId[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Loyer convenu *
              </label>
              <Input
                name="rentAmount"
                required
                type="number"
                placeholder="ex: 250000"
                defaultValue={defaultRentAmount}
              />
              {state?.errors?.rentAmount && <p className="text-xs text-error">{state.errors.rentAmount[0]}</p>}
            </div>
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Dépôt de Garantie (Caution)
              </label>
              <Input
                name="depositAmount"
                type="number"
                placeholder="ex: 500000"
                defaultValue={defaultDepositAmount}
              />
              {state?.errors?.depositAmount && <p className="text-xs text-error">{state.errors.depositAmount[0]}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Date de début *
              </label>
              <Input
                name="startDate"
                required
                type="date"
                defaultValue={defaultStartDate}
              />
              {state?.errors?.startDate && <p className="text-xs text-error">{state.errors.startDate[0]}</p>}
            </div>
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Date de fin
              </label>
              <Input
                name="endDate"
                type="date"
                defaultValue={defaultEndDate}
              />
              {state?.errors?.endDate && <p className="text-xs text-error">{state.errors.endDate[0]}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Périodicité
              </label>
              <Select
                name="paymentFrequency"
                defaultValue="MONTHLY"
                options={[
                  { label: "Mensuelle", value: "MONTHLY" },
                  { label: "Trimestrielle", value: "QUARTERLY" },
                  { label: "Semestrielle", value: "SEMI_ANNUALLY" },
                  { label: "Annuelle", value: "ANNUALLY" },
                ]}
                wrapperClassName="w-full"
              />
              {state?.errors?.paymentFrequency && <p className="text-xs text-error">{state.errors.paymentFrequency[0]}</p>}
            </div>
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Jour de paiement
              </label>
              <Input
                name="paymentDay"
                type="number"
                min="1"
                max="31"
                defaultValue={5}
              />
              {state?.errors?.paymentDay && <p className="text-xs text-error">{state.errors.paymentDay[0]}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-xs pt-4 border-t border-outline-variant/30">
            <div className="flex justify-between items-center mb-2">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Charges Additionnelles
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const available = chargeTypes.filter(ct => !selectedCharges.some(sc => sc.chargeTypeId === ct.id));
                  if (available.length > 0) {
                    setSelectedCharges([...selectedCharges, { chargeTypeId: available[0].id, amount: 0 }]);
                  }
                }}
                disabled={selectedCharges.length >= chargeTypes.length}
              >
                <span className="material-symbols-outlined text-[18px] mr-1">add</span>
                Ajouter une charge
              </Button>
            </div>
            
            {selectedCharges.length === 0 ? (
              <p className="text-sm text-on-surface-variant italic">Aucune charge ajoutée.</p>
            ) : (
              <div className="space-y-3">
                {selectedCharges.map((charge, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <div className="flex-1">
                      <Select
                        name={`chargeTypeId_${idx}`}
                        value={charge.chargeTypeId}
                        onChange={(e) => {
                          const newCharges = [...selectedCharges];
                          newCharges[idx].chargeTypeId = e.target.value;
                          setSelectedCharges(newCharges);
                        }}
                        options={chargeTypes.map(ct => ({ label: ct.name, value: ct.id }))}
                        wrapperClassName="w-full"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="Montant (FCFA)"
                        value={charge.amount}
                        onChange={(e) => {
                          const newCharges = [...selectedCharges];
                          newCharges[idx].amount = Number(e.target.value);
                          setSelectedCharges(newCharges);
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newCharges = [...selectedCharges];
                        newCharges.splice(idx, 1);
                        setSelectedCharges(newCharges);
                      }}
                      className="text-error"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <input type="hidden" name="charges" value={JSON.stringify(selectedCharges)} />
          </div>

          <div className="flex flex-col gap-xs">
            <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
              Statut du contrat
            </label>
            <Select
              name="status"
              defaultValue={defaultStatus}
              options={[
                { label: "Brouillon", value: "DRAFT" },
                { label: "Actif", value: "ACTIVE" },
                { label: "Résilié", value: "TERMINATED" },
                { label: "Expiré", value: "EXPIRED" },
              ].filter(opt => !lease || lease.status === opt.value || VALID_STATUS_TRANSITIONS[lease.status as LeaseStatus]?.includes(opt.value as LeaseStatus))}
              wrapperClassName="w-full"
            />
            {state?.errors?.status && <p className="text-xs text-error">{state.errors.status[0]}</p>}
          </div>

          <Button type="submit" disabled={isPending} className="w-full mt-sm">
            {isPending ? "Enregistrement..." : "Enregistrer le contrat"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
