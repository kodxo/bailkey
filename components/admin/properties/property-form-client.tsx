"use client";

import React, { useActionState, useEffect } from "react";
import { PropertyType, PropertyStatus } from "@/lib/generated/prisma/enums";
import type { PropertyDTO, OwnerDTO } from "@/lib/types/property";
import { propertyFormAction } from "@/lib/actions/property.actions";
import { toast } from "sonner";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function PropertyFormClient({
  property,
  initialOwners,
}: {
  property?: PropertyDTO | null;
  initialOwners: OwnerDTO[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [state, action, isPending] = useActionState(propertyFormAction, {});

  const handleCancel = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("edit");
    if (!property) params.delete("selectedId");
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
          {property ? "Modifier Propriété" : "Nouvelle Propriété"}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCancel} type="button">
          Annuler
        </Button>
      </CardHeader>
      <CardContent className="pt-md">
        <form action={action} className="flex flex-col gap-md">
          {property && <input type="hidden" name="id" value={property.id} />}

          <div className="flex flex-col gap-xs">
            <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
              Référence *
            </label>
            <Input
              name="reference"
              defaultValue={property?.reference || `REF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`}
              readOnly={!!property}
              className={state?.errors?.reference ? "border-error" : ""}
            />
            {state?.errors?.reference && (
              <span className="text-error text-body-sm">{state.errors.reference[0]}</span>
            )}
          </div>

          <div className="flex flex-col gap-xs">
            <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
              Désignation *
            </label>
            <Input
              name="designation"
              placeholder="ex: Bel Appartement F4 Akwa"
              defaultValue={property?.designation || ""}
              className={state?.errors?.designation ? "border-error" : ""}
            />
            {state?.errors?.designation && (
              <span className="text-error text-body-sm">{state.errors.designation[0]}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Type
              </label>
              <Select
                name="propertyType"
                defaultValue={property?.propertyType || PropertyType.APARTMENT}
                options={[
                  { label: "Appartement", value: "APARTMENT" },
                  { label: "Villa", value: "VILLA" },
                  { label: "Studio", value: "STUDIO" },
                  { label: "Commercial", value: "COMMERCIAL_SPACE" },
                  { label: "Terrain", value: "LAND" },
                  { label: "Entrepôt", value: "WAREHOUSE" },
                ]}
                wrapperClassName={`border rounded p-1 ${state?.errors?.propertyType ? "border-error" : "border-outline-variant"}`}
              />
              {state?.errors?.propertyType && (
                <span className="text-error text-body-sm">{state.errors.propertyType[0]}</span>
              )}
            </div>
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Statut
              </label>
              <Select
                name="status"
                defaultValue={property?.status || PropertyStatus.AVAILABLE}
                options={[
                  { label: "Disponible", value: "AVAILABLE" },
                  { label: "Loué", value: "RENTED" },
                  { label: "En travaux", value: "UNDER_MAINTENANCE" },
                  { label: "Indisponible", value: "UNAVAILABLE" },
                ]}
                wrapperClassName={`border rounded p-1 ${state?.errors?.status ? "border-error" : "border-outline-variant"}`}
              />
              {state?.errors?.status && (
                <span className="text-error text-body-sm">{state.errors.status[0]}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Ville *
              </label>
              <Input
                name="city"
                defaultValue={property?.city || "Douala"}
                className={state?.errors?.city ? "border-error" : ""}
              />
              {state?.errors?.city && (
                <span className="text-error text-body-sm">{state.errors.city[0]}</span>
              )}
            </div>
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Loyer Mensuel *
              </label>
              <Input
                type="number"
                name="baseRent"
                placeholder="ex: 250000"
                defaultValue={property?.baseRent ?? ""}
                className={state?.errors?.baseRent ? "border-error" : ""}
              />
              {state?.errors?.baseRent && (
                <span className="text-error text-body-sm">{state.errors.baseRent[0]}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-xs">
            <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
              Adresse complète *
            </label>
            <Input
              name="address"
              placeholder="ex: Rue Drouot, Akwa"
              defaultValue={property?.address || ""}
              className={state?.errors?.address ? "border-error" : ""}
            />
            {state?.errors?.address && (
              <span className="text-error text-body-sm">{state.errors.address[0]}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Surface (m²)
              </label>
              <Input
                type="number"
                name="area"
                defaultValue={property?.area ?? ""}
                className={state?.errors?.area ? "border-error" : ""}
              />
              {state?.errors?.area && (
                <span className="text-error text-body-sm">{state.errors.area[0]}</span>
              )}
            </div>
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Nb Pièces
              </label>
              <Input
                type="number"
                name="roomsCount"
                defaultValue={property?.roomsCount ?? ""}
                className={state?.errors?.roomsCount ? "border-error" : ""}
              />
              {state?.errors?.roomsCount && (
                <span className="text-error text-body-sm">{state.errors.roomsCount[0]}</span>
              )}
            </div>
          </div>

          {!property && initialOwners.length > 0 && (
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Propriétaire Principal
              </label>
              <Select
                name="ownerId"
                defaultValue={initialOwners[0]?.id || ""}
                options={initialOwners.map((o) => ({
                  label: `${o.firstName || ""} ${o.lastName || ""} ${o.companyName ? `(${o.companyName})` : ""}`.trim() || o.id,
                  value: o.id,
                }))}
                wrapperClassName="border border-outline-variant rounded p-1"
              />
            </div>
          )}

          <div className="flex flex-col gap-xs">
            <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              defaultValue={property?.description || ""}
              className={`w-full bg-surface-container-lowest border p-2 rounded text-body-md focus:border-primary focus:outline-hidden ${state?.errors?.description ? "border-error" : "border-outline-variant"}`}
            />
            {state?.errors?.description && (
              <span className="text-error text-body-sm">{state.errors.description[0]}</span>
            )}
          </div>

          <Button type="submit" disabled={isPending} className="w-full mt-sm">
            {isPending ? "Enregistrement..." : "Enregistrer la propriété"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
