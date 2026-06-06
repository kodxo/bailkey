"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SearchPanel, SearchPanelSelect } from "@/components/ui/search-panel";
import { AdvancedFilterDialog } from "@/components/ui/advanced-filter-dialog";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export interface LeaseChargesFiltersProps {
  properties: { id: string; name: string }[];
  tenants: { id: string; name: string }[];
  chargeTypes: { id: string; name: string }[];
  children?: React.ReactNode;
}

export function LeaseChargesFilters({ properties, tenants, chargeTypes, children }: LeaseChargesFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPropertyId = searchParams.get("propertyId") || "all";
  const currentTenantId = searchParams.get("tenantId") || "all";
  const currentChargeTypeId = searchParams.get("chargeTypeId") || "all";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("propertyId");
    params.delete("tenantId");
    params.delete("chargeTypeId");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const activeFiltersCount = 
    (currentPropertyId !== "all" ? 1 : 0) +
    (currentTenantId !== "all" ? 1 : 0) +
    (currentChargeTypeId !== "all" ? 1 : 0);

  return (
    <SearchPanel searchPlaceholder="Rechercher (réf bail, nom locataire)...">
      <SearchPanelSelect
        label="Type de charge:"
        value={currentChargeTypeId}
        onChange={(e) => updateFilters("chargeTypeId", e.target.value)}
        options={[
          { label: "Tous", value: "all" },
          ...chargeTypes.map(ct => ({ label: ct.name, value: ct.id }))
        ]}
      />

      <AdvancedFilterDialog 
        activeFiltersCount={activeFiltersCount} 
        onReset={resetFilters}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-variant">Propriété</label>
            <Select
              value={currentPropertyId}
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
              value={currentTenantId}
              onChange={(e) => updateFilters("tenantId", e.target.value)}
              options={[
                { label: "Tous", value: "all" },
                ...tenants.map(t => ({ label: t.name, value: t.id }))
              ]}
            />
          </div>
        </div>
      </AdvancedFilterDialog>
      {children}
    </SearchPanel>
  );
}
