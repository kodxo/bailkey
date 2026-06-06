"use client";

import React from "react";
import { SearchPanel, SearchPanelSelect } from "@/components/ui/search-panel";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { LeaseStatus, PaymentFrequency } from "@/lib/generated/prisma/enums";
import { AdvancedFilterDialog } from "@/components/ui/advanced-filter-dialog";
import { Select } from "@/components/ui/select";

interface LeasesFiltersProps {
  properties?: { id: string; name: string }[];
  tenants?: { id: string; name: string }[];
}

export function LeasesFilters({ properties = [], tenants = [] }: LeasesFiltersProps): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") || "all";
  const currentFrequency = searchParams.get("frequency") || "all";
  const minRent = searchParams.get("minRent") || "";
  const maxRent = searchParams.get("maxRent") || "";
  const hasDeposit = searchParams.get("hasDeposit") || "all";
  const propertyId = searchParams.get("propertyId") || "all";
  const tenantId = searchParams.get("tenantId") || "all";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("frequency");
    params.delete("minRent");
    params.delete("maxRent");
    params.delete("hasDeposit");
    params.delete("propertyId");
    params.delete("tenantId");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const activeFiltersCount = 
    (currentFrequency !== "all" ? 1 : 0) + 
    (minRent ? 1 : 0) + 
    (maxRent ? 1 : 0) + 
    (hasDeposit !== "all" ? 1 : 0) +
    (propertyId !== "all" ? 1 : 0) +
    (tenantId !== "all" ? 1 : 0);

  return (
    <SearchPanel searchPlaceholder="Rechercher par propriété, référence ou locataire...">
      <SearchPanelSelect
        label="Statut:"
        value={currentStatus}
        onChange={(e) => updateFilters("status", e.target.value)}
        options={[
          { label: "Tous", value: "all" },
          { label: "Brouillon", value: LeaseStatus.DRAFT },
          { label: "Actif", value: LeaseStatus.ACTIVE },
          { label: "Résilié", value: LeaseStatus.TERMINATED },
          { label: "Expiré", value: LeaseStatus.EXPIRED },
        ]}
      />

      <AdvancedFilterDialog
        activeFiltersCount={activeFiltersCount}
        onReset={resetFilters}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-variant">Fréquence de paiement</label>
            <Select
              value={currentFrequency}
              onChange={(e) => updateFilters("frequency", e.target.value)}
              options={[
                { label: "Toutes", value: "all" },
                { label: "Mensuelle", value: PaymentFrequency.MONTHLY },
                { label: "Trimestrielle", value: PaymentFrequency.QUARTERLY },
                { label: "Semestrielle", value: PaymentFrequency.SEMI_ANNUALLY },
                { label: "Annuelle", value: PaymentFrequency.ANNUALLY },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-variant">Montant du loyer</label>
            <div className="flex gap-2 items-center">
              <input 
                type="number"
                placeholder="Min"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={minRent}
                onChange={(e) => updateFilters("minRent", e.target.value)}
              />
              <span className="text-on-surface-variant">-</span>
              <input 
                type="number"
                placeholder="Max"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={maxRent}
                onChange={(e) => updateFilters("maxRent", e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-variant">Dépôt de garantie</label>
            <Select
              value={hasDeposit}
              onChange={(e) => updateFilters("hasDeposit", e.target.value)}
              options={[
                { label: "Tous", value: "all" },
                { label: "Avec dépôt", value: "yes" },
                { label: "Sans dépôt", value: "no" },
              ]}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-variant">Propriété concernée</label>
            <Select
              value={propertyId}
              onChange={(e) => updateFilters("propertyId", e.target.value)}
              options={[
                { label: "Toutes", value: "all" },
                ...properties.map(p => ({ label: p.name, value: p.id }))
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-variant">Locataire</label>
            <Select
              value={tenantId}
              onChange={(e) => updateFilters("tenantId", e.target.value)}
              options={[
                { label: "Tous", value: "all" },
                ...tenants.map(t => ({ label: t.name, value: t.id }))
              ]}
            />
          </div>
        </div>
      </AdvancedFilterDialog>
    </SearchPanel>
  );
}
