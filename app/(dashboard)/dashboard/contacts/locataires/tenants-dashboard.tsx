"use client";

import React, { useState, useTransition } from "react";
import { LegalEntityType } from "@/lib/generated/prisma/enums";
import type { TenantDTO } from "@/lib/types/property";
import { tenantService } from "@/lib/services/property.service";
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

interface TenantsDashboardProps {
  initialTenants: TenantDTO[];
}

export function TenantsDashboard({
  initialTenants,
}: TenantsDashboardProps): React.JSX.Element {
  const [tenants, setTenants] = useState<TenantDTO[]>(initialTenants);
  const [selectedTenant, setSelectedTenant] = useState<TenantDTO | null>(
    initialTenants[0] || null
  );

  const [searchTerm, setSearchTerm] = useState<string>("");
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
    identityDocument: string;
    address: string;
  }>({
    type: LegalEntityType.INDIVIDUAL,
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    phone: "",
    identityDocument: "",
    address: "",
  });

  const handleStartCreate = () => {
    setSelectedTenant(null);
    setFormData({
      type: LegalEntityType.INDIVIDUAL,
      firstName: "",
      lastName: "",
      companyName: "",
      email: "",
      phone: "",
      identityDocument: "",
      address: "",
    });
    setIsEditing(true);
  };

  const handleStartEdit = (ten: TenantDTO) => {
    setSelectedTenant(ten);
    setFormData({
      type: ten.type,
      firstName: ten.firstName || "",
      lastName: ten.lastName || "",
      companyName: ten.companyName || "",
      email: ten.email || "",
      phone: ten.phone || "",
      identityDocument: ten.identityDocument || "",
      address: ten.address || "",
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (tenants.length > 0 && !selectedTenant) {
      setSelectedTenant(tenants[0]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.type === LegalEntityType.INDIVIDUAL && (!formData.firstName || !formData.lastName)) {
      toast.error("Veuillez remplir le nom et le prénom.");
      return;
    }
    if (formData.type === LegalEntityType.COMPANY && !formData.companyName) {
      toast.error("Veuillez remplir le nom de la société.");
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
        identityDocument: formData.identityDocument || null,
        address: formData.address || null,
      };

      if (selectedTenant) {
        const res = await tenantService.updateTenant(selectedTenant.id, payload);
        if (res.success && res.tenant) {
          const updatedTen = res.tenant;
          setTenants((prev) => prev.map((t) => (t.id === updatedTen.id ? updatedTen : t)));
          setSelectedTenant(updatedTen);
          setIsEditing(false);
          toast.success("Locataire mis à jour avec succès.");
        } else {
          toast.error(res.error || "Erreur de mise à jour.");
        }
      } else {
        const res = await tenantService.createTenant(payload);
        if (res.success && res.tenant) {
          const newTen = res.tenant;
          setTenants((prev) => [newTen, ...prev]);
          setSelectedTenant(newTen);
          setIsEditing(false);
          toast.success("Locataire créé avec succès.");
        } else {
          toast.error(res.error || "Erreur de création.");
        }
      }
    });
  };

  const filteredTenants = tenants.filter((t) => {
    const fullName = `${t.firstName || ""} ${t.lastName || ""} ${t.companyName || ""}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      (t.email && t.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.phone && t.phone.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const totalCount = filteredTenants.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentBatch = filteredTenants.slice(startIndex, startIndex + pageSize);

  const activeTenantsCount = tenants.filter((t) => t.activeLeasesCount > 0).length;

  return (
    <div className="flex flex-col gap-lg">
      <section className="flex gap-sm overflow-x-auto pb-2 md:pb-0">
        <MetricCard value={tenants.length} label="Total Locataires" />
        <MetricCard
          value={activeTenantsCount}
          label="Avec Bail Actif"
          valueClassName="text-primary font-bold"
        />
        <div className="ml-auto flex items-center">
          <Button onClick={handleStartCreate} disabled={isPending || isEditing} size="lg">
            <span className="material-symbols-outlined mr-2 select-none" data-icon="person_add">person_add</span>
            Nouveau Locataire
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md items-start">
        <div className="lg:col-span-2 flex flex-col gap-md">
          <div className="bg-surface-container-lowest border border-outline-variant flex flex-col sm:flex-row items-stretch sm:items-center justify-between shadow-xs overflow-hidden rounded-xl">
            <div className="flex-1 min-w-[200px] flex items-center border-outline-variant">
              <Input
                iconName="search"
                placeholder="Rechercher par nom, société, email ou téléphone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                wrapperClassName="border-none w-full bg-transparent px-sm py-sm"
              />
            </div>
          </div>

          <div className="relative flex flex-col transition-all bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-xs overflow-hidden">
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
                  <TableHead>LOCATAIRE</TableHead>
                  <TableHead>CONTACT</TableHead>
                  <TableHead>BAUX ACTIFS</TableHead>
                  <TableHead className="text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentBatch.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="p-lg text-center text-on-surface-variant font-medium">
                      Aucun locataire trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentBatch.map((ten) => {
                    const isSelected = selectedTenant?.id === ten.id;
                    const displayName =
                      ten.type === "COMPANY"
                        ? ten.companyName || "Société sans nom"
                        : `${ten.firstName || ""} ${ten.lastName || ""}`.trim() || "Sans nom";
                    const initial = displayName.charAt(0).toUpperCase();

                    return (
                      <TableRow
                        key={ten.id}
                        onClick={() => {
                          setSelectedTenant(ten);
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
                              <span className="text-body-md font-bold text-on-surface leading-snug flex items-center gap-1.5">
                                {displayName}
                                {ten.type === "COMPANY" && (
                                  <Badge variant="surface" className="text-[10px] px-1 py-0 font-mono">PRO</Badge>
                                )}
                              </span>
                              <span className="text-body-sm text-on-surface-variant truncate max-w-[200px]">
                                {ten.email || "Aucun email"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-body-md text-on-surface-variant font-mono">
                            {ten.phone || "Non renseigné"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {ten.activeLeasesCount > 0 ? (
                            <Badge variant="default" dot>{ten.activeLeasesCount} Actif(s)</Badge>
                          ) : (
                            <Badge variant="surface">Aucun</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isPending || isEditing}
                            onClick={() => handleStartEdit(ten)}
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
          <Card className="border-outline-variant/60 shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-surface-container-low border-b border-outline-variant/40 pb-md flex flex-row items-center justify-between">
              <CardTitle className="text-h3 font-display">
                {isEditing ? (selectedTenant ? "Modifier Locataire" : "Nouveau Locataire") : "Fiche Locataire"}
              </CardTitle>
              {isEditing && (
                <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                  Annuler
                </Button>
              )}
            </CardHeader>
            <CardContent className="pt-md max-h-[calc(100vh-220px)] overflow-y-auto">
              {isEditing ? (
                <form onSubmit={handleSave} className="flex flex-col gap-md">
                  <div className="flex flex-col gap-xs">
                    <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                      Type de locataire
                    </label>
                    <Select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as LegalEntityType })}
                      options={[
                        { label: "Particulier (Individu)", value: "INDIVIDUAL" },
                        { label: "Société / Entreprise", value: "COMPANY" },
                      ]}
                      wrapperClassName="w-full"
                    />
                  </div>

                  {formData.type === "INDIVIDUAL" ? (
                    <div className="grid grid-cols-2 gap-sm">
                      <div className="flex flex-col gap-xs">
                        <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                          Prénom *
                        </label>
                        <Input
                          required={formData.type === "INDIVIDUAL"}
                          placeholder="ex: Jean"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                      </div>
                      <div className="flex flex-col gap-xs">
                        <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                          Nom *
                        </label>
                        <Input
                          required={formData.type === "INDIVIDUAL"}
                          placeholder="ex: Dupont"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-xs">
                      <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                        Nom de la société / Raison sociale *
                      </label>
                      <Input
                        required={formData.type === "COMPANY"}
                        placeholder="ex: BailKey Cameroun SA"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-xs">
                    <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="locataire@domaine.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col gap-xs">
                    <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                      Téléphone
                    </label>
                    <Input
                      placeholder="+237 60000000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col gap-xs">
                    <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                      N° Pièce d&apos;identité (CNI / Passeport / RCCM)
                    </label>
                    <Input
                      placeholder={formData.type === "INDIVIDUAL" ? "N° de CNI ou Passeport" : "N° de RCCM"}
                      value={formData.identityDocument}
                      onChange={(e) => setFormData({ ...formData, identityDocument: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col gap-xs">
                    <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                      Adresse postale / Ville
                    </label>
                    <Input
                      placeholder="Adresse complète"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  <Button type="submit" disabled={isPending} className="w-full mt-sm">
                    {isPending ? "Enregistrement..." : "Enregistrer le locataire"}
                  </Button>
                </form>
              ) : selectedTenant ? (
                <div className="flex flex-col items-center text-center">
                  <Avatar
                    src=""
                    alt={selectedTenant.companyName || selectedTenant.firstName || ""}
                    fallback={(selectedTenant.companyName || selectedTenant.firstName || "L").charAt(0)}
                    size="lg"
                    className="mb-sm shadow-sm border-2 border-primary/20"
                  />
                  <h4 className="text-h2 font-bold text-on-surface mb-xs flex items-center justify-center gap-2">
                    {selectedTenant.type === "COMPANY"
                      ? selectedTenant.companyName || "Société sans nom"
                      : `${selectedTenant.firstName || ""} ${selectedTenant.lastName || ""}`.trim() || "Sans nom"}
                    {selectedTenant.type === "COMPANY" && (
                      <Badge variant="surface" className="text-xs px-2 py-0.5 font-mono">PRO</Badge>
                    )}
                  </h4>
                  <p className="text-body-md text-on-surface-variant mb-md font-mono bg-surface-container px-3 py-1 rounded-lg break-all max-w-full">
                    {selectedTenant.email || "Aucun email renseigné"}
                  </p>

                  <div className="w-full border-t border-outline-variant/40 pt-md flex flex-col gap-2 text-left">
                    <div className="flex justify-between items-center bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/40">
                      <span className="text-label-caps uppercase text-on-surface-variant">Téléphone</span>
                      <span className="text-body-sm font-semibold font-mono">{selectedTenant.phone || "N/D"}</span>
                    </div>

                    <div className="flex justify-between items-center bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/40">
                      <span className="text-label-caps uppercase text-on-surface-variant">
                        {selectedTenant.type === "COMPANY" ? "RCCM" : "Pièce CNI"}
                      </span>
                      <span className="text-body-sm font-semibold truncate max-w-[180px]">
                        {selectedTenant.identityDocument || "N/D"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/40">
                      <span className="text-label-caps uppercase text-on-surface-variant">Adresse</span>
                      <span className="text-body-sm font-semibold truncate max-w-[180px]">
                        {selectedTenant.address || "N/D"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/40">
                      <span className="text-label-caps uppercase text-on-surface-variant">Baux rattachés</span>
                      <span className="text-body-sm font-bold text-primary">{selectedTenant.activeLeasesCount}</span>
                    </div>
                  </div>

                  <Button onClick={() => handleStartEdit(selectedTenant)} className="w-full mt-md">
                    <span className="material-symbols-outlined text-sm mr-2 select-none" data-icon="edit">edit</span>
                    Éditer la fiche
                  </Button>
                </div>
              ) : (
                <div className="py-xl flex flex-col items-center text-on-surface-variant text-center">
                  <span className="material-symbols-outlined text-4xl mb-sm opacity-60" data-icon="person">
                    person
                  </span>
                  <p className="text-body-md">
                    Sélectionnez un locataire pour afficher ses informations ou ajoutez-en un nouveau.
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
