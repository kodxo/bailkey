"use client";

import React from "react";
import { SearchPanel, SearchPanelSelect } from "@/components/ui/search-panel";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { LegalEntityType } from "@/lib/generated/prisma/enums";
import { AdvancedFilterDialog } from "@/components/ui/advanced-filter-dialog";

export function OwnersFilters(): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") || "all";
  const hasDocuments = searchParams.get("hasDocuments") || "all";
  const hasActiveProperties = searchParams.get("hasActiveProperties") || "all";
  const accountBalance = searchParams.get("accountBalance") || "all";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("hasDocuments");
    params.delete("hasActiveProperties");
    params.delete("accountBalance");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const activeFiltersCount = 
    (hasDocuments !== "all" ? 1 : 0) + 
    (hasActiveProperties !== "all" ? 1 : 0) + 
    (accountBalance !== "all" ? 1 : 0);

  return (
    <SearchPanel searchPlaceholder="Rechercher par nom, email, téléphone...">
      <SearchPanelSelect
        label="Type:"
        value={currentType}
        onChange={(e) => updateFilters("type", e.target.value)}
        options={[
          { label: "Tous", value: "all" },
          { label: "Particuliers", value: LegalEntityType.INDIVIDUAL },
          { label: "Sociétés", value: LegalEntityType.COMPANY },
        ]}
      />
      <AdvancedFilterDialog
        activeFiltersCount={activeFiltersCount}
        onReset={resetFilters}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-variant">Documents fournis</label>
            <select
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={hasDocuments}
              onChange={(e) => updateFilters("hasDocuments", e.target.value)}
            >
              <option value="all">Tous</option>
              <option value="yes">Oui</option>
              <option value="no">Non</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-variant">Propriétés Actives</label>
            <select
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={hasActiveProperties}
              onChange={(e) => updateFilters("hasActiveProperties", e.target.value)}
            >
              <option value="all">Tous</option>
              <option value="yes">A des biens actifs</option>
              <option value="no">Aucun bien actif</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-variant">Solde Comptable</label>
            <select
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={accountBalance}
              onChange={(e) => updateFilters("accountBalance", e.target.value)}
            >
              <option value="all">Tous</option>
              <option value="debt">En dette</option>
              <option value="credit">En crédit</option>
              <option value="balanced">À jour</option>
            </select>
          </div>
        </div>
      </AdvancedFilterDialog>
    </SearchPanel>
  );
}
