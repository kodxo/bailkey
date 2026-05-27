"use client";

import React, { useState, useActionState, useEffect } from "react";
import { LeaseStatus } from "@/lib/generated/prisma/enums";
import type { LeaseDTO, PropertyDTO, TenantDTO } from "@/lib/types/property";
import { createLeaseAction, updateLeaseAction, type LeaseActionState } from "@/lib/actions/lease.actions";
import { toast } from "sonner";
import { LeaseSchedulesList } from "@/components/schedules/lease-schedules-list";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

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
import {
  DashboardLayout,
  DashboardMetrics,
  DashboardSplitGrid,
  DashboardMain,
  DashboardSidebar,
  DashboardToolbar,
} from "@/components/layout/dashboard-split-pane";

interface LeasesDashboardProps {
  initialLeases: LeaseDTO[];
  initialProperties: PropertyDTO[];
  initialTenants: TenantDTO[];
  initialSelectedLease?: LeaseDTO | null;
  totalCount?: number;
  activeCount?: number;
  draftCount?: number;
  currentPage?: number;
  pageSize?: number;
  initialSearch?: string;
  initialStatus?: string;
}

export function LeasesDashboard({
  initialLeases,
  initialProperties,
  initialTenants,
  initialSelectedLease = null,
  totalCount = 0,
  activeCount = 0,
  draftCount = 0,
  currentPage = 1,
  pageSize = 10,
  initialSearch = "",
  initialStatus = "all",
}: LeasesDashboardProps): React.JSX.Element {
  const [leases, setLeases] = useState<LeaseDTO[]>(initialLeases);
  // Update local state when initialLeases changes from server
  React.useEffect(() => {
    setLeases(initialLeases);
  }, [initialLeases]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedLeaseId = searchParams.get("selectedLeaseId");
  let selectedLease = null;
  if (initialSelectedLease) {
    selectedLease = initialSelectedLease;
  } else {
    selectedLease = leases.find((l) => l.id === selectedLeaseId) || (leases.length > 0 && !selectedLeaseId ? leases[0] : null);
  }

  const setSelectedLease = (ls: LeaseDTO | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (ls) {
      params.set("selectedLeaseId", ls.id);
    } else {
      params.delete("selectedLeaseId");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== initialSearch) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) params.set("search", searchTerm);
        else params.delete("search");
        params.set("page", "1");
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, initialSearch, pathname, router, searchParams]);

  const handleStatusChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== "all") params.set("status", val);
    else params.delete("status");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", newPageSize.toString());
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"details" | "schedules">("details");

  const [state, formAction, isPending] = useActionState(
    async (prevState: LeaseActionState | null, formData: FormData) => {
      if (selectedLease) {
        return updateLeaseAction(selectedLease.id, prevState, formData);
      }
      return createLeaseAction(prevState, formData);
    },
    null
  );

  useEffect(() => {
    if (state?.success && state.lease) {
      if (selectedLease) {
        setLeases((prev) => prev.map((l) => (l.id === state.lease!.id ? state.lease! : l)));
        toast.success("Contrat de location mis à jour.");
      } else {
        setLeases((prev) => [state.lease!, ...prev]);
        toast.success("Contrat de location créé avec succès.");
      }
      setSelectedLease(state.lease);
      setIsEditing(false);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  const [formData, setFormData] = useState<{
    propertyId: string;
    tenantId: string;
    rentAmount: number | "";
    depositAmount: number | "";
    startDate: string;
    endDate: string;
    paymentFrequency: string;
    paymentDay: number | "";
    status: LeaseStatus;
  }>({
    propertyId: initialProperties[0]?.id || "",
    tenantId: initialTenants[0]?.id || "",
    rentAmount: "",
    depositAmount: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split("T")[0],
    paymentFrequency: "MONTHLY",
    paymentDay: 5,
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
      paymentFrequency: "MONTHLY",
      paymentDay: 5,
      status: LeaseStatus.ACTIVE,
    });
    setIsEditing(true);
    setActiveTab("details");
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
      paymentFrequency: "MONTHLY",
      paymentDay: 5,
      status: ls.status,
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (leases.length > 0 && !selectedLeaseId) {
      setSelectedLease(leases[0]);
    }
  };

  return (
    <DashboardLayout>
      <DashboardMetrics>
        <MetricCard value={totalCount} label="Total Baux" />
        <MetricCard
          value={activeCount}
          label="Baux Actifs"
          valueClassName="text-primary font-bold"
        />
        <MetricCard
          value={draftCount}
          label="Brouillons"
          valueClassName="text-tertiary font-bold"
        />
        <div className="ml-auto flex items-center">
          <Button onClick={handleStartCreate} disabled={isPending || isEditing} size="lg">
            <span className="material-symbols-outlined mr-2 select-none" data-icon="add">add</span>
            Nouveau Bail
          </Button>
        </div>
      </DashboardMetrics>

      <DashboardSplitGrid>
        <DashboardMain>
          <DashboardToolbar>
            <div className="flex-1 min-w-[200px] flex items-center border-b sm:border-b-0 sm:border-r border-outline-variant">
              <Input
                iconName="search"
                placeholder="Rechercher par propriété, référence ou locataire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                wrapperClassName="border-none w-full bg-transparent px-sm py-sm"
              />
            </div>
            <div className="flex items-center px-sm py-xs">
              <Select
                label="Statut:"
                value={initialStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
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
          </DashboardToolbar>

            <Table wrapperClassName="max-h-[calc(100vh-250px)] rounded-xl border border-outline-variant/60 shadow-xs relative transition-all bg-surface-container-lowest">
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
                {leases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="p-lg text-center text-on-surface-variant font-medium">
                      Aucun contrat de location trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  leases.map((ls) => {
                    const isSelected = selectedLease?.id === ls.id;

                    return (
                      <TableRow
                        key={ls.id}
                        onClick={() => {
                          setSelectedLease(ls);
                          setIsEditing(false);
                        }}
                        className={`cursor-pointer transition-colors relative ${
                          isSelected 
                            ? "bg-primary/5 font-medium after:absolute after:inset-y-0 after:left-0 after:w-1 after:bg-primary" 
                            : "hover:bg-surface-container-low"
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
              start={(currentPage - 1) * pageSize + 1}
              end={Math.min(currentPage * pageSize, totalCount)}
              disabledPrev={currentPage <= 1 || isPending}
              disabledNext={currentPage >= totalPages || totalPages <= 1 || isPending}
              onPrev={() => handlePageChange(Math.max(currentPage - 1, 1))}
              onNext={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          {isPending && (
            <div className="absolute inset-0 bg-surface/50 backdrop-blur-xs z-20 flex items-center justify-center">
              <span className="material-symbols-outlined animate-spin text-primary text-3xl">
                progress_activity
              </span>
            </div>
          )}
        </DashboardMain>

        <DashboardSidebar>
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
                <form action={formAction} className="flex flex-col gap-md">
                  <div className="flex flex-col gap-xs">
                    <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                      Bien Immobilier *
                    </label>
                    <Select
                      name="propertyId"
                      defaultValue={formData.propertyId}
                      options={initialProperties.map((p) => ({
                        label: `${p.designation} (${p.reference})`,
                        value: p.id,
                      }))}
                      wrapperClassName="w-full"
                    />
                    {state?.errors?.propertyId && <p className="text-xs text-error">{state.errors.propertyId[0]}</p>}
                  </div>

                  <div className="flex flex-col gap-xs">
                    <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                      Locataire *
                    </label>
                    <Select
                      name="tenantId"
                      defaultValue={formData.tenantId}
                      options={initialTenants.map((t) => ({
                        label: `${t.firstName || ""} ${t.lastName || ""} ${t.companyName ? `(${t.companyName})` : ""}`.trim() || t.id,
                        value: t.id,
                      }))}
                      wrapperClassName="w-full"
                    />
                    {state?.errors?.tenantId && <p className="text-xs text-error">{state.errors.tenantId[0]}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-sm">
                    <div className="flex flex-col gap-xs">
                      <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                        Loyer convenu *
                      </label>
                      <Input
                        name="rentAmount"
                        required
                        type="number"
                        placeholder="ex: 250000"
                        defaultValue={formData.rentAmount}
                      />
                      {state?.errors?.rentAmount && <p className="text-xs text-error">{state.errors.rentAmount[0]}</p>}
                    </div>
                    <div className="flex flex-col gap-xs">
                      <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                        Dépôt de Garantie (Caution)
                      </label>
                      <Input
                        name="depositAmount"
                        type="number"
                        placeholder="ex: 500000"
                        defaultValue={formData.depositAmount}
                      />
                      {state?.errors?.depositAmount && <p className="text-xs text-error">{state.errors.depositAmount[0]}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-sm">
                    <div className="flex flex-col gap-xs">
                      <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                        Date de début *
                      </label>
                      <Input
                        name="startDate"
                        required
                        type="date"
                        defaultValue={formData.startDate}
                      />
                      {state?.errors?.startDate && <p className="text-xs text-error">{state.errors.startDate[0]}</p>}
                    </div>
                    <div className="flex flex-col gap-xs">
                      <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                        Date de fin
                      </label>
                      <Input
                        name="endDate"
                        type="date"
                        defaultValue={formData.endDate}
                      />
                      {state?.errors?.endDate && <p className="text-xs text-error">{state.errors.endDate[0]}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-sm">
                    <div className="flex flex-col gap-xs">
                      <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                        Périodicité
                      </label>
                      <Select
                        name="paymentFrequency"
                        defaultValue={formData.paymentFrequency}
                        options={[
                          { label: "Mensuelle", value: "MONTHLY" },
                          { label: "Trimestrielle", value: "QUARTERLY" },
                          { label: "Semestrielle", value: "SEMI_ANNUALLY" },
                          { label: "Annuelle", value: "ANNUALLY" },
                        ]}
                        wrapperClassName="w-full"
                      />
                      {state?.errors?.paymentFrequency && <p className="text-xs text-error">{state.errors.paymentFrequency[0]}</p>}
                    </div>
                    <div className="flex flex-col gap-xs">
                      <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                        Jour de paiement
                      </label>
                      <Input
                        name="paymentDay"
                        type="number"
                        min="1"
                        max="31"
                        defaultValue={formData.paymentDay}
                      />
                      {state?.errors?.paymentDay && <p className="text-xs text-error">{state.errors.paymentDay[0]}</p>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-xs">
                    <label className="text-label-caps uppercase text-on-surface-variant font-semibold">
                      Statut du contrat
                    </label>
                    <Select
                      name="status"
                      defaultValue={formData.status}
                      options={[
                        { label: "Brouillon", value: "DRAFT" },
                        { label: "Actif", value: "ACTIVE" },
                        { label: "Résilié", value: "TERMINATED" },
                        { label: "Expiré", value: "EXPIRED" },
                      ]}
                      wrapperClassName="w-full"
                    />
                    {state?.errors?.status && <p className="text-xs text-error">{state.errors.status[0]}</p>}
                  </div>

                  <Button type="submit" disabled={isPending} className="w-full mt-sm">
                    {isPending ? "Enregistrement..." : "Enregistrer le contrat"}
                  </Button>
                </form>
              ) : selectedLease ? (
                <div className="flex flex-col gap-md">
                  <div className="flex border-b border-outline-variant/40 mb-2">
                    <button
                      className={`flex-1 py-2 text-sm font-semibold border-b-2 transition-colors ${
                        activeTab === "details"
                          ? "border-primary text-primary"
                          : "border-transparent text-on-surface-variant hover:text-on-surface"
                      }`}
                      onClick={() => setActiveTab("details")}
                    >
                      Détails
                    </button>
                    <button
                      className={`flex-1 py-2 text-sm font-semibold border-b-2 transition-colors ${
                        activeTab === "schedules"
                          ? "border-primary text-primary"
                          : "border-transparent text-on-surface-variant hover:text-on-surface"
                      }`}
                      onClick={() => setActiveTab("schedules")}
                    >
                      Échéancier
                    </button>
                  </div>

                  {activeTab === "details" ? (
                    <>
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
                    </>
                  ) : (
                    <LeaseSchedulesList leaseId={selectedLease.id} />
                  )}
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
        </DashboardSidebar>
      </DashboardSplitGrid>
    </DashboardLayout>
  );
}
