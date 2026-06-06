"use client";

import React from "react";
import { SearchPanel, SearchPanelSelect } from "@/components/ui/search-panel";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AdvancedFilterDialog } from "@/components/ui/advanced-filter-dialog";

export function TenantsFilters(): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") || "all";

  return (
    <SearchPanel searchPlaceholder="Rechercher par nom, email, téléphone...">
      <SearchPanelSelect
        label="Type:"
        value={currentType}
        onChange={(e) => {
          const val = e.target.value;
          const params = new URLSearchParams(searchParams.toString());
          if (val && val !== "all") params.set("type", val);
          else params.delete("type");
          params.set("page", "1");
          router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }}
        options={[
          { label: "Tous", value: "all" },
          { label: "Particuliers", value: "INDIVIDUAL" },
          { label: "Sociétés", value: "COMPANY" },
        ]}
      />
      <AdvancedFilterDialog
        activeFiltersCount={searchParams.get("hasDocuments") ? 1 : 0}
        onReset={() => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("hasDocuments");
          params.set("page", "1");
          router.push(`${pathname}?${params.toString()}`);
        }}
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-on-surface-variant">Documents fournis</label>
          <select
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={searchParams.get("hasDocuments") || "all"}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams.toString());
              if (e.target.value && e.target.value !== "all") params.set("hasDocuments", e.target.value);
              else params.delete("hasDocuments");
              params.set("page", "1");
              router.push(`${pathname}?${params.toString()}`);
            }}
          >
            <option value="all">Tous</option>
            <option value="yes">Oui</option>
            <option value="no">Non</option>
          </select>
        </div>
      </AdvancedFilterDialog>
    </SearchPanel>
  );
}
