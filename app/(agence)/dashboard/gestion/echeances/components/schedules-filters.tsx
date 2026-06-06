"use client";

import React from "react";
import { SearchPanel, SearchPanelSelect } from "@/components/ui/search-panel";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AdvancedFilterDialog } from "@/components/ui/advanced-filter-dialog";
import { Select } from "@/components/ui/select";

export function SchedulesFilters(): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") || "all";
  const currentMonth = searchParams.get("month") || "all";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <SearchPanel searchPlaceholder="Rechercher locataire, bien, paiement...">
      <SearchPanelSelect
        label="Filtrer par :"
        value={currentStatus}
        onChange={(e) => updateFilters("status", e.target.value)}
        options={[
          { label: "Tous (Priorité Retards)", value: "all" },
          { label: "En retard", value: "OVERDUE" },
          { label: "À venir", value: "PENDING" },
          { label: "Partiel", value: "PARTIAL" },
          { label: "Payé", value: "PAID" },
        ]}
      />

      <AdvancedFilterDialog
        activeFiltersCount={currentMonth !== "all" ? 1 : 0}
        onReset={() => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("month");
          params.set("page", "1");
          router.push(`${pathname}?${params.toString()}`);
        }}
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-on-surface-variant">Mois d'échéance</label>
          <Select
            value={currentMonth}
            onChange={(e) => updateFilters("month", e.target.value)}
            options={[
              { label: "Tous", value: "all" },
              { label: "Ce mois", value: "current" },
              { label: "Mois dernier", value: "last" },
              { label: "Le mois prochain", value: "next" },
            ]}
          />
        </div>
      </AdvancedFilterDialog>
    </SearchPanel>
  );
}
