"use client";

import React, { useState, useTransition } from "react";
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
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    identityDocument: string;
    emergencyContact: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    identityDocument: "",
    emergencyContact: "",
  });

  const handleStartCreate = () => {
    setSelectedTenant(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      identityDocument: "",
      emergencyContact: "",
    });
    setIsEditing(true);
  };

  const handleStartEdit = (ten: TenantDTO) => {
    setSelectedTenant(ten);
    setFormData({
      firstName: ten.firstName,
      lastName: ten.lastName,
      email: ten.email || "",
      phone: ten.phone || "",
      identityDocument: ten.identityDocument || "",
      emergencyContact: ten.emergencyContact || "",
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
    if (!formData.firstName || !formData.lastName) {
      toast.error("Veuillez remplir le nom et le prénom.");
      return;
    }

    startTransition(async () => {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email || null,
        phone: formData.phone || null,
        identityDocument: formData.identityDocument || null,
        emergencyContact: formData.emergencyContact || null,
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
    const fullName = `${t.firstName} ${t.lastName}`.toLowerCase();
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
          <div className="bg-surface-container-lowest border border-outline-variant flex flex-col sm:flex-row items-stretch sm:items-center justify-between shadow-xs overflow-hidden">
            <div className="flex-1 min-w-[200px] flex items-center border-b sm:border-b-0 border-outline-variant">
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
                    const fullName = `${ten.firstName} ${ten.lastName}`;
                    const initial = ten.firstName.charAt(0).toUpperCase();

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
                            <Avatar src="" alt={fullName} fallback={initial} size="md" />
                            <div className="flex flex-col">
                              <span className="text-body-md font-bold text-on-surface leading-snug">
                                {fullName}
                              </span>
                              <span className="text-body-sm text-on-surface-variant truncate max-w-[200px]">
                                {ten.email || "Aucun email"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-body-md text-on-surface-variant">
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
          <Card className="border-outline-variant/60 shadow-md">
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
            <CardContent className="pt-md">
              {isEditing ? (
                <form onSubmit={handleSave} className="flex flex-col gap-md">
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
                        Nom *
                      </label>
                      <Input
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

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
                      N° Pièce d&apos;identité (CNI / Passeport)
                    </label>
                    <Input
                      value={formData.identityDocument}
                      onChange={(e) => setFormData({ ...formData, identityDocument: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col gap-xs">
                    <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                      Contact d&apos;urgence
                    </label>
                    <Input
                      placeholder="Nom et téléphone du contact"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
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
                    alt={`${selectedTenant.firstName} ${selectedTenant.lastName}`}
                    fallback={selectedTenant.firstName.charAt(0)}
                    size="lg"
                    className="mb-sm shadow-sm border-2 border-primary/20"
                  />
                  <h4 className="text-h2 font-bold text-on-surface mb-xs">
                    {selectedTenant.firstName} {selectedTenant.lastName}
                  </h4>
                  <p className="text-body-md text-on-surface-variant mb-md font-mono bg-surface-container px-2 py-1 rounded break-all max-w-full">
                    {selectedTenant.email || "Aucun email renseigné"}
                  </p>

                  <div className="w-full border-t border-outline-variant/40 pt-md flex flex-col gap-sm text-left">
                    <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
                      <span className="text-label-caps uppercase text-on-surface-variant">Téléphone</span>
                      <span className="text-body-sm font-semibold">{selectedTenant.phone || "N/D"}</span>
                    </div>

                    <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
                      <span className="text-label-caps uppercase text-on-surface-variant">Pièce CNI</span>
                      <span className="text-body-sm font-semibold truncate max-w-[180px]">
                        {selectedTenant.identityDocument || "N/D"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
                      <span className="text-label-caps uppercase text-on-surface-variant">Urgence</span>
                      <span className="text-body-sm font-semibold truncate max-w-[180px]">
                        {selectedTenant.emergencyContact || "N/D"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
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
