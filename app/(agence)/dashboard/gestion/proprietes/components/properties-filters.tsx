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
  const minRent = searchParams.get("minRent") || "";
  const maxRent = searchParams.get("maxRent") || "";
  const roomsCount = searchParams.get("roomsCount") || "all";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("type");
    params.delete("minRent");
    params.delete("maxRent");
    params.delete("roomsCount");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const activeFiltersCount = 
    (currentType !== "all" ? 1 : 0) + 
    (minRent ? 1 : 0) + 
    (maxRent ? 1 : 0) + 
    (roomsCount !== "all" ? 1 : 0);

  return (
    <SearchPanel searchPlaceholder="Rechercher par désignation, réf ou ville...">
      <SearchPanelSelect
        label="Statut:"
        value={currentStatus}
        onChange={(e) => updateFilters("status", e.target.value)}
        options={[
          { label: "Tous", value: "all" },
          { label: "Disponible", value: "AVAILABLE" },
          { label: "Loué", value: "RENTED" },
          { label: "En travaux", value: "UNDER_MAINTENANCE" },
          { label: "Indisponible", value: "UNAVAILABLE" },
        ]}
      />

      <AdvancedFilterDialog
        activeFiltersCount={activeFiltersCount}
        onReset={resetFilters}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-variant">Type de bien</label>
            <Select
              value={currentType}
              onChange={(e) => updateFilters("type", e.target.value)}
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

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-variant">Loyer de base</label>
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
            <label className="text-sm font-bold text-on-surface-variant">Nombre de pièces</label>
            <Select
              value={roomsCount}
              onChange={(e) => updateFilters("roomsCount", e.target.value)}
              options={[
                { label: "Tous", value: "all" },
                { label: "1 pièce", value: "1" },
                { label: "2 pièces", value: "2" },
                { label: "3 pièces", value: "3" },
                { label: "4 pièces", value: "4" },
                { label: "5+ pièces", value: "5" },
              ]}
            />
          </div>
        </div>
      </AdvancedFilterDialog>
    </SearchPanel>
  );
}
