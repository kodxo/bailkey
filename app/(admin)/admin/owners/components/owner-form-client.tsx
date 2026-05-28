"use client";

import React, { useState, useTransition } from "react";
import { LegalEntityType } from "@/lib/generated/prisma/enums";
import type { OwnerDTO } from "@/lib/types/property";
import { createOwnerAction, updateOwnerAction } from "@/lib/actions/owner.actions";
import { toast } from "sonner";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function OwnerFormClient({ owner }: { owner?: OwnerDTO | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<{
    type: LegalEntityType;
    firstName: string;
    lastName: string;
    companyName: string;
    email: string;
    phone: string;
    address: string;
    identityDocument: string;
    registrationNumber: string;
    taxNumber: string;
  }>({
    type: owner?.type || LegalEntityType.INDIVIDUAL,
    firstName: owner?.firstName || "",
    lastName: owner?.lastName || "",
    companyName: owner?.companyName || "",
    email: owner?.email || "",
    phone: owner?.phone || "",
    address: owner?.address || "",
    identityDocument: owner?.identityDocument || "",
    registrationNumber: owner?.registrationNumber || "",
    taxNumber: owner?.taxNumber || "",
  });

  const handleCancel = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("edit");
    if (!owner) params.delete("selectedId");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.type === LegalEntityType.INDIVIDUAL &&
      !formData.firstName &&
      !formData.lastName
    ) {
      toast.error("Veuillez saisir un nom et un prénom.");
      return;
    }
    if (formData.type === LegalEntityType.COMPANY && !formData.companyName) {
      toast.error("Veuillez saisir le nom de la société.");
      return;
    }

    startTransition(async () => {
      const payload = {
        type: formData.type,
        firstName: formData.firstName || null,
        lastName: formData.lastName || null,
        companyName: formData.companyName || null,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
        identityDocument: formData.identityDocument || null,
        registrationNumber: formData.registrationNumber || null,
        taxNumber: formData.taxNumber || null,
      };

      if (owner) {
        const res = await updateOwnerAction(owner.id, payload);
        if (res.success) {
          toast.success("Propriétaire mis à jour avec succès.");
          handleCancel();
        } else {
          toast.error(res.error || "Erreur de mise à jour.");
        }
      } else {
        const res = await createOwnerAction(payload);
        if (res.success && res.owner) {
          toast.success("Propriétaire créé avec succès.");
          const params = new URLSearchParams(searchParams.toString());
          params.delete("edit");
          params.set("selectedId", res.owner.id);
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
          {owner ? "Modifier Propriétaire" : "Nouveau Propriétaire"}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={handleCancel}>
          Annuler
        </Button>
      </CardHeader>
      <CardContent className="pt-md">
        <form onSubmit={handleSave} className="flex flex-col gap-md">
          <div className="flex flex-col gap-xs">
            <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
              Type d&apos;entité *
            </label>
            <Select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as LegalEntityType,
                })
              }
              options={[
                { label: "Particulier", value: "INDIVIDUAL" },
                { label: "Société", value: "COMPANY" },
              ]}
              wrapperClassName="border border-outline-variant rounded p-1"
            />
          </div>

          {formData.type === LegalEntityType.INDIVIDUAL ? (
            <div className="grid grid-cols-2 gap-sm">
              <div className="flex flex-col gap-xs">
                <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                  Prénom *
                </label>
                <Input
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                  Nom de famille *
                </label>
                <Input
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Nom de la Société *
              </label>
              <Input
                required
                placeholder="ex: SCI Akwa Immo"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-sm">
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Email
              </label>
              <Input
                type="email"
                placeholder="contact@domaine.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Téléphone *
              </label>
              <Input
                required
                placeholder="+237 60000000"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-xs">
            <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
              Adresse Postale
            </label>
            <Input
              placeholder="ex: BP 1234, Douala"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>

          {formData.type === LegalEntityType.INDIVIDUAL ? (
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                N° Pièce d&apos;identité (CNI / Passeport)
              </label>
              <Input
                value={formData.identityDocument}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    identityDocument: e.target.value,
                  })
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-sm">
              <div className="flex flex-col gap-xs">
                <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                  N° RCCM
                </label>
                <Input
                  value={formData.registrationNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registrationNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                  N° NIU / NIF
                </label>
                <Input
                  value={formData.taxNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      taxNumber: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full mt-sm"
          >
            {isPending ? "Enregistrement..." : "Enregistrer le propriétaire"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
