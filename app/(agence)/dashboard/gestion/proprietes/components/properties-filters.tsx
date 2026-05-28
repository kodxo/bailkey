"use client";

import React from "react";
import { SearchPanel, SearchPanelInput, SearchPanelFilters } from "@/components/ui/search-panel";
import { Select } from "@/components/ui/select";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function PropertiesFilters(): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") || "all";
  const currentType = searchParams.get("type") || "all";


  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== "all") params.set("status", val);
    else params.delete("status");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== "all") params.set("type", val);
    else params.delete("type");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <SearchPanel>
      <SearchPanelInput placeholder="Rechercher par désignation, réf ou ville..." />
      <SearchPanelFilters>
        <Select
          label="Statut:"
          value={currentStatus}
          onChange={handleStatusChange}
          options={[
            { label: "Tous", value: "all" },
            { label: "Disponible", value: "AVAILABLE" },
            { label: "Loué", value: "RENTED" },
            { label: "En travaux", value: "UNDER_MAINTENANCE" },
            { label: "Indisponible", value: "UNAVAILABLE" },
          ]}
          wrapperClassName="border-none py-sm"
        />
        <Select
          label="Type:"
          value={currentType}
          onChange={handleTypeChange}
          options={[
            { label: "Tous", value: "all" },
            { label: "Appartement", value: "APARTMENT" },
            { label: "Villa", value: "VILLA" },
            { label: "Studio", value: "STUDIO" },
            { label: "Commercial", value: "COMMERCIAL_SPACE" },
            { label: "Terrain", value: "LAND" },
            { label: "Entrepôt", value: "WAREHOUSE" },
          ]}
          wrapperClassName="border-none py-sm"
        />
      </SearchPanelFilters>
    </SearchPanel>
  );
}
