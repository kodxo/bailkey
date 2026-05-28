"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SearchPanel, SearchPanelSelect } from "@/components/ui/search-panel";

export function UsersFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("search") || "";
  const roleFilter = searchParams.get("role") || "all";

  const handleSearchChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) params.set("search", val);
    else params.delete("search");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== "all") params.set("role", val);
    else params.delete("role");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <SearchPanel
      searchPlaceholder="Rechercher par nom ou email (serveur)..."
      searchDefaultValue={searchTerm}
      onSearchChange={handleSearchChange}
    >
      <SearchPanelSelect
        label="Rôle:"
        value={roleFilter}
        onChange={handleRoleChange}
        options={[
          { label: "Tous", value: "all" },
          { label: "Administrateurs", value: "admin" },
          { label: "Membres", value: "user" },
        ]}
      />
    </SearchPanel>
  );
}
