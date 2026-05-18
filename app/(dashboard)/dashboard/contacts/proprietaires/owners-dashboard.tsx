"use client";

import React, { useState, useTransition } from "react";
import { LegalEntityType } from "@/lib/generated/prisma/enums";
import type { OwnerDTO } from "@/lib/types/property";
import { ownerService } from "@/lib/services/property.service";
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

interface OwnersDashboardProps {
  initialOwners: OwnerDTO[];
}

export function OwnersDashboard({
  initialOwners,
}: OwnersDashboardProps): React.JSX.Element {
  const [owners, setOwners] = useState<OwnerDTO[]>(initialOwners);
  const [selectedOwner, setSelectedOwner] = useState<OwnerDTO | null>(
    initialOwners[0] || null
  );

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const [isEditing, setIsEditing] = useState<boolean>(false);
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
    type: LegalEntityType.INDIVIDUAL,
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    phone: "",
    address: "",
    identityDocument: "",
    registrationNumber: "",
    taxNumber: "",
  });

  const handleStartCreate = () => {
    setSelectedOwner(null);
    setFormData({
      type: LegalEntityType.INDIVIDUAL,
      firstName: "",
      lastName: "",
      companyName: "",
      email: "",
      phone: "",
      address: "",
      identityDocument: "",
      registrationNumber: "",
      taxNumber: "",
    });
    setIsEditing(true);
  };

  const handleStartEdit = (own: OwnerDTO) => {
    setSelectedOwner(own);
    setFormData({
      type: own.type,
      firstName: own.firstName || "",
      lastName: own.lastName || "",
      companyName: own.companyName || "",
      email: own.email || "",
      phone: own.phone || "",
      address: own.address || "",
      identityDocument: own.identityDocument || "",
      registrationNumber: own.registrationNumber || "",
      taxNumber: own.taxNumber || "",
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (owners.length > 0 && !selectedOwner) {
      setSelectedOwner(owners[0]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.type === LegalEntityType.INDIVIDUAL && !formData.firstName && !formData.lastName) {
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

      if (selectedOwner) {
        const res = await ownerService.updateOwner(selectedOwner.id, payload);
        if (res.success && res.owner) {
          const updatedOwn = res.owner;
          setOwners((prev) => prev.map((o) => (o.id === updatedOwn.id ? updatedOwn : o)));
          setSelectedOwner(updatedOwn);
          setIsEditing(false);
          toast.success("Propriétaire mis à jour avec succès.");
        } else {
          toast.error(res.error || "Erreur de mise à jour.");
        }
      } else {
        const res = await ownerService.createOwner(payload);
        if (res.success && res.owner) {
          const newOwn = res.owner;
          setOwners((prev) => [newOwn, ...prev]);
          setSelectedOwner(newOwn);
          setIsEditing(false);
          toast.success("Propriétaire créé avec succès.");
        } else {
          toast.error(res.error || "Erreur de création.");
        }
      }
    });
  };

  const filteredOwners = owners.filter((o) => {
    const fullName = `${o.firstName || ""} ${o.lastName || ""} ${o.companyName || ""}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      (o.email && o.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.phone && o.phone.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === "all" || o.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalCount = filteredOwners.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentBatch = filteredOwners.slice(startIndex, startIndex + pageSize);

  const individualCount = owners.filter((o) => o.type === "INDIVIDUAL").length;
  const companyCount = owners.filter((o) => o.type === "COMPANY").length;

  return (
    <div className="flex flex-col gap-lg">
      <section className="flex gap-sm overflow-x-auto pb-2 md:pb-0">
        <MetricCard value={owners.length} label="Total Propriétaires" />
        <MetricCard
          value={individualCount}
          label="Particuliers"
          valueClassName="text-primary font-bold"
        />
        <MetricCard
          value={companyCount}
          label="Sociétés"
          valueClassName="text-tertiary font-bold"
        />
        <div className="ml-auto flex items-center">
          <Button onClick={handleStartCreate} disabled={isPending || isEditing} size="lg">
            <span className="material-symbols-outlined mr-2 select-none" data-icon="person_add">person_add</span>
            Nouveau Propriétaire
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md items-start">
        <div className="lg:col-span-2 flex flex-col gap-md">
          <div className="bg-surface-container-lowest border border-outline-variant flex flex-col sm:flex-row items-stretch sm:items-center justify-between shadow-xs overflow-hidden">
            <div className="flex-1 min-w-[200px] flex items-center border-b sm:border-b-0 sm:border-r border-outline-variant">
              <Input
                iconName="search"
                placeholder="Rechercher par nom, email ou téléphone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                wrapperClassName="border-none w-full bg-transparent px-sm py-sm"
              />
            </div>
            <div className="flex items-center px-sm py-xs">
              <Select
                label="Type:"
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                options={[
                  { label: "Tous", value: "all" },
                  { label: "Particuliers", value: "INDIVIDUAL" },
                  { label: "Sociétés", value: "COMPANY" },
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
                  <TableHead>PROPRIÉTAIRE</TableHead>
                  <TableHead>CONTACT</TableHead>
                  <TableHead>TYPE</TableHead>
                  <TableHead className="text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentBatch.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="p-lg text-center text-on-surface-variant font-medium">
                      Aucun propriétaire trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentBatch.map((own) => {
                    const isSelected = selectedOwner?.id === own.id;
                    const displayName =
                      own.type === "COMPANY"
                        ? own.companyName || "Société"
                        : `${own.firstName || ""} ${own.lastName || ""}`.trim() || "Anonyme";
                    const initial = displayName.charAt(0).toUpperCase() || "P";

                    return (
                      <TableRow
                        key={own.id}
                        onClick={() => {
                          setSelectedOwner(own);
                          setIsEditing(false);
                        }}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "bg-primary-container/10 font-medium" : ""
                        }`}
                      >
                        <TableCell>
                          <div className="flex items-center gap-sm">
                            <Avatar src="" alt={displayName} fallback={initial} size="md" />
                            <div className="flex flex-col">
                              <span className="text-body-md font-bold text-on-surface leading-snug">
                                {displayName}
                              </span>
                              <span className="text-body-sm text-on-surface-variant truncate max-w-[200px]">
                                {own.email || "Aucun email"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-body-md text-on-surface-variant">
                            {own.phone || "Non renseigné"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {own.type === "COMPANY" ? (
                            <Badge variant="default" dot>Société</Badge>
                          ) : (
                            <Badge variant="surface" dot>Particulier</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isPending || isEditing}
                            onClick={() => handleStartEdit(own)}
                          >
                            <span className="material-symbols-outlined text-sm mr-1 select-none" data-icon="edit">edit</span>
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
              disabledNext={currentPage >= totalPages || totalPages <= 1 || isPending}
              onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            />
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col sticky top-6">
          <Card className="border-outline-variant/60 shadow-md">
            <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-md flex flex-row items-center justify-between">
              <CardTitle className="text-h3 font-display">
                {isEditing ? (selectedOwner ? "Modifier Propriétaire" : "Nouveau Propriétaire") : "Fiche Propriétaire"}
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
                      Type d&apos;entité *
                    </label>
                    <Select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as LegalEntityType })}
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
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                      </div>
                      <div className="flex flex-col gap-xs">
                        <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                          Nom de famille *
                        </label>
                        <Input
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  {formData.type === LegalEntityType.INDIVIDUAL ? (
                    <div className="flex flex-col gap-xs">
                      <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                        N° Pièce d&apos;identité (CNI / Passeport)
                      </label>
                      <Input
                        value={formData.identityDocument}
                        onChange={(e) => setFormData({ ...formData, identityDocument: e.target.value })}
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
                          onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                        />
                      </div>
                      <div className="flex flex-col gap-xs">
                        <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                          N° NIU / NIF
                        </label>
                        <Input
                          value={formData.taxNumber}
                          onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  <Button type="submit" disabled={isPending} className="w-full mt-sm">
                    {isPending ? "Enregistrement..." : "Enregistrer le propriétaire"}
                  </Button>
                </form>
              ) : selectedOwner ? (
                <div className="flex flex-col items-center text-center">
                  <Avatar
                    src=""
                    alt={selectedOwner.firstName || selectedOwner.companyName || "O"}
                    fallback={
                      (selectedOwner.type === "COMPANY"
                        ? selectedOwner.companyName?.charAt(0)
                        : selectedOwner.firstName?.charAt(0)) || "P"
                    }
                    size="lg"
                    className="mb-sm shadow-sm border-2 border-primary/20"
                  />
                  <h4 className="text-h2 font-bold text-on-surface mb-xs">
                    {selectedOwner.type === "COMPANY"
                      ? selectedOwner.companyName
                      : `${selectedOwner.firstName || ""} ${selectedOwner.lastName || ""}`}
                  </h4>
                  <p className="text-body-md text-on-surface-variant mb-md font-mono bg-surface-container px-2 py-1 rounded break-all max-w-full">
                    {selectedOwner.email || "Aucun email renseigné"}
                  </p>

                  <div className="w-full border-t border-outline-variant/40 pt-md flex flex-col gap-sm text-left">
                    <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
                      <span className="text-label-caps uppercase text-on-surface-variant">Type</span>
                      {selectedOwner.type === "COMPANY" ? (
                        <Badge variant="default">Société</Badge>
                      ) : (
                        <Badge variant="surface">Particulier</Badge>
                      )}
                    </div>

                    <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
                      <span className="text-label-caps uppercase text-on-surface-variant">Téléphone</span>
                      <span className="text-body-sm font-semibold">{selectedOwner.phone || "N/D"}</span>
                    </div>

                    <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
                      <span className="text-label-caps uppercase text-on-surface-variant">Adresse</span>
                      <span className="text-body-sm font-semibold truncate max-w-[180px]">{selectedOwner.address || "N/D"}</span>
                    </div>

                    <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
                      <span className="text-label-caps uppercase text-on-surface-variant">Biens rattachés</span>
                      <span className="text-body-sm font-bold text-primary">{selectedOwner.propertiesCount}</span>
                    </div>
                  </div>

                  <Button onClick={() => handleStartEdit(selectedOwner)} className="w-full mt-md">
                    <span className="material-symbols-outlined text-sm mr-2 select-none" data-icon="edit">edit</span>
                    Éditer la fiche
                  </Button>
                </div>
              ) : (
                <div className="py-xl flex flex-col items-center text-on-surface-variant text-center">
                  <span className="material-symbols-outlined text-4xl mb-sm opacity-60" data-icon="person_4">
                    person_4
                  </span>
                  <p className="text-body-md">
                    Sélectionnez un propriétaire pour afficher ses informations ou ajoutez-en un nouveau.
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
