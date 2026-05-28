"use client";

import React, { useActionState, useEffect } from "react";
import { LeaseStatus } from "@/lib/generated/prisma/enums";
import type { LeaseDTO, PropertyDTO, TenantDTO } from "@/lib/types/property";
import { createLeaseAction, updateLeaseAction, type LeaseActionState } from "@/lib/actions/lease.actions";
import { toast } from "sonner";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface LeaseFormClientProps {
  mode: "create" | "edit";
  lease?: LeaseDTO;
  properties: PropertyDTO[];
  tenants: TenantDTO[];
}

export function LeaseFormClient({
  mode,
  lease,
  properties,
  tenants,
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
        toast.success("Contrat de location mis à jour.");
      } else {
        toast.success("Contrat de location créé avec succès.");
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
        <form action={formAction} className="flex flex-col gap-md">
          <div className="flex flex-col gap-xs">
            <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
              Bien Immobilier *
            </label>
            <Select
              name="propertyId"
              defaultValue={defaultPropertyId}
              options={properties.map((p) => ({
                label: `${p.designation} (${p.reference})`,
                value: p.id,
              }))}
              wrapperClassName="w-full"
            />
            {state?.errors?.propertyId && <p className="text-xs text-error">{state.errors.propertyId[0]}</p>}
          </div>

          <div className="flex flex-col gap-xs">
            <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
              Locataire *
            </label>
            <Select
              name="tenantId"
              defaultValue={defaultTenantId}
              options={tenants.map((t) => ({
                label: `${t.firstName || ""} ${t.lastName || ""} ${t.companyName ? `(${t.companyName})` : ""}`.trim() || t.id,
                value: t.id,
              }))}
              wrapperClassName="w-full"
            />
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
              ]}
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
