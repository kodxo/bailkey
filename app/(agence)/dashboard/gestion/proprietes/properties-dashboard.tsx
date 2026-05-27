"use client";

import React, { useState, useTransition } from "react";
import { PropertyType, PropertyStatus } from "@/lib/generated/prisma/enums";
import type { PropertyDTO, OwnerDTO } from "@/lib/types/property";
import { createPropertyAction, updatePropertyAction } from "@/app/actions/property.actions";
import { uploadService } from "@/lib/services/property.service";
import { toast } from "sonner";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TablePagination } from "@/components/ui/pagination";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { Avatar } from "@/components/ui/avatar";

interface PropertiesDashboardProps {
  initialProperties: PropertyDTO[];
  initialOwners: OwnerDTO[];
}

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

export function PropertiesDashboard({
  initialProperties,
  initialOwners,
}: PropertiesDashboardProps): React.JSX.Element {
  const [properties, setProperties] =
    useState<PropertyDTO[]>(initialProperties);
  const [selectedProperty, setSelectedProperty] = useState<PropertyDTO | null>(
    initialProperties[0] || null,
  );

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"info" | "owners" | "media">(
    "info",
  );
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
    reference: "",
    designation: "",
    description: "",
    propertyType: PropertyType.APARTMENT,
    address: "",
    city: "Douala",
    area: "",
    roomsCount: "",
    baseRent: "",
    status: PropertyStatus.AVAILABLE,
  });

  const [formOwners, setFormOwners] = useState<FormOwnerDTO[]>([]);
  const [formImages, setFormImages] = useState<FormImageDTO[]>([]);

  const [newImgUrl, setNewImgUrl] = useState<string>("");
  const [newImgCaption, setNewImgCaption] = useState<string>("");

  const handleStartCreate = () => {
    setSelectedProperty(null);
    setFormData({
      reference: `REF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      designation: "",
      description: "",
      propertyType: PropertyType.APARTMENT,
      address: "",
      city: "Douala",
      area: "",
      roomsCount: "",
      baseRent: "",
      status: PropertyStatus.AVAILABLE,
    });
    setFormOwners(
      initialOwners.length > 0
        ? [{ ownerId: initialOwners[0].id, share: 100 }]
        : [],
    );
    setFormImages([]);
    setActiveTab("info");
    setIsEditing(true);
  };

  const handleStartEdit = (prop: PropertyDTO) => {
    setSelectedProperty(prop);
    setFormData({
      reference: prop.reference,
      designation: prop.designation,
      description: prop.description || "",
      propertyType: prop.propertyType,
      address: prop.address,
      city: prop.city,
      area: prop.area ?? "",
      roomsCount: prop.roomsCount ?? "",
      baseRent: prop.baseRent,
      status: prop.status,
    });
    setFormOwners(prop.owners.map((o) => ({ ownerId: o.id, share: o.share })));
    setFormImages(
      prop.images.map((img) => ({
        url: img.url,
        fileKey: img.fileKey,
        isCover: img.isCover,
        caption: img.caption,
        sortOrder: img.sortOrder,
      })),
    );
    setActiveTab("info");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (properties.length > 0 && !selectedProperty) {
      setSelectedProperty(properties[0]);
    }
  };

  const handleAddOwnerShare = () => {
    if (initialOwners.length === 0) return;
    const existingIds = new Set(formOwners.map((o) => o.ownerId));
    const available = initialOwners.find((o) => !existingIds.has(o.id));
    if (!available) {
      toast.error(
        "Tous les propriétaires disponibles sont déjà dans la liste.",
      );
      return;
    }
    setFormOwners([...formOwners, { ownerId: available.id, share: 0 }]);
  };

  const handleRemoveOwnerShare = (index: number) => {
    setFormOwners(formOwners.filter((_, idx) => idx !== index));
  };

  const handleUpdateOwnerShare = (
    index: number,
    newId: string,
    newShare: number,
  ) => {
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

  const handleAddPresetImage = (url: string, presetCaption: string) => {
    const newImg: FormImageDTO = {
      url,
      fileKey: `preset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      isCover: formImages.length === 0,
      caption: presetCaption,
      sortOrder: formImages.length,
    };
    setFormImages([...formImages, newImg]);
    toast.success(`Photo "${presetCaption}" ajoutée.`);
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

  const handleSave = (e: React.SubmitEvent) => {
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

      if (selectedProperty) {
        const res = await updatePropertyAction(
          selectedProperty.id,
          payload,
        );
        if (res.success && res.property) {
          const updatedProp = res.property;
          setProperties((prev) =>
            prev.map((p) => (p.id === updatedProp.id ? updatedProp : p)),
          );
          setSelectedProperty(updatedProp);
          setIsEditing(false);
          toast.success("Propriété mise à jour avec succès.");
        } else {
          toast.error(res.error || "Erreur lors de la mise à jour.");
        }
      } else {
        const res = await createPropertyAction(payload);
        if (res.success && res.property) {
          const newProp = res.property;
          setProperties((prev) => [newProp, ...prev]);
          setSelectedProperty(newProp);
          setIsEditing(false);
          toast.success("Propriété créée avec succès.");
        } else {
          toast.error(res.error || "Erreur lors de la création.");
        }
      }
    });
  };

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesType = typeFilter === "all" || p.propertyType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalCount = filteredProperties.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentBatch = filteredProperties.slice(
    startIndex,
    startIndex + pageSize,
  );

  const availableCount = properties.filter(
    (p) => p.status === "AVAILABLE",
  ).length;
  const rentedCount = properties.filter((p) => p.status === "RENTED").length;

  const presetPhotos = [
    {
      label: "Façade Villa",
      url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    },
    {
      label: "Salon Moderne",
      url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
    },
    {
      label: "Cuisine Équipée",
      url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
    },
    {
      label: "Chambre Principale",
      url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="flex flex-col gap-lg">
      <section className="flex gap-sm overflow-x-auto pb-2 md:pb-0">
        <MetricCard value={properties.length} label="Total Propriétés" />
        <MetricCard
          value={availableCount}
          label="Disponibles"
          valueClassName="text-primary font-bold"
        />
        <MetricCard
          value={rentedCount}
          label="En Location"
          valueClassName="text-tertiary font-bold"
        />
        <div className="ml-auto flex items-center">
          <Button
            onClick={handleStartCreate}
            disabled={isPending || isEditing}
            size="lg"
          >
            <span
              className="material-symbols-outlined mr-2 select-none"
              data-icon="add"
            >
              add
            </span>
            Nouvelle Propriété
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md items-start">
        {/* Left Table */}
        <div className="lg:col-span-2 flex flex-col gap-md">
          <div className="bg-surface-container-lowest border border-outline-variant flex flex-col sm:flex-row items-stretch sm:items-center justify-between shadow-xs overflow-hidden">
            <div className="flex-1 min-w-[200px] flex items-center border-b sm:border-b-0 sm:border-r border-outline-variant">
              <Input
                iconName="search"
                placeholder="Rechercher par désignation, réf ou ville..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                wrapperClassName="border-none w-full bg-transparent px-sm py-sm"
              />
            </div>
            <div className="flex items-center gap-2 px-sm py-xs">
              <Select
                label="Statut:"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                options={[
                  { label: "Tous", value: "all" },
                  { label: "Disponible", value: "AVAILABLE" },
                  { label: "Loué", value: "RENTED" },
                  { label: "En travaux", value: "UNDER_MAINTENANCE" },
                  { label: "Indisponible", value: "UNAVAILABLE" },
                ]}
                wrapperClassName="border-none py-sm"
              />
              <Select
                label="Type:"
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                options={[
                  { label: "Tous", value: "all" },
                  { label: "Appartement", value: "APARTMENT" },
                  { label: "Villa", value: "VILLA" },
                  { label: "Studio", value: "STUDIO" },
                  { label: "Commercial", value: "COMMERCIAL_SPACE" },
                  { label: "Terrain", value: "LAND" },
                  { label: "Entrepôt", value: "WAREHOUSE" },
                ]}
                wrapperClassName="border-none py-sm"
              />
            </div>
          </div>

          <div className="relative flex flex-col transition-all">
            {isPending && (
              <div className="absolute inset-0 bg-surface/50 backdrop-blur-xs z-20 flex items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-primary text-3xl">
                  progress_activity
                </span>
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PROPRIÉTÉ</TableHead>
                  <TableHead>LOCALISATION</TableHead>
                  <TableHead>LOYER</TableHead>
                  <TableHead>STATUT</TableHead>
                  <TableHead className="text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentBatch.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="p-lg text-center text-on-surface-variant font-medium"
                    >
                      Aucune propriété trouvée.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentBatch.map((prop) => {
                    const isSelected = selectedProperty?.id === prop.id;
                    const coverImg =
                      prop.images.find((i) => i.isCover)?.url ||
                      prop.images[0]?.url;

                    return (
                      <TableRow
                        key={prop.id}
                        onClick={() => {
                          setSelectedProperty(prop);
                          setIsEditing(false);
                          setActiveTab("info");
                        }}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-primary-container/10 font-medium"
                            : ""
                        }`}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={coverImg || ""}
                              alt={prop.designation}
                              fallback={prop.designation.charAt(0)}
                              size="md"
                              className="rounded-lg object-cover"
                            />
                            <div className="flex flex-col">
                              <span className="text-body-md font-bold text-on-surface leading-snug">
                                {prop.designation}
                              </span>
                              <span className="text-body-sm font-mono text-primary">
                                {prop.reference}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-body-md text-on-surface-variant">
                            {prop.city}{" "}
                            {prop.neighborhood ? `- ${prop.neighborhood}` : ""}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-body-md font-semibold text-on-surface">
                            {new Intl.NumberFormat("fr-FR", {
                              style: "currency",
                              currency: prop.currency,
                              maximumFractionDigits: 0,
                            }).format(prop.baseRent)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {prop.status === "AVAILABLE" && (
                            <Badge variant="default" dot>
                              Disponible
                            </Badge>
                          )}
                          {prop.status === "RENTED" && (
                            <Badge variant="destructive" dot>
                              Loué
                            </Badge>
                          )}
                          {prop.status === "UNDER_MAINTENANCE" && (
                            <Badge variant="surface" dot>
                              En travaux
                            </Badge>
                          )}
                          {prop.status === "UNAVAILABLE" && (
                            <Badge variant="surface">Indisponible</Badge>
                          )}
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isPending || isEditing}
                            onClick={() => handleStartEdit(prop)}
                          >
                            <span
                              className="material-symbols-outlined text-sm mr-1 select-none"
                              data-icon="edit"
                            >
                              edit
                            </span>
                            Éditer
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            <TablePagination
              total={totalCount}
              start={startIndex + 1}
              end={Math.min(startIndex + pageSize, totalCount)}
              disabledPrev={currentPage <= 1 || isPending}
              disabledNext={
                currentPage >= totalPages || totalPages <= 1 || isPending
              }
              onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              onNext={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            />
          </div>
        </div>

        {/* Right Details & Edit Panel */}
        <div className="lg:col-span-1 flex flex-col sticky top-6">
          <Card className="border-outline-variant/60 shadow-md overflow-hidden">
            <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-sm flex flex-col gap-2">
              <div className="flex flex-row items-center justify-between">
                <CardTitle className="text-h3 font-display">
                  {isEditing
                    ? selectedProperty
                      ? "Modifier Propriété"
                      : "Nouvelle Propriété"
                    : "Fiche Propriété"}
                </CardTitle>
                {isEditing && (
                  <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                    Annuler
                  </Button>
                )}
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

            <CardContent className="pt-md max-h-[calc(100vh-200px)] overflow-y-auto">
              {isEditing ? (
                <form onSubmit={handleSave} className="flex flex-col gap-md">
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
                          disabled={!!selectedProperty}
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

                      <div className="flex flex-col gap-xs">
                        <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                          Adresse complète *
                        </label>
                        <Input
                          required
                          placeholder="ex: Rue Drouot, Akwa"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
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
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                area:
                                  e.target.value === ""
                                    ? ""
                                    : Number(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-xs">
                          <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                            Nb Pièces
                          </label>
                          <Input
                            type="number"
                            value={formData.roomsCount}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                roomsCount:
                                  e.target.value === ""
                                    ? ""
                                    : Number(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-xs">
                        <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          className="w-full bg-surface-container-lowest border border-outline-variant p-2 rounded text-body-md focus:border-primary focus:outline-hidden"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 2: BAILLEURS / INDIVISION */}
                  {activeTab === "owners" && (
                    <div className="flex flex-col gap-md animate-fade-in">
                      <div className="flex items-center justify-between">
                        <h4 className="text-body-lg font-bold text-on-surface">
                          Répartition de propriété
                        </h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddOwnerShare}
                        >
                          <span
                            className="material-symbols-outlined text-sm mr-1 select-none"
                            data-icon="add"
                          >
                            add
                          </span>
                          Ajouter Bailleur
                        </Button>
                      </div>

                      {formOwners.length === 0 ? (
                        <p className="text-body-sm text-on-surface-variant bg-surface-container p-4 rounded text-center">
                          Aucun propriétaire sélectionné. La propriété sera
                          enregistrée sans rattachement.
                        </p>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {formOwners.map((o, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 bg-surface-container-lowest p-2 rounded border border-outline-variant/60"
                            >
                              <div className="flex-1">
                                <Select
                                  value={o.ownerId}
                                  onChange={(e) =>
                                    handleUpdateOwnerShare(
                                      idx,
                                      e.target.value,
                                      o.share,
                                    )
                                  }
                                  options={initialOwners.map((own) => ({
                                    label:
                                      `${own.firstName || ""} ${own.lastName || ""} ${own.companyName ? `(${own.companyName})` : ""}`.trim() ||
                                      own.id,
                                    value: own.id,
                                  }))}
                                  wrapperClassName="border border-outline-variant rounded p-1 w-full"
                                />
                              </div>
                              <div className="w-24 flex items-center gap-1">
                                <Input
                                  type="number"
                                  placeholder="%"
                                  value={o.share}
                                  onChange={(e) =>
                                    handleUpdateOwnerShare(
                                      idx,
                                      o.ownerId,
                                      Number(e.target.value),
                                    )
                                  }
                                  wrapperClassName="w-20"
                                />
                                <span className="font-bold">%</span>
                              </div>
                              {formOwners.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="text-error hover:text-error/80 p-2"
                                  onClick={() => handleRemoveOwnerShare(idx)}
                                >
                                  <span
                                    className="material-symbols-outlined select-none"
                                    data-icon="delete"
                                  >
                                    delete
                                  </span>
                                </Button>
                              )}
                            </div>
                          ))}

                          <div className="flex justify-between items-center p-3 mt-2 bg-surface-container rounded-lg border border-outline-variant">
                            <span className="font-semibold text-body-sm">
                              Total des parts d&apos;indivision :
                            </span>
                            <span
                              className={`font-mono font-bold text-lg ${
                                formOwners.reduce(
                                  (acc, o) => acc + Number(o.share),
                                  0,
                                ) === 100
                                  ? "text-primary"
                                  : "text-error"
                              }`}
                            >
                              {formOwners.reduce(
                                (acc, o) => acc + Number(o.share),
                                0,
                              )}
                              %
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: MEDIAS / PHOTOS */}
                  {activeTab === "media" && (
                    <div className="flex flex-col gap-md animate-fade-in">
                      <div className="flex flex-col gap-2">
                        <h4 className="text-body-lg font-bold text-on-surface">
                          Galerie de Photos
                        </h4>
                        <p className="text-body-sm text-on-surface-variant">
                          Ajoutez des photos de présentation. La première photo
                          cochée en couverture sera affichée sur les catalogues.
                        </p>
                      </div>

                      {/* R2 Upload Dropzone */}
                      <div className="flex flex-col items-center justify-center gap-2 bg-surface-container-lowest p-6 rounded-xl border-2 border-dashed border-primary/50 text-center hover:bg-primary/5 transition-colors cursor-pointer relative shadow-xs">
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploading}
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <span
                          className="material-symbols-outlined text-4xl text-primary mx-auto mb-1 select-none"
                          data-icon="cloud_upload"
                        >
                          cloud_upload
                        </span>
                        <span className="font-bold text-body-md text-on-surface">
                          {isUploading
                            ? "Envoi en cours..."
                            : "Cliquez ou glissez une image"}
                        </span>
                        <span className="text-xs text-on-surface-variant">
                          Formats acceptés : JPG, PNG, WEBP (Max 5Mo)
                        </span>
                      </div>

                      <div className="flex flex-col gap-2 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant mt-1">
                        <span className="text-xs font-bold uppercase text-on-surface-variant">
                          Ajouter par URL externe
                        </span>
                        <div className="flex gap-2">
                          <Input
                            placeholder="https://..."
                            value={newImgUrl}
                            onChange={(e) => setNewImgUrl(e.target.value)}
                            wrapperClassName="flex-1"
                          />
                          <Button
                            type="button"
                            onClick={handleAddCustomImage}
                            size="sm"
                          >
                            Ajouter
                          </Button>
                        </div>
                        <Input
                          placeholder="Légende (ex: Grand séjour lumineux)"
                          value={newImgCaption}
                          onChange={(e) => setNewImgCaption(e.target.value)}
                          wrapperClassName="mt-1"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-bold uppercase text-on-surface-variant">
                          Ou utiliser des photos de démonstration :
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {presetPhotos.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() =>
                                handleAddPresetImage(preset.url, preset.label)
                              }
                              className="flex items-center gap-2 p-2 bg-surface-container hover:bg-primary/10 rounded-lg text-left border border-outline-variant/60 transition-colors"
                            >
                              <img
                                src={preset.url}
                                alt=""
                                className="w-10 h-10 rounded object-cover"
                              />
                              <span className="text-xs font-semibold">
                                {preset.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 mt-2">
                        <span className="text-label-caps uppercase text-on-surface-variant font-semibold">
                          Photos enregistrées ({formImages.length})
                        </span>
                        {formImages.length === 0 ? (
                          <p className="text-body-sm text-on-surface-variant bg-surface-container p-4 rounded text-center">
                            Aucune photo rattachée pour le moment.
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {formImages.map((img, idx) => (
                              <div
                                key={idx}
                                className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                                  img.isCover
                                    ? "border-primary shadow-md"
                                    : "border-outline-variant/60"
                                }`}
                              >
                                <img
                                  src={img.url}
                                  alt={img.caption || ""}
                                  className="w-full h-36 object-cover"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-2">
                                  <div className="flex justify-between items-center">
                                    <button
                                      type="button"
                                      onClick={() => handleSetCoverImage(idx)}
                                      className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all ${
                                        img.isCover
                                          ? "bg-primary text-on-primary"
                                          : "bg-black/60 text-white hover:bg-black"
                                      }`}
                                    >
                                      {img.isCover
                                        ? "★ Couverture"
                                        : "Définir couverture"}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveImage(idx)}
                                      className="p-1 rounded-full bg-error text-white opacity-90 hover:opacity-100 shadow-xs"
                                    >
                                      <span
                                        className="material-symbols-outlined text-sm select-none"
                                        data-icon="close"
                                      >
                                        close
                                      </span>
                                    </button>
                                  </div>
                                  <span className="text-xs text-white font-medium truncate drop-shadow-sm">
                                    {img.caption || `Photo #${idx + 1}`}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isPending || isUploading}
                    className="w-full mt-lg"
                  >
                    {isPending
                      ? "Enregistrement..."
                      : "Enregistrer la propriété"}
                  </Button>
                </form>
              ) : selectedProperty ? (
                <div className="flex flex-col gap-md">
                  {/* TAB 1: INFORMATIONS */}
                  {activeTab === "info" && (
                    <div className="flex flex-col gap-md animate-fade-in">
                      <div className="border-b border-outline-variant/40 pb-sm">
                        <span className="text-body-sm font-mono text-primary font-bold">
                          {selectedProperty.reference}
                        </span>
                        <h4 className="text-h2 font-bold text-on-surface mb-xs mt-1">
                          {selectedProperty.designation}
                        </h4>
                        <p className="text-body-sm text-on-surface-variant">
                          {selectedProperty.address}, {selectedProperty.city}
                        </p>
                      </div>

                      <div className="flex flex-col gap-sm text-left">
                        <div className="flex justify-between items-center bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/40">
                          <span className="text-label-caps uppercase text-on-surface-variant">
                            Loyer de base
                          </span>
                          <span className="text-body-lg text-primary font-bold">
                            {new Intl.NumberFormat("fr-FR", {
                              style: "currency",
                              currency: selectedProperty.currency,
                              maximumFractionDigits: 0,
                            }).format(selectedProperty.baseRent)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/40">
                          <span className="text-label-caps uppercase text-on-surface-variant">
                            Statut
                          </span>
                          <span>
                            {selectedProperty.status === "AVAILABLE" && (
                              <Badge variant="default">Disponible</Badge>
                            )}
                            {selectedProperty.status === "RENTED" && (
                              <Badge variant="destructive">Loué</Badge>
                            )}
                            {selectedProperty.status ===
                              "UNDER_MAINTENANCE" && (
                              <Badge variant="surface">En travaux</Badge>
                            )}
                            {selectedProperty.status === "UNAVAILABLE" && (
                              <Badge variant="surface">Indisponible</Badge>
                            )}
                          </span>
                        </div>

                        <div className="flex justify-between items-center bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/40">
                          <span className="text-label-caps uppercase text-on-surface-variant">
                            Type de bien
                          </span>
                          <span className="text-body-sm text-on-surface font-semibold">
                            {selectedProperty.propertyType}
                          </span>
                        </div>

                        <div className="flex justify-between items-center bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/40">
                          <span className="text-label-caps uppercase text-on-surface-variant">
                            Surface / Pièces
                          </span>
                          <span className="text-body-sm text-on-surface font-semibold">
                            {selectedProperty.area
                              ? `${selectedProperty.area} m²`
                              : "N/D"}{" "}
                            / {selectedProperty.roomsCount || "N/D"}
                          </span>
                        </div>

                        {selectedProperty.description && (
                          <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40 mt-1">
                            <span className="text-label-caps uppercase text-on-surface-variant block mb-1">
                              Description
                            </span>
                            <p className="text-body-sm leading-relaxed text-on-surface-variant">
                              {selectedProperty.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: BAILLEURS */}
                  {activeTab === "owners" && (
                    <div className="flex flex-col gap-3 animate-fade-in">
                      <h4 className="text-body-lg font-bold text-on-surface">
                        Bailleurs en Indivision
                      </h4>
                      {selectedProperty.owners &&
                      selectedProperty.owners.length > 0 ? (
                        <div className="flex flex-col gap-2.5">
                          {selectedProperty.owners.map((o) => (
                            <div
                              key={o.id}
                              className="flex flex-col bg-surface-container-lowest p-3 rounded-xl border border-outline-variant shadow-xs"
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-body-md text-on-surface">
                                  {o.fullName}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-xs font-mono">
                                  {o.share}% des parts
                                </span>
                              </div>
                              <div className="flex gap-4 mt-2 text-xs text-on-surface-variant">
                                <span>{o.email || "Sans email"}</span>
                                <span>•</span>
                                <span>{o.phone || "Sans téléphone"}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-body-sm text-on-surface-variant bg-surface-container p-4 rounded text-center">
                          Aucun bailleur rattaché à cette propriété.
                        </p>
                      )}
                    </div>
                  )}

                  {/* TAB 3: MEDIAS */}
                  {activeTab === "media" && (
                    <div className="flex flex-col gap-3 animate-fade-in">
                      <h4 className="text-body-lg font-bold text-on-surface">
                        Photos & Médias
                      </h4>
                      {selectedProperty.images &&
                      selectedProperty.images.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {selectedProperty.images.map((img) => (
                            <div
                              key={img.id}
                              className={`relative group rounded-xl overflow-hidden border ${
                                img.isCover
                                  ? "border-primary border-2 shadow-md"
                                  : "border-outline-variant"
                              }`}
                            >
                              <img
                                src={img.url}
                                alt={img.caption || ""}
                                className="w-full h-40 object-cover"
                              />
                              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                                {img.isCover && (
                                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-on-primary rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs">
                                    Couverture
                                  </span>
                                )}
                                <span className="text-xs text-white font-medium truncate drop-shadow-sm">
                                  {img.caption || "Sans légende"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-body-sm text-on-surface-variant bg-surface-container p-4 rounded text-center">
                          Aucune photo n&apos;a été ajoutée pour ce bien.
                        </p>
                      )}
                    </div>
                  )}

                  <Button
                    onClick={() => handleStartEdit(selectedProperty)}
                    className="w-full mt-sm"
                  >
                    <span
                      className="material-symbols-outlined text-sm mr-2 select-none"
                      data-icon="edit"
                    >
                      edit
                    </span>
                    Éditer la fiche complète
                  </Button>
                </div>
              ) : (
                <div className="py-xl flex flex-col items-center text-on-surface-variant text-center">
                  <span
                    className="material-symbols-outlined text-4xl mb-sm opacity-60"
                    data-icon="apartment"
                  >
                    apartment
                  </span>
                  <p className="text-body-md">
                    Sélectionnez une propriété pour voir ses détails ou
                    ajoutez-en une nouvelle.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
