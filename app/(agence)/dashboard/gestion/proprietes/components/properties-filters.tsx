"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";

export function PropertiesFilters(): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentStatus = searchParams.get("status") || "all";
  const currentType = searchParams.get("type") || "all";

  const [localSearch, setLocalSearch] = React.useState(currentSearch);

  const [debouncedSearch] = useDebounce(localSearch, 300);

  React.useEffect(() => {
    const currentSearchParam = searchParams.get("search") || "";
    if (currentSearchParam === debouncedSearch) return;

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedSearch, pathname, router, searchParams]);

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
        <Input
          iconName="search"
          placeholder="Rechercher par désignation, réf ou ville..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          wrapperClassName="border-none w-full bg-transparent px-sm py-sm"
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
