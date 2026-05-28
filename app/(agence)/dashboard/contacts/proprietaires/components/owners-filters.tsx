"use client";

import React from "react";
import { SearchPanel, SearchPanelInput, SearchPanelFilters } from "@/components/ui/search-panel";
import { Select } from "@/components/ui/select";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function OwnersFilters(): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") || "all";


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
      <SearchPanelInput placeholder="Rechercher par nom, email, téléphone..." />
      <SearchPanelFilters>
        <Select
          label="Type:"
          value={currentType}
          onChange={handleTypeChange}
          options={[
            { label: "Tous", value: "all" },
            { label: "Personne Physique", value: "INDIVIDUAL" },
            { label: "Personne Morale", value: "COMPANY" },
          ]}
          wrapperClassName="border-none py-sm"
        />
      </SearchPanelFilters>
    </SearchPanel>
  );
}
