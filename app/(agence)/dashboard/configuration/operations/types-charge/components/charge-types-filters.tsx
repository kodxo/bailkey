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

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

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
        activeFiltersCount={searchParams.get("isDefault") ? 1 : 0}
        onReset={() => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("isDefault");
          params.set("page", "1");
          router.push(`${pathname}?${params.toString()}`);
        }}
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-on-surface-variant">Par défaut</label>
          <Select
            value={searchParams.get("isDefault") || "all"}
            onChange={(e) => updateFilters("isDefault", e.target.value)}
            options={[
              { label: "Tous", value: "all" },
              { label: "Oui", value: "true" },
              { label: "Non", value: "false" },
            ]}
          />
        </div>
      </AdvancedFilterDialog>
    </SearchPanel>
  );
}
