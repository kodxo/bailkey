"use client";

import React, { useState, useTransition } from "react";
import {
  PropertyType,
  PropertyStatus,
  CommissionType,
} from "@/lib/generated/prisma/enums";
import type { PropertyDTO, OwnerDTO } from "@/lib/types/property";
import { createPropertyAction, updatePropertyAction } from "@/lib/actions/property.actions";
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
import { SearchPanel, SearchPanelInput, SearchPanelFilters } from "@/components/ui/search-panel";
import { Select } from "@/components/ui/select";
import { TablePagination } from "@/components/ui/pagination";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";

interface PropertiesDashboardProps {
  initialProperties: PropertyDTO[];
  initialOwners: OwnerDTO[];
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
  const [isPending, startTransition] = useTransition();

  // Form state
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
    ownerId: initialOwners[0]?.id || "",
  });

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
      ownerId: initialOwners[0]?.id || "",
    });
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
      ownerId: prop.owners[0]?.id || "",
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (properties.length > 0 && !selectedProperty) {
      setSelectedProperty(properties[0]);
    }
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
        ...(formData.ownerId && { ownerId: formData.ownerId }),
      };

      if (selectedProperty) {
        // Update
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
          toast.error(res.error || "Erreur de mise à jour.");
        }
      } else {
        // Create
        const res = await createPropertyAction(payload);
        if (res.success && res.property) {
          const newProp = res.property;
          setProperties((prev) => [newProp, ...prev]);
          setSelectedProperty(newProp);
          setIsEditing(false);
          toast.success("Propriété créée avec succès.");
        } else {
          toast.error(res.error || "Erreur de création.");
        }
      }
    });
  };

  // Filter & Pagination
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
        {/* Left Panel: Table */}
        <div className="lg:col-span-2 flex flex-col gap-md">
          <SearchPanel>
            <SearchPanelInput
              placeholder="Rechercher par désignation, réf ou ville..."
              defaultValue={searchTerm}
              onChange={(val) => {
                setSearchTerm(val);
                setCurrentPage(1);
              }}
            />
            <SearchPanelFilters>
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
                  { label: "Local Commercial", value: "COMMERCIAL_SPACE" },
                  { label: "Terrain", value: "LAND" },
                  { label: "Entrepôt", value: "WAREHOUSE" },
                ]}
                wrapperClassName="border-none py-sm"
              />
            </SearchPanelFilters>
          </SearchPanel>

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
                    return (
                      <TableRow
                        key={prop.id}
                        onClick={() => {
                          setSelectedProperty(prop);
                          setIsEditing(false);
                        }}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-primary-container/10 font-medium"
                            : ""
                        }`}
                      >
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-body-md font-bold text-on-surface leading-snug">
                              {prop.designation}
                            </span>
                            <span className="text-body-sm font-mono text-primary select-all">
                              {prop.reference}
                            </span>
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

        {/* Right Panel: Details or Form */}
        <div className="lg:col-span-1 flex flex-col sticky top-6">
          <Card className="border-outline-variant/60 shadow-md">
            <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-md flex flex-row items-center justify-between">
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
            </CardHeader>
            <CardContent className="pt-md">
              {isEditing ? (
                <form onSubmit={handleSave} className="flex flex-col gap-md">
                  <div className="flex flex-col gap-xs">
                    <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                      Référence *
                    </label>
                    <Input
                      required
                      value={formData.reference}
                      disabled={!!selectedProperty}
                      onChange={(e) =>
                        setFormData({ ...formData, reference: e.target.value })
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as PropertyStatus,
                          })
                        }
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
                        setFormData({ ...formData, address: e.target.value })
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

                  {!selectedProperty && initialOwners.length > 0 && (
                    <div className="flex flex-col gap-xs">
                      <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                        Propriétaire Principal
                      </label>
                      <Select
                        value={formData.ownerId}
                        onChange={(e) =>
                          setFormData({ ...formData, ownerId: e.target.value })
                        }
                        options={initialOwners.map((o) => ({
                          label:
                            `${o.firstName || ""} ${o.lastName || ""} ${o.companyName ? `(${o.companyName})` : ""}`.trim() ||
                            o.id,
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full mt-sm"
                  >
                    {isPending
                      ? "Enregistrement..."
                      : "Enregistrer la propriété"}
                  </Button>
                </form>
              ) : selectedProperty ? (
                <div className="flex flex-col gap-md">
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
                    <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
                      <span className="text-label-caps uppercase text-on-surface-variant">
                        Loyer de base
                      </span>
                      <span className="text-body-md text-on-surface font-bold">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: selectedProperty.currency,
                          maximumFractionDigits: 0,
                        }).format(selectedProperty.baseRent)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
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
                        {selectedProperty.status === "UNDER_MAINTENANCE" && (
                          <Badge variant="surface">En travaux</Badge>
                        )}
                        {selectedProperty.status === "UNAVAILABLE" && (
                          <Badge variant="surface">Indisponible</Badge>
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
                      <span className="text-label-caps uppercase text-on-surface-variant">
                        Type de bien
                      </span>
                      <span className="text-body-sm text-on-surface font-semibold">
                        {selectedProperty.propertyType}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
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

                    <div className="bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
                      <span className="text-label-caps uppercase text-on-surface-variant block mb-1">
                        Propriétaires (Indivision)
                      </span>
                      {selectedProperty.owners &&
                      selectedProperty.owners.length > 0 ? (
                        selectedProperty.owners.map((o) => (
                          <div
                            key={o.id}
                            className="flex justify-between text-body-sm"
                          >
                            <span className="font-semibold">{o.fullName}</span>
                            <span className="text-on-surface-variant">
                              {o.share}%
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-body-sm text-on-surface-variant">
                          Aucun propriétaire rattaché
                        </span>
                      )}
                    </div>
                  </div>

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
                    Éditer la fiche
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
