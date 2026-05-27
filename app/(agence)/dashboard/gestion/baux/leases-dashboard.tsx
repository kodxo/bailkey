"use client";

import React, { useState, useTransition } from "react";
import { LeaseStatus } from "@/lib/generated/prisma/enums";
import type { LeaseDTO, PropertyDTO, TenantDTO } from "@/lib/types/property";
import { createLeaseAction, updateLeaseAction } from "@/app/actions/lease.actions";
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

interface LeasesDashboardProps {
  initialLeases: LeaseDTO[];
  initialProperties: PropertyDTO[];
  initialTenants: TenantDTO[];
}

export function LeasesDashboard({
  initialLeases,
  initialProperties,
  initialTenants,
}: LeasesDashboardProps): React.JSX.Element {
  const [leases, setLeases] = useState<LeaseDTO[]>(initialLeases);
  const [selectedLease, setSelectedLease] = useState<LeaseDTO | null>(
    initialLeases[0] || null
  );

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<{
    propertyId: string;
    tenantId: string;
    rentAmount: number | "";
    depositAmount: number | "";
    startDate: string;
    endDate: string;
    status: LeaseStatus;
  }>({
    propertyId: initialProperties[0]?.id || "",
    tenantId: initialTenants[0]?.id || "",
    rentAmount: "",
    depositAmount: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split("T")[0],
    status: LeaseStatus.ACTIVE,
  });

  const handleStartCreate = () => {
    setSelectedLease(null);
    setFormData({
      propertyId: initialProperties[0]?.id || "",
      tenantId: initialTenants[0]?.id || "",
      rentAmount: "",
      depositAmount: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split("T")[0],
      status: LeaseStatus.ACTIVE,
    });
    setIsEditing(true);
  };

  const handleStartEdit = (ls: LeaseDTO) => {
    setSelectedLease(ls);
    setFormData({
      propertyId: ls.propertyId,
      tenantId: ls.tenantId,
      rentAmount: ls.rentAmount,
      depositAmount: ls.depositAmount ?? "",
      startDate: new Date(ls.startDate).toISOString().split("T")[0],
      endDate: ls.endDate ? new Date(ls.endDate).toISOString().split("T")[0] : "",
      status: ls.status,
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (leases.length > 0 && !selectedLease) {
      setSelectedLease(leases[0]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.propertyId || !formData.tenantId || formData.rentAmount === "" || formData.depositAmount === "") {
      toast.error("Veuillez remplir tous les champs requis.");
      return;
    }

    startTransition(async () => {
      const payload = {
        propertyId: formData.propertyId,
        tenantId: formData.tenantId,
        rentAmount: Number(formData.rentAmount),
        depositAmount: Number(formData.depositAmount),
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : null,
        status: formData.status,
      };

      if (selectedLease) {
        const res = await updateLeaseAction(selectedLease.id, payload);
        if (res.success && res.lease) {
          const updatedLs = res.lease;
          setLeases((prev) => prev.map((l) => (l.id === updatedLs.id ? updatedLs : l)));
          setSelectedLease(updatedLs);
          setIsEditing(false);
          toast.success("Contrat de location mis à jour.");
        } else {
          toast.error(res.error || "Erreur de mise à jour.");
        }
      } else {
        const res = await createLeaseAction(payload);
        if (res.success && res.lease) {
          const newLs = res.lease;
          setLeases((prev) => [newLs, ...prev]);
          setSelectedLease(newLs);
          setIsEditing(false);
          toast.success("Contrat de location créé avec succès.");
        } else {
          toast.error(res.error || "Erreur de création.");
        }
      }
    });
  };

  const filteredLeases = leases.filter((l) => {
    const propName = (l.propertyDesignation || "").toLowerCase();
    const tenName = (l.tenantFullName || "").toLowerCase();
    const matchesSearch =
      propName.includes(searchTerm.toLowerCase()) ||
      tenName.includes(searchTerm.toLowerCase()) ||
      (l.propertyReference || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = filteredLeases.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentBatch = filteredLeases.slice(startIndex, startIndex + pageSize);

  const activeCount = leases.filter((l) => l.status === "ACTIVE").length;
  const pendingCount = leases.filter((l) => l.status === "DRAFT").length;

  return (
    <div className="flex flex-col gap-lg">
      <section className="flex gap-sm overflow-x-auto pb-2 md:pb-0">
        <MetricCard value={leases.length} label="Total Baux" />
        <MetricCard
          value={activeCount}
          label="Baux Actifs"
          valueClassName="text-primary font-bold"
        />
        <MetricCard
          value={pendingCount}
          label="Brouillons"
          valueClassName="text-tertiary font-bold"
        />
        <div className="ml-auto flex items-center">
          <Button onClick={handleStartCreate} disabled={isPending || isEditing} size="lg">
            <span className="material-symbols-outlined mr-2 select-none" data-icon="add">add</span>
            Nouveau Bail
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md items-start">
        <div className="lg:col-span-2 flex flex-col gap-md">
          <div className="bg-surface-container-lowest border border-outline-variant flex flex-col sm:flex-row items-stretch sm:items-center justify-between shadow-xs overflow-hidden rounded-xl">
            <div className="flex-1 min-w-[200px] flex items-center border-b sm:border-b-0 sm:border-r border-outline-variant">
              <Input
                iconName="search"
                placeholder="Rechercher par propriété, référence ou locataire..."
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
                label="Statut:"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                options={[
                  { label: "Tous", value: "all" },
                  { label: "Brouillon", value: "DRAFT" },
                  { label: "Actif", value: "ACTIVE" },
                  { label: "Résilié", value: "TERMINATED" },
                  { label: "Expiré", value: "EXPIRED" },
                ]}
                wrapperClassName="border-none py-sm"
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
                  <TableHead>PROPRIÉTÉ</TableHead>
                  <TableHead>LOCATAIRE</TableHead>
                  <TableHead>LOYER / CAUTION</TableHead>
                  <TableHead>STATUT</TableHead>
                  <TableHead className="text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentBatch.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="p-lg text-center text-on-surface-variant font-medium">
                      Aucun contrat de location trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentBatch.map((ls) => {
                    const isSelected = selectedLease?.id === ls.id;

                    return (
                      <TableRow
                        key={ls.id}
                        onClick={() => {
                          setSelectedLease(ls);
                          setIsEditing(false);
                        }}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "bg-primary-container/10 font-medium" : ""
                        }`}
                      >
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-body-md font-bold text-on-surface leading-snug">
                              {ls.propertyDesignation}
                            </span>
                            <span className="text-body-sm font-mono text-primary">
                              {ls.propertyReference}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-body-md font-medium text-on-surface">
                            {ls.tenantFullName}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-body-md font-semibold text-primary">
                              {new Intl.NumberFormat("fr-FR", {
                                style: "currency",
                                currency: "XAF",
                                maximumFractionDigits: 0,
                              }).format(ls.rentAmount)}
                            </span>
                            <span className="text-body-xs text-on-surface-variant">
                              Dépôt: {new Intl.NumberFormat("fr-FR", {
                                style: "currency",
                                currency: "XAF",
                                maximumFractionDigits: 0,
                              }).format(ls.depositAmount || 0)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {ls.status === "ACTIVE" && <Badge variant="default" dot>Actif</Badge>}
                          {ls.status === "DRAFT" && <Badge variant="surface" dot>Brouillon</Badge>}
                          {ls.status === "TERMINATED" && <Badge variant="destructive">Résilié</Badge>}
                          {ls.status === "EXPIRED" && <Badge variant="surface">Expiré</Badge>}
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isPending || isEditing}
                            onClick={() => handleStartEdit(ls)}
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
                {isEditing ? (selectedLease ? "Modifier le Contrat" : "Nouveau Contrat") : "Détails du Contrat"}
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
                      Bien Immobilier *
                    </label>
                    <Select
                      value={formData.propertyId}
                      onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                      options={initialProperties.map((p) => ({
                        label: `${p.designation} (${p.reference})`,
                        value: p.id,
                      }))}
                      wrapperClassName="w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-xs">
                    <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                      Locataire *
                    </label>
                    <Select
                      value={formData.tenantId}
                      onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                      options={initialTenants.map((t) => ({
                        label: `${t.firstName || ""} ${t.lastName || ""} ${t.companyName ? `(${t.companyName})` : ""}`.trim() || t.id,
                        value: t.id,
                      }))}
                      wrapperClassName="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-sm">
                    <div className="flex flex-col gap-xs">
                      <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                        Loyer convenu *
                      </label>
                      <Input
                        required
                        type="number"
                        placeholder="ex: 250000"
                        value={formData.rentAmount}
                        onChange={(e) =>
                          setFormData({ ...formData, rentAmount: e.target.value === "" ? "" : Number(e.target.value) })
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-xs">
                      <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                        Dépôt de Garantie (Caution) *
                      </label>
                      <Input
                        required
                        type="number"
                        placeholder="ex: 500000"
                        value={formData.depositAmount}
                        onChange={(e) =>
                          setFormData({ ...formData, depositAmount: e.target.value === "" ? "" : Number(e.target.value) })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-sm">
                    <div className="flex flex-col gap-xs">
                      <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                        Date de début *
                      </label>
                      <Input
                        required
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-xs">
                      <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                        Date de fin
                      </label>
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-xs">
                    <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                      Statut du contrat
                    </label>
                    <Select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as LeaseStatus })}
                      options={[
                        { label: "Brouillon", value: "DRAFT" },
                        { label: "Actif", value: "ACTIVE" },
                        { label: "Résilié", value: "TERMINATED" },
                        { label: "Expiré", value: "EXPIRED" },
                      ]}
                      wrapperClassName="w-full"
                    />
                  </div>

                  <Button type="submit" disabled={isPending} className="w-full mt-sm">
                    {isPending ? "Enregistrement..." : "Enregistrer le contrat"}
                  </Button>
                </form>
              ) : selectedLease ? (
                <div className="flex flex-col gap-md">
                  <div className="border-b border-outline-variant/40 pb-sm">
                    <span className="text-body-sm font-mono text-primary font-bold">
                      {selectedLease.propertyReference}
                    </span>
                    <h4 className="text-h2 font-bold text-on-surface mb-xs mt-1">
                      {selectedLease.propertyDesignation}
                    </h4>
                    <p className="text-body-sm text-on-surface-variant font-medium bg-surface-container px-2.5 py-1 rounded-lg inline-block mt-1">
                      Locataire : {selectedLease.tenantFullName}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 text-left">
                    <div className="flex justify-between items-center bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/40">
                      <span className="text-label-caps uppercase text-on-surface-variant">Loyer Mensuel</span>
                      <span className="text-body-md text-on-surface font-bold font-mono">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "XAF",
                          maximumFractionDigits: 0,
                        }).format(selectedLease.rentAmount)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/40">
                      <span className="text-label-caps uppercase text-on-surface-variant">Caution versée</span>
                      <span className="text-body-md text-primary font-bold font-mono">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "XAF",
                          maximumFractionDigits: 0,
                        }).format(selectedLease.depositAmount || 0)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/40">
                      <span className="text-label-caps uppercase text-on-surface-variant">Statut</span>
                      <span>
                        {selectedLease.status === "ACTIVE" && <Badge variant="default">Actif</Badge>}
                        {selectedLease.status === "DRAFT" && <Badge variant="surface">Brouillon</Badge>}
                        {selectedLease.status === "TERMINATED" && <Badge variant="destructive">Résilié</Badge>}
                        {selectedLease.status === "EXPIRED" && <Badge variant="surface">Expiré</Badge>}
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/40">
                      <span className="text-label-caps uppercase text-on-surface-variant">Période</span>
                      <span className="text-body-sm font-semibold">
                        {new Date(selectedLease.startDate).toLocaleDateString("fr-FR")} →{" "}
                        {selectedLease.endDate ? new Date(selectedLease.endDate).toLocaleDateString("fr-FR") : "Indéterminée"}
                      </span>
                    </div>
                  </div>

                  <Button onClick={() => handleStartEdit(selectedLease)} className="w-full mt-sm">
                    <span className="material-symbols-outlined text-sm mr-2 select-none" data-icon="edit">edit</span>
                    Modifier le contrat
                  </Button>
                </div>
              ) : (
                <div className="py-xl flex flex-col items-center text-on-surface-variant text-center">
                  <span className="material-symbols-outlined text-4xl mb-sm opacity-60" data-icon="history_edu">
                    history_edu
                  </span>
                  <p className="text-body-md">
                    Sélectionnez un contrat de location pour afficher ses détails ou créez-en un nouveau.
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
