"use client";

import React, { useState, useTransition } from "react";
import {
  PropertyType,
  PropertyStatus,
} from "@/lib/generated/prisma/enums";
import type { PropertyDTO, OwnerDTO } from "@/lib/types/property";
import { createPropertyAction, updatePropertyAction } from "@/lib/actions/property.actions";
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

  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<{
    reference: string;
    designation: string;
    description: string;
    propertyType: PropertyType;
    address: string;
    city: string;
    area: number | "";
    roomsCount: number | "";
    baseRent: number | "";
    status: PropertyStatus;
    ownerId?: string;
  }>({
    reference: property?.reference || `REF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    designation: property?.designation || "",
    description: property?.description || "",
    propertyType: property?.propertyType || PropertyType.APARTMENT,
    address: property?.address || "",
    city: property?.city || "Douala",
    area: property?.area ?? "",
    roomsCount: property?.roomsCount ?? "",
    baseRent: property?.baseRent ?? "",
    status: property?.status || PropertyStatus.AVAILABLE,
    ownerId: property ? (property.owners?.[0]?.id || "") : (initialOwners[0]?.id || ""),
  });

  const handleCancel = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("edit");
    if (!property) params.delete("selectedId");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.designation || !formData.reference || formData.baseRent === "") {
      toast.error("Veuillez remplir les champs obligatoires.");
      return;
    }

    startTransition(async () => {
      const payload = {
        reference: formData.reference,
        designation: formData.designation,
        description: formData.description || null,
        propertyType: formData.propertyType,
        address: formData.address,
        city: formData.city,
        area: formData.area === "" ? null : Number(formData.area),
        roomsCount: formData.roomsCount === "" ? null : Number(formData.roomsCount),
        baseRent: Number(formData.baseRent),
        status: formData.status,
        ...(formData.ownerId && { ownerId: formData.ownerId }),
      };

      if (property) {
        const res = await updatePropertyAction(property.id, payload);
        if (res.success) {
          toast.success("Propriété mise à jour avec succès.");
          handleCancel();
        } else {
          toast.error(res.error || "Erreur de mise à jour.");
        }
      } else {
        const res = await createPropertyAction(payload);
        if (res.success && res.property) {
          toast.success("Propriété créée avec succès.");
          const params = new URLSearchParams(searchParams.toString());
          params.delete("edit");
          params.set("selectedId", res.property.id);
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        } else {
          toast.error(res.error || "Erreur de création.");
        }
      }
    });
  };

  return (
    <Card className="border-outline-variant/60 shadow-md">
      <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-md flex flex-row items-center justify-between">
        <CardTitle className="text-h3 font-display">
          {property ? "Modifier Propriété" : "Nouvelle Propriété"}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCancel}>
          Annuler
        </Button>
      </CardHeader>
      <CardContent className="pt-md">
        <form onSubmit={handleSave} className="flex flex-col gap-md">
          <div className="flex flex-col gap-xs">
            <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
              Référence *
            </label>
            <Input
              required
              value={formData.reference}
              disabled={!!property}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-xs">
            <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
              Désignation *
            </label>
            <Input
              required
              placeholder="ex: Bel Appartement F4 Akwa"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Type
              </label>
              <Select
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as PropertyType })}
                options={[
                  { label: "Appartement", value: "APARTMENT" },
                  { label: "Villa", value: "VILLA" },
                  { label: "Studio", value: "STUDIO" },
                  { label: "Commercial", value: "COMMERCIAL_SPACE" },
                  { label: "Terrain", value: "LAND" },
                  { label: "Entrepôt", value: "WAREHOUSE" },
                ]}
                wrapperClassName="border border-outline-variant rounded p-1"
              />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Statut
              </label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as PropertyStatus })}
                options={[
                  { label: "Disponible", value: "AVAILABLE" },
                  { label: "Loué", value: "RENTED" },
                  { label: "En travaux", value: "UNDER_MAINTENANCE" },
                  { label: "Indisponible", value: "UNAVAILABLE" },
                ]}
                wrapperClassName="border border-outline-variant rounded p-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Ville *
              </label>
              <Input
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Loyer Mensuel *
              </label>
              <Input
                required
                type="number"
                placeholder="ex: 250000"
                value={formData.baseRent}
                onChange={(e) => setFormData({ ...formData, baseRent: e.target.value === "" ? "" : Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-xs">
            <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
              Adresse complète *
            </label>
            <Input
              required
              placeholder="ex: Rue Drouot, Akwa"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Surface (m²)
              </label>
              <Input
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value === "" ? "" : Number(e.target.value) })}
              />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Nb Pièces
              </label>
              <Input
                type="number"
                value={formData.roomsCount}
                onChange={(e) => setFormData({ ...formData, roomsCount: e.target.value === "" ? "" : Number(e.target.value) })}
              />
            </div>
          </div>

          {!property && initialOwners.length > 0 && (
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Propriétaire Principal
              </label>
              <Select
                value={formData.ownerId}
                onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
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
              rows={3}
              className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded text-body-md focus:border-primary focus:outline-hidden"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full mt-sm">
            {isPending ? "Enregistrement..." : "Enregistrer la propriété"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
