"use client";

import React from "react";
import { SearchPanel, SearchPanelSelect } from "@/components/ui/search-panel";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AdvancedFilterDialog } from "@/components/ui/advanced-filter-dialog";
import { Select } from "@/components/ui/select";

export function ChargeTypesFilters(): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentAccountingMode = searchParams.get("accountingMode") || "all";
  const isDefault = searchParams.get("isDefault") || "all";
  const isUtility = searchParams.get("isUtility") || "all";
  const hasTax = searchParams.get("hasTax") || "all";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("isDefault");
    params.delete("isUtility");
    params.delete("hasTax");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const activeFiltersCount = 
    (isDefault !== "all" ? 1 : 0) + 
    (isUtility !== "all" ? 1 : 0) + 
    (hasTax !== "all" ? 1 : 0);

  return (
    <SearchPanel searchPlaceholder="Rechercher une charge...">
      <SearchPanelSelect
        label="Mode Comptable:"
        value={currentAccountingMode}
        onChange={(e) => updateFilters("accountingMode", e.target.value)}
        options={[
          { label: "Tous", value: "all" },
          { label: "Crédit (Encaissement)", value: "CREDIT" },
          { label: "Débit (Dépense)", value: "DEBIT" },
        ]}
      />

      <AdvancedFilterDialog
        activeFiltersCount={activeFiltersCount}
        onReset={resetFilters}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-variant">Par défaut</label>
            <Select
              value={isDefault}
              onChange={(e) => updateFilters("isDefault", e.target.value)}
              options={[
                { label: "Tous", value: "all" },
                { label: "Oui", value: "true" },
                { label: "Non", value: "false" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-variant">Est un utilitaire (Eau, Élec...)</label>
            <Select
              value={isUtility}
              onChange={(e) => updateFilters("isUtility", e.target.value)}
              options={[
                { label: "Tous", value: "all" },
                { label: "Oui", value: "true" },
                { label: "Non", value: "false" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-variant">Soumis à la TVA</label>
            <Select
              value={hasTax}
              onChange={(e) => updateFilters("hasTax", e.target.value)}
              options={[
                { label: "Tous", value: "all" },
                { label: "Oui", value: "true" },
                { label: "Non", value: "false" },
              ]}
            />
          </div>
        </div>
      </AdvancedFilterDialog>
    </SearchPanel>
  );
}
