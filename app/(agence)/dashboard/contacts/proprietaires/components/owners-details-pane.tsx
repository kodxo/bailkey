"use client";

import React, { useState, useTransition } from "react";
import { LegalEntityType } from "@/lib/generated/prisma/enums";
import type { OwnerDTO } from "@/lib/types/property";
import { createOwnerAction, updateOwnerAction } from "@/lib/actions/owner.actions";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface OwnersDetailsPaneProps {
  selectedOwner: OwnerDTO | null;
  mode: "view" | "create" | "edit";
}

export function OwnersDetailsPane({
  selectedOwner,
  mode,
}: OwnersDetailsPaneProps): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isEditing = mode === "create" || mode === "edit";
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
    type: selectedOwner?.type || LegalEntityType.INDIVIDUAL,
    firstName: selectedOwner?.firstName || "",
    lastName: selectedOwner?.lastName || "",
    companyName: selectedOwner?.companyName || "",
    email: selectedOwner?.email || "",
    phone: selectedOwner?.phone || "",
    address: selectedOwner?.address || "",
    identityDocument: selectedOwner?.identityDocument || "",
    registrationNumber: selectedOwner?.registrationNumber || "",
    taxNumber: selectedOwner?.taxNumber || "",
  });

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("selectedId");
    params.delete("mode");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleCancelEdit = () => {
    if (mode === "create") {
      handleClose();
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("mode");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  const handleStartEdit = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", "edit");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const isCompany = formData.type === LegalEntityType.COMPANY;

    if (isCompany && !formData.companyName) {
      toast.error("Veuillez saisir la raison sociale.");
      return;
    }
    if (!isCompany && (!formData.firstName || !formData.lastName)) {
      toast.error("Veuillez saisir le nom et le prénom.");
      return;
    }

    startTransition(async () => {
      const payload = {
        type: formData.type,
        firstName: !isCompany ? formData.firstName : null,
        lastName: !isCompany ? formData.lastName : null,
        companyName: isCompany ? formData.companyName : null,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
        identityDocument: !isCompany ? formData.identityDocument || null : null,
        registrationNumber: isCompany ? formData.registrationNumber || null : null,
        taxNumber: isCompany ? formData.taxNumber || null : null,
      };

      if (mode === "edit" && selectedOwner) {
        const res = await updateOwnerAction(selectedOwner.id, payload);
        if (res.success) {
          toast.success("Propriétaire mis à jour avec succès.");
          handleCancelEdit();
          router.refresh();
        } else {
          toast.error(res.error || "Erreur lors de la mise à jour.");
        }
      } else {
        const res = await createOwnerAction(payload);
        if (res.success && res.owner) {
          toast.success("Propriétaire créé avec succès.");
          const params = new URLSearchParams(searchParams.toString());
          params.set("selectedId", res.owner.id);
          params.delete("mode");
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
          router.refresh();
        } else {
          toast.error(res.error || "Erreur lors de la création.");
        }
      }
    });
  };

  if (!selectedOwner && mode !== "create") {
    return (
      <Card className="border-outline-variant/60 shadow-md rounded-none overflow-hidden h-full min-h-[400px] flex items-center justify-center bg-surface-container-lowest relative">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-tertiary/5 pointer-events-none" />
        <CardContent className="p-xl flex flex-col items-center justify-center text-center text-on-surface-variant relative z-10 ">
          <div className="w-24 h-24 mb-6 rounded-full bg-surface flex items-center justify-center shadow-inner border border-outline-variant/30 ring-4 ring-primary/5">
            <span
              className="material-symbols-outlined text-[48px] text-primary/40"
              data-icon="real_estate_agent"
            >
              real_estate_agent
            </span>
          </div>
          <h3 className="text-h3 font-display text-on-surface mb-2">
            Gestion des Propriétaires
          </h3>
          <p className="font-body-md text-body-md leading-relaxed">
            Sélectionnez un propriétaire pour voir ses détails,
            ou cliquez sur "Nouveau Propriétaire".
          </p>
        </CardContent>
      </Card>
    );
  }

  const isCompany = formData.type === LegalEntityType.COMPANY;

  return (
    <Card className="border-outline-variant/60 shadow-md overflow-hidden flex flex-col h-full max-h-[calc(100vh-140px)]">
      <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-sm flex flex-col gap-2 shrink-0">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-h3 font-display">
            {mode === "create"
              ? "Nouveau Propriétaire"
              : mode === "edit"
                ? "Modifier Propriétaire"
                : "Fiche Propriétaire"}
          </CardTitle>
          <div className="flex gap-2">
             {!isEditing && (
                <Button variant="outline" size="sm" onClick={handleStartEdit}>
                  <span className="material-symbols-outlined text-[16px] mr-1">edit</span> Éditer
                </Button>
             )}
            <Button
              variant="ghost"
              size="sm"
              onClick={isEditing ? handleCancelEdit : handleClose}
              className="h-8 w-8 p-0 rounded-full text-on-surface-variant hover:bg-surface-variant"
            >
              <span
                className="material-symbols-outlined text-sm select-none"
                data-icon="close"
              >
                close
              </span>
            </Button>
          </div>
        </div>

        {!isEditing && selectedOwner && (
          <div className="flex items-center gap-3 mt-2">
             <Avatar
                fallback={selectedOwner.type === LegalEntityType.COMPANY ? (selectedOwner.companyName?.charAt(0) || "C") : (selectedOwner.firstName?.charAt(0) || "U")}
                size="lg"
                className="rounded-full bg-primary/10 text-primary"
             />
             <div className="flex flex-col">
               <span className="text-h4 font-bold text-on-surface">
                  {selectedOwner.type === LegalEntityType.COMPANY
                    ? selectedOwner.companyName
                    : `${selectedOwner.firstName} ${selectedOwner.lastName}`}
               </span>
               <span className="text-body-sm text-on-surface-variant flex items-center gap-1">
                 <span className="material-symbols-outlined text-[14px]">
                   {selectedOwner.type === LegalEntityType.COMPANY ? "domain" : "person"}
                 </span>
                 {selectedOwner.type === LegalEntityType.COMPANY ? "Personne Morale" : "Personne Physique"}
               </span>
             </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-md overflow-y-auto flex-1">
        {isEditing ? (
          <form id="owner-form" onSubmit={handleSave} className="flex flex-col gap-md animate-fade-in">
            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Type de propriétaire *
              </label>
              <Select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as LegalEntityType })
                }
                options={[
                  { label: "Personne Physique (Particulier)", value: "INDIVIDUAL" },
                  { label: "Personne Morale (Entreprise/SCI)", value: "COMPANY" },
                ]}
                wrapperClassName="border border-outline-variant rounded p-1"
              />
            </div>

            {isCompany ? (
              <div className="flex flex-col gap-xs">
                <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                  Raison Sociale *
                </label>
                <Input
                  required
                  placeholder="ex: SCI Les Oliviers"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-sm">
                <div className="flex flex-col gap-xs">
                  <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                    Prénom *
                  </label>
                  <Input
                    required
                    placeholder="ex: Jean"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                    Nom *
                  </label>
                  <Input
                    required
                    placeholder="ex: Dupont"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-sm">
              <div className="flex flex-col gap-xs">
                <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="email@exemple.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                  Téléphone
                </label>
                <Input
                  type="tel"
                  placeholder="+237 600000000"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-xs">
              <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                Adresse
              </label>
              <Input
                placeholder="Adresse complète"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>

            {isCompany ? (
              <div className="grid grid-cols-2 gap-sm">
                <div className="flex flex-col gap-xs">
                  <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                    RCCM
                  </label>
                  <Input
                    placeholder="Numéro RCCM"
                    value={formData.registrationNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, registrationNumber: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                    NIU / NIF
                  </label>
                  <Input
                    placeholder="Numéro d'Identification"
                    value={formData.taxNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, taxNumber: e.target.value })
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-xs">
                <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                  N° CNI / Passeport
                </label>
                <Input
                  placeholder="Numéro de pièce d'identité"
                  value={formData.identityDocument}
                  onChange={(e) =>
                    setFormData({ ...formData, identityDocument: e.target.value })
                  }
                />
              </div>
            )}
          </form>
        ) : (
          /* VIEW MODE */
          selectedOwner && (
            <div className="flex flex-col gap-md animate-fade-in">
              <div className="bg-surface-container-lowest border border-outline-variant/40 p-sm rounded flex flex-col gap-3">
                <h4 className="font-bold text-on-surface border-b border-outline-variant/40 pb-2">
                  Coordonnées
                </h4>
                <div className="grid grid-cols-2 gap-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-label-caps text-on-surface-variant font-semibold">Email</span>
                    <span className="text-body-md">{selectedOwner.email || "Non renseigné"}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-label-caps text-on-surface-variant font-semibold">Téléphone</span>
                    <span className="text-body-md">{selectedOwner.phone || "Non renseigné"}</span>
                  </div>
                  <div className="flex flex-col gap-1 col-span-2">
                    <span className="text-label-caps text-on-surface-variant font-semibold">Adresse</span>
                    <span className="text-body-md">{selectedOwner.address || "Non renseignée"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant/40 p-sm rounded flex flex-col gap-3">
                <h4 className="font-bold text-on-surface border-b border-outline-variant/40 pb-2">
                  Informations Légales
                </h4>
                <div className="grid grid-cols-2 gap-y-4">
                  {selectedOwner.type === LegalEntityType.COMPANY ? (
                    <>
                      <div className="flex flex-col gap-1">
                        <span className="text-label-caps text-on-surface-variant font-semibold">RCCM</span>
                        <span className="text-body-md">{selectedOwner.registrationNumber || "Non renseigné"}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-label-caps text-on-surface-variant font-semibold">NIU / NIF</span>
                        <span className="text-body-md">{selectedOwner.taxNumber || "Non renseigné"}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-1 col-span-2">
                      <span className="text-label-caps text-on-surface-variant font-semibold">Pièce d'identité</span>
                      <span className="text-body-md">{selectedOwner.identityDocument || "Non renseignée"}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant/40 p-sm rounded flex flex-col gap-3">
                <div className="flex justify-between items-center border-b border-outline-variant/40 pb-2">
                   <h4 className="font-bold text-on-surface">Activité</h4>
                   <Badge variant="secondary">{selectedOwner.propertiesCount} Bien(s) Immobiliers(s)</Badge>
                </div>
              </div>
            </div>
          )
        )}
      </CardContent>

      {/* Footer sticky area */}
      {isEditing && (
        <div className="bg-surface-container-low border-t border-outline-variant/40 p-sm shrink-0 flex gap-2">
           <Button
              type="submit"
              form="owner-form"
              className="flex-1"
              disabled={isPending}
           >
              {isPending ? "Enregistrement..." : "Enregistrer"}
           </Button>
           <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={isPending}>
             Annuler
           </Button>
        </div>
      )}
    </Card>
  );
}
