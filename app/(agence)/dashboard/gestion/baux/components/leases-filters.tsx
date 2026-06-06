"use client";

import React from "react";
import { SearchPanel, SearchPanelSelect } from "@/components/ui/search-panel";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AdvancedFilterDialog } from "@/components/ui/advanced-filter-dialog";
import { Select } from "@/components/ui/select";

export function LeasesFilters(): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") || "all";
  const currentFrequency = searchParams.get("frequency") || "all";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <SearchPanel searchPlaceholder="Rechercher par propriété, référence ou locataire...">
      <SearchPanelSelect
        label="Statut:"
        value={currentStatus}
        onChange={(e) => updateFilters("status", e.target.value)}
        options={[
          { label: "Tous", value: "all" },
          { label: "Brouillon", value: "DRAFT" },
          { label: "Actif", value: "ACTIVE" },
          { label: "Résilié", value: "TERMINATED" },
          { label: "Expiré", value: "EXPIRED" },
        ]}
      />

      <AdvancedFilterDialog
        activeFiltersCount={currentFrequency !== "all" ? 1 : 0}
        onReset={() => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("frequency");
          params.set("page", "1");
          router.push(`${pathname}?${params.toString()}`);
        }}
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-on-surface-variant">Fréquence de paiement</label>
          <Select
            value={currentFrequency}
            onChange={(e) => updateFilters("frequency", e.target.value)}
            options={[
              { label: "Toutes", value: "all" },
              { label: "Mensuelle", value: "MONTHLY" },
              { label: "Trimestrielle", value: "QUARTERLY" },
              { label: "Semestrielle", value: "SEMI_ANNUALLY" },
              { label: "Annuelle", value: "ANNUALLY" },
            ]}
          />
        </div>
      </AdvancedFilterDialog>
    </SearchPanel>
  );
}
