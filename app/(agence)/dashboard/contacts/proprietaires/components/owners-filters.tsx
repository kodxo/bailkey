"use client";

import React from "react";
import { SearchPanel, SearchPanelSelect } from "@/components/ui/search-panel";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function OwnersFilters(): React.JSX.Element {
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
    </SearchPanel>
  );
}
