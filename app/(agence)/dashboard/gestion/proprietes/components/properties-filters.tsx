"use client";

import React from "react";
import { SearchPanel, SearchPanelSelect } from "@/components/ui/search-panel";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AdvancedFilterDialog } from "@/components/ui/advanced-filter-dialog";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function PropertiesFilters(): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") || "all";
  const currentType = searchParams.get("type") || "all";

  return (
    <SearchPanel searchPlaceholder="Rechercher par désignation, réf ou ville...">
      <SearchPanelSelect
        label="Statut:"
        value={currentStatus}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("status", e.target.value);
          params.set("page", "1");
          router.push(`${pathname}?${params.toString()}`);
        }}
        options={[
          { label: "Tous", value: "all" },
          { label: "Disponible", value: "AVAILABLE" },
          { label: "Loué", value: "RENTED" },
          { label: "En travaux", value: "UNDER_MAINTENANCE" },
          { label: "Indisponible", value: "UNAVAILABLE" },
        ]}
      />

      {/* Filtres avancés dans la modale */}
      <AdvancedFilterDialog
        activeFiltersCount={currentType !== "all" ? 1 : 0}
        onReset={() => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("type");
          params.set("page", "1");
          router.push(`${pathname}?${params.toString()}`);
        }}
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-on-surface-variant">Type de bien</label>
          <Select
            value={currentType}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("type", e.target.value);
              params.set("page", "1");
              router.push(`${pathname}?${params.toString()}`);
            }}
            options={[
              { label: "Tous", value: "all" },
              { label: "Appartement", value: "APARTMENT" },
              { label: "Villa", value: "VILLA" },
              { label: "Studio", value: "STUDIO" },
              { label: "Local Commercial", value: "COMMERCIAL_SPACE" },
              { label: "Terrain", value: "LAND" },
              { label: "Entrepôt", value: "WAREHOUSE" },
            ]}
          />
        </div>
        
        {/* Exemple d'espace pour ajouter un filtre relationnel (Propriétaire) */}
        <div className="flex flex-col gap-2 mt-2">
          <label className="text-sm font-bold text-on-surface-variant">Propriétaire (Exemple)</label>
          <Select
            value="all"
            onChange={() => {}}
            options={[
              { label: "Tous les propriétaires", value: "all" },
              { label: "Jean Dupont", value: "1" },
            ]}
          />
        </div>
      </AdvancedFilterDialog>
    </SearchPanel>
  );
}
