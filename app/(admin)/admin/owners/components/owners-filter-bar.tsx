"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SearchPanel, SearchPanelSelect } from "@/components/ui/search-panel";
import { Button } from "@/components/ui/button";

export function OwnersFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("search") || "";
  const typeFilter = searchParams.get("type") || "all";

  const handleSearchChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) params.set("search", val);
    else params.delete("search");
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

  const handleCreate = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("edit", "true");
    params.delete("selectedId");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex w-full justify-between items-start gap-4">
      <SearchPanel
        searchPlaceholder="Rechercher par nom, email ou téléphone..."
        searchDefaultValue={searchTerm}
        onSearchChange={handleSearchChange}
      >
        <SearchPanelSelect
          label="Type:"
          value={typeFilter}
          onChange={handleTypeChange}
          options={[
            { label: "Tous", value: "all" },
            { label: "Particuliers", value: "INDIVIDUAL" },
            { label: "Sociétés", value: "COMPANY" },
          ]}
        />
      </SearchPanel>
      
      <Button onClick={handleCreate} size="lg">
        <span className="material-symbols-outlined mr-2 select-none" data-icon="person_add">
          person_add
        </span>
        Nouveau Propriétaire
      </Button>
    </div>
  );
}
