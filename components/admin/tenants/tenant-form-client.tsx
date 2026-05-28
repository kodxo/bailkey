"use client";

import React, { useActionState, useEffect, useState } from "react";
import { LegalEntityType } from "@/lib/generated/prisma/enums";
import type { TenantDTO } from "@/lib/types/property";
import { tenantFormAction } from "@/lib/actions/tenant.actions";
import { toast } from "sonner";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function TenantFormClient({ tenant }: { tenant?: TenantDTO | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [state, action, isPending] = useActionState(tenantFormAction, {});

  // Controlled state just for conditional rendering based on type
  const [entityType, setEntityType] = useState<LegalEntityType>(
    tenant?.type || LegalEntityType.INDIVIDUAL
  );

  const handleCancel = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("edit");
    if (!tenant) params.delete("selectedId");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast.success(state.message);
        const params = new URLSearchParams(searchParams.toString());
        params.delete("edit");
        if (state.data?.id) {
          params.set("selectedId", state.data.id);
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      } else if (state.success === false && !state.errors) {
        toast.error(state.message);
      } else if (state.success === false && state.errors) {
        toast.error("Veuillez corriger les erreurs.");
      }
    }
  }, [state, pathname, router, searchParams]);

  return (
    <Card className="border-outline-variant/60 shadow-md">
      <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-md flex flex-row items-center justify-between">
        <CardTitle className="text-h3 font-display">
          {tenant ? "Modifier Locataire" : "Nouveau Locataire"}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCancel} type="button">
          Annuler
        </Button>
      </CardHeader>
      <CardContent className="pt-md">
        <form action={action} className="flex flex-col gap-md">
          {tenant && <input type="hidden" name="id" value={tenant.id} />}

          <div className="flex flex-col gap-xs">
            <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
              Type d&apos;entité *
            </label>
            <Select
              name="type"
              value={entityType}
              onChange={(e) => setEntityType(e.target.value as LegalEntityType)}
              options={[
                { label: "Particulier", value: "INDIVIDUAL" },
                { label: "Société", value: "COMPANY" },
              ]}
              wrapperClassName={`border rounded p-1 ${state?.errors?.type ? "border-error" : "border-outline-variant"}`}
            />
            {state?.errors?.type && (
              <span className="text-error text-body-sm">{state.errors.type[0]}</span>
            )}
          </div>

          {entityType === LegalEntityType.INDIVIDUAL ? (
            <div className="grid grid-cols-2 gap-sm">
              <div className="flex flex-col gap-xs">
                <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                  Prénom *
                </label>
                <Input
                  name="firstName"
                  defaultValue={tenant?.firstName || ""}
                  className={state?.errors?.firstName ? "border-error" : ""}
                />
                {state?.errors?.firstName && (
                  <span className="text-error text-body-sm">{state.errors.firstName[0]}</span>
                )}
              </div>
              <div className="flex flex-col gap-xs">
                <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                  Nom de famille *
                </label>
                <Input
                  name="lastName"
                  defaultValue={tenant?.lastName || ""}
                  className={state?.errors?.lastName ? "border-error" : ""}
                />
                {state?.errors?.lastName && (
                  <span className="text-error text-body-sm">{state.errors.lastName[0]}</span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Nom de la Société *
              </label>
              <Input
                name="companyName"
                placeholder="ex: SARL Logistique"
                defaultValue={tenant?.companyName || ""}
                className={state?.errors?.companyName ? "border-error" : ""}
              />
              {state?.errors?.companyName && (
                <span className="text-error text-body-sm">{state.errors.companyName[0]}</span>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-sm">
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Email
              </label>
              <Input
                type="email"
                name="email"
                placeholder="locataire@domaine.com"
                defaultValue={tenant?.email || ""}
                className={state?.errors?.email ? "border-error" : ""}
              />
              {state?.errors?.email && (
                <span className="text-error text-body-sm">{state.errors.email[0]}</span>
              )}
            </div>
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Téléphone *
              </label>
              <Input
                name="phone"
                placeholder="+237 60000000"
                defaultValue={tenant?.phone || ""}
                className={state?.errors?.phone ? "border-error" : ""}
              />
              {state?.errors?.phone && (
                <span className="text-error text-body-sm">{state.errors.phone[0]}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-xs">
            <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
              Adresse Actuelle
            </label>
            <Input
              name="address"
              placeholder="ex: Quartier Bonapriso, Douala"
              defaultValue={tenant?.address || ""}
              className={state?.errors?.address ? "border-error" : ""}
            />
            {state?.errors?.address && (
              <span className="text-error text-body-sm">{state.errors.address[0]}</span>
            )}
          </div>

          {entityType === LegalEntityType.INDIVIDUAL ? (
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                N° Pièce d&apos;identité (CNI / Passeport)
              </label>
              <Input
                name="identityDocument"
                defaultValue={tenant?.identityDocument || ""}
                className={state?.errors?.identityDocument ? "border-error" : ""}
              />
              {state?.errors?.identityDocument && (
                <span className="text-error text-body-sm">{state.errors.identityDocument[0]}</span>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-sm">
              <div className="flex flex-col gap-xs">
                <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                  N° RCCM
                </label>
                <Input
                  name="registrationNumber"
                  defaultValue={tenant?.registrationNumber || ""}
                  className={state?.errors?.registrationNumber ? "border-error" : ""}
                />
                {state?.errors?.registrationNumber && (
                  <span className="text-error text-body-sm">{state.errors.registrationNumber[0]}</span>
                )}
              </div>
              <div className="flex flex-col gap-xs">
                <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                  N° NIU / NIF
                </label>
                <Input
                  name="taxNumber"
                  defaultValue={tenant?.taxNumber || ""}
                  className={state?.errors?.taxNumber ? "border-error" : ""}
                />
                {state?.errors?.taxNumber && (
                  <span className="text-error text-body-sm">{state.errors.taxNumber[0]}</span>
                )}
              </div>
            </div>
          )}

          <Button type="submit" disabled={isPending} className="w-full mt-sm">
            {isPending ? "Enregistrement..." : "Enregistrer le locataire"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
