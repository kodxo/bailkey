"use client";

import React from "react";
import { Search } from "@/components/ui/search";
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
    <div className="bg-surface-container-lowest border border-outline-variant flex flex-col sm:flex-row items-stretch sm:items-center justify-between shadow-xs overflow-hidden">
      <div className="flex-1 min-w-[200px] flex items-center border-b sm:border-b-0 sm:border-r border-outline-variant">
        <Search
          placeholder="Rechercher par désignation, réf ou ville..."
        />
      </div>
      <div className="flex items-center gap-2 px-sm py-xs">
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
      </div>
    </div>
  );
}
