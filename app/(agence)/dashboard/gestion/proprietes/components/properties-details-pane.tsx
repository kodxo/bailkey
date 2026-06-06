"use client";

import React, { useState, useTransition } from "react";
import { PropertyType, PropertyStatus } from "@/lib/generated/prisma/enums";
import type { PropertyDTO, OwnerDTO } from "@/lib/types/property";
import { createPropertyAction, updatePropertyAction } from "@/lib/actions/property.actions";
import { uploadService } from "@/lib/services/property.service";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { RelationalFieldWrapper, RelationalLink } from "@/components/ui/relational-link";

interface FormImageDTO {
  url: string;
  fileKey: string;
  isCover: boolean;
  caption: string | null;
  sortOrder: number;
}

interface FormOwnerDTO {
  ownerId: string;
  share: number;
}

interface PropertiesDetailsPaneProps {
  selectedProperty: PropertyDTO | null;
  allOwners: OwnerDTO[];
  mode: "view" | "create" | "edit";
}

export function PropertiesDetailsPane({
  selectedProperty,
  allOwners,
  mode,
}: PropertiesDetailsPaneProps): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isEditing = mode === "create" || mode === "edit";
  const [activeTab, setActiveTab] = useState<"info" | "owners" | "media">("info");
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Form State
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
  }>({
    reference: selectedProperty?.reference || (mode === "create" ? `REF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}` : ""),
    designation: selectedProperty?.designation || "",
    description: selectedProperty?.description || "",
    propertyType: selectedProperty?.propertyType || PropertyType.APARTMENT,
    address: selectedProperty?.address || "",
    city: selectedProperty?.city || "Douala",
    area: selectedProperty?.area ?? "",
    roomsCount: selectedProperty?.roomsCount ?? "",
    baseRent: selectedProperty?.baseRent ?? "",
    status: selectedProperty?.status || PropertyStatus.AVAILABLE,
  });

  const [formOwners, setFormOwners] = useState<FormOwnerDTO[]>(
    selectedProperty 
      ? selectedProperty.owners.map((o) => ({ ownerId: o.id, share: o.share }))
      : (allOwners.length > 0 ? [{ ownerId: allOwners[0].id, share: 100 }] : [])
  );

  const [formImages, setFormImages] = useState<FormImageDTO[]>(
    selectedProperty
      ? selectedProperty.images.map((img) => ({
          url: img.url,
          fileKey: img.fileKey,
          isCover: img.isCover,
          caption: img.caption,
          sortOrder: img.sortOrder,
        }))
      : []
  );

  const [newImgUrl, setNewImgUrl] = useState<string>("");
  const [newImgCaption, setNewImgCaption] = useState<string>("");

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

  const handleAddOwnerShare = () => {
    if (allOwners.length === 0) return;
    const existingIds = new Set(formOwners.map((o) => o.ownerId));
    const available = allOwners.find((o) => !existingIds.has(o.id));
    if (!available) {
      toast.error("Tous les propriétaires disponibles sont déjà dans la liste.");
      return;
    }
    setFormOwners([...formOwners, { ownerId: available.id, share: 0 }]);
  };

  const handleRemoveOwnerShare = (index: number) => {
    setFormOwners(formOwners.filter((_, idx) => idx !== index));
  };

  const handleUpdateOwnerShare = (index: number, newId: string, newShare: number) => {
    const copy = [...formOwners];
    if (copy[index]) {
      copy[index] = { ownerId: newId, share: Number(newShare) };
      setFormOwners(copy);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading("Envoi vers Cloudflare R2 en cours...");
    try {
      const res = await uploadService.uploadFileToR2(file, "properties");
      if (res.success && res.url && res.fileKey) {
        const newImg: FormImageDTO = {
          url: res.url,
          fileKey: res.fileKey,
          isCover: formImages.length === 0,
          caption: file.name.split(".")[0],
          sortOrder: formImages.length,
        };
        setFormImages((prev) => [...prev, newImg]);
        toast.success("Image envoyée avec succès sur R2 !", { id: toastId });
      } else {
        toast.error(res.error || "Échec de l'envoi sur R2.", { id: toastId });
      }
    } catch (err) {
      toast.error("Erreur inattendue lors de l'envoi du fichier.", {
        id: toastId,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddCustomImage = () => {
    if (!newImgUrl) {
      toast.error("Veuillez saisir une URL d'image valide.");
      return;
    }
    const newImg: FormImageDTO = {
      url: newImgUrl,
      fileKey: `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      isCover: formImages.length === 0,
      caption: newImgCaption || "Photo de la propriété",
      sortOrder: formImages.length,
    };
    setFormImages([...formImages, newImg]);
    setNewImgUrl("");
    setNewImgCaption("");
    toast.success("Image ajoutée au carrousel.");
  };

  const handleRemoveImage = (index: number) => {
    const updated = formImages.filter((_, idx) => idx !== index);
    if (updated.length > 0 && !updated.some((i) => i.isCover)) {
      if (updated[0]) updated[0].isCover = true;
    }
    setFormImages(updated);
  };

  const handleSetCoverImage = (index: number) => {
    setFormImages(
      formImages.map((img, idx) => ({
        ...img,
        isCover: idx === index,
      })),
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.designation ||
      !formData.reference ||
      formData.baseRent === ""
    ) {
      toast.error("Veuillez remplir les champs obligatoires.");
      return;
    }

    if (formOwners.length > 0) {
      const totalShare = formOwners.reduce(
        (acc, o) => acc + Number(o.share),
        0,
      );
      if (Math.abs(totalShare - 100) > 0.01) {
        toast.error(
          `La somme des parts d'indivision doit être de 100% (actuelle: ${totalShare}%)`,
        );
        setActiveTab("owners");
        return;
      }
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
        roomsCount:
          formData.roomsCount === "" ? null : Number(formData.roomsCount),
        baseRent: Number(formData.baseRent),
        status: formData.status,
        owners: formOwners.map((o) => ({
          ownerId: o.ownerId,
          share: Number(o.share),
        })),
        images: formImages.map((img, idx) => ({
          url: img.url,
          fileKey: img.fileKey,
          isCover: img.isCover,
          caption: img.caption,
          sortOrder: idx,
        })),
      };

      if (mode === "edit" && selectedProperty) {
        const res = await updatePropertyAction(selectedProperty.id, payload);
        if (res.success && res.property) {
          toast.success("Propriété mise à jour avec succès.");
          handleCancelEdit(); // switch to view mode
          router.refresh();
        } else {
          toast.error(res.error || "Erreur lors de la mise à jour.");
        }
      } else {
        const res = await createPropertyAction(payload);
        if (res.success && res.property) {
          toast.success("Propriété créée avec succès.");
          const params = new URLSearchParams(searchParams.toString());
          params.set("selectedId", res.property.id);
          params.delete("mode");
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
          router.refresh();
        } else {
          toast.error(res.error || "Erreur lors de la création.");
        }
      }
    });
  };

  if (!selectedProperty && mode !== "create") {
    return (
      <Card className="border-outline-variant/60 shadow-md rounded-none overflow-hidden h-full min-h-[400px] flex items-center justify-center bg-surface-container-lowest relative">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-tertiary/5 pointer-events-none" />
        <CardContent className="p-xl flex flex-col items-center justify-center text-center text-on-surface-variant relative z-10 ">
          <div className="w-24 h-24 mb-6 rounded-full bg-surface flex items-center justify-center shadow-inner border border-outline-variant/30 ring-4 ring-primary/5">
            <span
              className="material-symbols-outlined text-[48px] text-primary/40"
              data-icon="home_work"
            >
              home_work
            </span>
          </div>
          <h3 className="text-h3 font-display text-on-surface mb-2">
            Gestion de Propriété
          </h3>
          <p className="font-body-md text-body-md leading-relaxed">
            Sélectionnez une propriété dans la liste pour voir ses détails,
            ou cliquez sur "Nouvelle Propriété" pour en ajouter une.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-outline-variant/60 shadow-md overflow-hidden flex flex-col h-full max-h-[calc(100vh-140px)]">
      <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-sm flex flex-col gap-2 shrink-0">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-h3 font-display">
            {mode === "create"
              ? "Nouvelle Propriété"
              : mode === "edit"
                ? "Modifier Propriété"
                : "Fiche Propriété"}
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

        {/* Tabs Header */}
        <div className="flex border-b border-outline-variant/60 pt-2 gap-4 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === "info"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Informations
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("owners")}
            className={`pb-2 border-b-2 transition-colors flex items-center gap-1 ${
              activeTab === "owners"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Bailleurs
            <span className="px-1.5 py-0.5 text-xs bg-surface-container-high rounded-full">
              {isEditing
                ? formOwners.length
                : selectedProperty?.owners?.length || 0}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("media")}
            className={`pb-2 border-b-2 transition-colors flex items-center gap-1 ${
              activeTab === "media"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Photos
            <span className="px-1.5 py-0.5 text-xs bg-surface-container-high rounded-full">
              {isEditing
                ? formImages.length
                : selectedProperty?.images?.length || 0}
            </span>
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-md overflow-y-auto flex-1">
        {isEditing ? (
          <form id="property-form" onSubmit={handleSave} className="flex flex-col gap-md">
            {/* TAB 1: INFORMATIONS */}
            {activeTab === "info" && (
              <div className="flex flex-col gap-md animate-fade-in">
                <div className="flex flex-col gap-xs">
                  <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                    Référence *
                  </label>
                  <Input
                    required
                    value={formData.reference}
                    disabled={mode === "edit"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reference: e.target.value,
                      })
                    }
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        designation: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-sm">
                  <div className="flex flex-col gap-xs">
                    <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                      Type
                    </label>
                    <Select
                      value={formData.propertyType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          propertyType: e.target.value as PropertyType,
                        })
                      }
                      options={[
                        { label: "Appartement", value: "APARTMENT" },
                        { label: "Villa", value: "VILLA" },
                        { label: "Studio", value: "STUDIO" },
                        {
                          label: "Commercial",
                          value: "COMMERCIAL_SPACE",
                        },
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as PropertyStatus,
                        })
                      }
                      options={[
                        { label: "Disponible", value: "AVAILABLE" },
                        { label: "Loué", value: "RENTED" },
                        {
                          label: "En travaux",
                          value: "UNDER_MAINTENANCE",
                        },
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
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          baseRent:
                            e.target.value === ""
                              ? ""
                              : Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: BAILLEURS */}
            {activeTab === "owners" && (
              <div className="flex flex-col gap-md animate-fade-in">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-body-sm text-on-surface-variant max-w-[80%]">
                    Définissez les propriétaires et leurs parts. Le total doit faire 100%.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddOwnerShare}
                  >
                    Ajouter
                  </Button>
                </div>

                {formOwners.map((owner, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 items-center bg-surface-container-lowest border border-outline-variant/40 p-2 rounded"
                  >
                    <div className="flex-1 flex flex-col gap-1">
                      <label className="text-xs font-bold text-on-surface-variant">
                        Propriétaire
                      </label>
                      <RelationalFieldWrapper entityType="owner" entityId={owner.ownerId}>
                        <Select
                          value={owner.ownerId}
                          onChange={(e) =>
                            handleUpdateOwnerShare(idx, e.target.value, owner.share)
                          }
                          options={allOwners.map((o) => ({
                            label: `${o.firstName} ${o.lastName || ""} ${o.companyName || ""}`.trim(),
                            value: o.id,
                          }))}
                          wrapperClassName="border border-outline-variant rounded p-1 w-full"
                        />
                      </RelationalFieldWrapper>
                    </div>
                    <div className="w-24 flex flex-col gap-1">
                      <label className="text-xs font-bold text-on-surface-variant">
                        Part (%)
                      </label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={owner.share}
                        onChange={(e) =>
                          handleUpdateOwnerShare(idx, owner.ownerId, Number(e.target.value))
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOwnerShare(idx)}
                      className="mt-5 text-error"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: PHOTOS */}
            {activeTab === "media" && (
              <div className="flex flex-col gap-md animate-fade-in">
                <div className="bg-primary/5 border border-primary/20 rounded p-sm flex flex-col gap-2">
                  <h4 className="font-bold text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                    Uploader une image
                  </h4>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </div>
                  {isUploading && <p className="text-xs text-on-surface-variant animate-pulse">Upload en cours...</p>}
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/40 p-sm rounded flex flex-col gap-2">
                  <h4 className="font-bold text-on-surface">Ou Ajouter par URL</h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="URL de l'image"
                      value={newImgUrl}
                      onChange={(e) => setNewImgUrl(e.target.value)}
                      wrapperClassName="flex-1"
                    />
                    <Input
                      placeholder="Légende (optionnel)"
                      value={newImgCaption}
                      onChange={(e) => setNewImgCaption(e.target.value)}
                      wrapperClassName="flex-1"
                    />
                    <Button type="button" onClick={handleAddCustomImage}>
                      Ajouter
                    </Button>
                  </div>
                </div>

                {formImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-sm mt-2">
                    {formImages.map((img, idx) => (
                      <div key={idx} className="relative group rounded overflow-hidden border border-outline-variant/40 aspect-video bg-surface-container">
                        <img src={img.url} alt="Aperçu" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <div className="flex justify-between">
                            <Badge variant={img.isCover ? "default" : "secondary"}>
                              {img.isCover ? "Principale" : "Secondaire"}
                            </Badge>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="text-white hover:text-error bg-black/50 rounded-full w-6 h-6 flex items-center justify-center"
                            >
                              <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                          </div>
                          {!img.isCover && (
                            <button
                              type="button"
                              onClick={() => handleSetCoverImage(idx)}
                              className="text-xs bg-white text-black py-1 px-2 rounded font-bold hover:bg-gray-200"
                            >
                              Définir Principale
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </form>
        ) : (
          /* VIEW MODE */
          selectedProperty && (
             <div className="flex flex-col gap-md">
                {activeTab === "info" && (
                  <div className="flex flex-col gap-sm animate-fade-in">
                    <div className="bg-surface-container-lowest border border-outline-variant/40 p-sm rounded flex flex-col gap-1">
                      <span className="text-label-caps uppercase text-on-surface-variant font-bold">Référence</span>
                      <span className="text-body-md font-mono">{selectedProperty.reference}</span>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant/40 p-sm rounded flex flex-col gap-1">
                      <span className="text-label-caps uppercase text-on-surface-variant font-bold">Désignation</span>
                      <span className="text-body-md">{selectedProperty.designation}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-sm">
                      <div className="bg-surface-container-lowest border border-outline-variant/40 p-sm rounded flex flex-col gap-1">
                        <span className="text-label-caps uppercase text-on-surface-variant font-bold">Type</span>
                        <span className="text-body-md">{selectedProperty.propertyType}</span>
                      </div>
                      <div className="bg-surface-container-lowest border border-outline-variant/40 p-sm rounded flex flex-col gap-1">
                        <span className="text-label-caps uppercase text-on-surface-variant font-bold">Loyer Base</span>
                        <span className="text-body-md font-bold text-primary">{selectedProperty.baseRent} {selectedProperty.currency || "EUR"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "owners" && (
                  <div className="flex flex-col gap-2 animate-fade-in">
                    {selectedProperty.owners.map((o) => (
                      <div key={o.id} className="bg-surface-container-lowest border border-outline-variant/40 p-sm rounded flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{o.fullName}</span>
                          <RelationalLink entityType="owner" entityId={o.id} />
                        </div>
                        <Badge variant="secondary">{o.share}%</Badge>
                      </div>
                    ))}
                    {selectedProperty.owners.length === 0 && (
                      <span className="text-sm text-on-surface-variant italic text-center py-4">Aucun propriétaire associé.</span>
                    )}
                  </div>
                )}

                {activeTab === "media" && (
                  <div className="grid grid-cols-2 gap-2 animate-fade-in">
                    {selectedProperty.images.map((img) => (
                      <img key={img.id} src={img.url} alt={img.caption || ""} className="w-full aspect-video object-cover rounded border border-outline-variant/40" />
                    ))}
                    {selectedProperty.images.length === 0 && (
                      <div className="col-span-2 text-center py-8 text-on-surface-variant flex flex-col items-center">
                        <span className="material-symbols-outlined text-[32px] mb-2">image_not_supported</span>
                        Aucune image
                      </div>
                    )}
                  </div>
                )}
             </div>
          )
        )}
      </CardContent>

      {/* Footer sticky area */}
      {isEditing && (
        <div className="bg-surface-container-low border-t border-outline-variant/40 p-sm shrink-0 flex gap-2">
           <Button
              type="submit"
              form="property-form"
              className="flex-1"
              disabled={isPending || isUploading}
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
