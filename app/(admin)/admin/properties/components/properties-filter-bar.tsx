"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SearchPanel, SearchPanelSelect } from "@/components/ui/search-panel";
import { Button } from "@/components/ui/button";

export function PropertiesFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("search") || "";
  const statusFilter = searchParams.get("status") || "all";
  const typeFilter = searchParams.get("type") || "all";

  const updateParams = (key: string, val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== "all") params.set(key, val);
    else params.delete(key);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleCreate = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("edit", "true");
    params.delete("selectedId");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex w-full justify-between items-start gap-4">
      <SearchPanel
        searchPlaceholder="Rechercher par désignation, réf ou ville..."
        searchDefaultValue={searchTerm}
        onSearchChange={(val) => updateParams("search", val)}
      >
        <SearchPanelSelect
          label="Statut:"
          value={statusFilter}
          onChange={(e) => updateParams("status", e.target.value)}
          options={[
            { label: "Tous", value: "all" },
            { label: "Disponible", value: "AVAILABLE" },
            { label: "Loué", value: "RENTED" },
            { label: "En travaux", value: "UNDER_MAINTENANCE" },
            { label: "Indisponible", value: "UNAVAILABLE" },
          ]}
        />
        <SearchPanelSelect
          label="Type:"
          value={typeFilter}
          onChange={(e) => updateParams("type", e.target.value)}
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
      </SearchPanel>
      
      <Button onClick={handleCreate} size="lg">
        <span className="material-symbols-outlined mr-2 select-none" data-icon="add">
          add
        </span>
        Nouvelle Propriété
      </Button>
    </div>
  );
}
