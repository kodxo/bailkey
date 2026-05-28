"use client";

import React from "react";
import { SearchPanel, SearchPanelSelect } from "@/components/ui/search-panel";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

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
      <SearchPanelSelect
        label="Type:"
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
    </SearchPanel>
  );
}
