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
  const paymentMethod = searchParams.get("paymentMethod") || "all";
  const hasPartial = searchParams.get("hasPartial") || "all";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("month");
    params.delete("paymentMethod");
    params.delete("hasPartial");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const activeFiltersCount = 
    (currentMonth !== "all" ? 1 : 0) + 
    (paymentMethod !== "all" ? 1 : 0) + 
    (hasPartial !== "all" ? 1 : 0);

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
        activeFiltersCount={activeFiltersCount}
        onReset={resetFilters}
      >
        <div className="flex flex-col gap-4">
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

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-variant">Mode de paiement préférentiel</label>
            <Select
              value={paymentMethod}
              onChange={(e) => updateFilters("paymentMethod", e.target.value)}
              options={[
                { label: "Tous", value: "all" },
                { label: "Virement bancaire", value: "BANK_TRANSFER" },
                { label: "Espèces", value: "CASH" },
                { label: "Mobile Money", value: "MOBILE_MONEY" },
                { label: "Chèque", value: "CHEQUE" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-variant">Reste à payer</label>
            <Select
              value={hasPartial}
              onChange={(e) => updateFilters("hasPartial", e.target.value)}
              options={[
                { label: "Tous", value: "all" },
                { label: "Oui (Solde restant > 0)", value: "yes" },
                { label: "Non (Intégralement payé)", value: "no" },
              ]}
            />
          </div>
        </div>
      </AdvancedFilterDialog>
    </SearchPanel>
  );
}
