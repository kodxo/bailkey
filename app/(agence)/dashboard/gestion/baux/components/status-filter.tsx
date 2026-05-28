"use client";

import React from "react";
import { Select } from "@/components/ui/select";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function StatusFilter(): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") || "all";

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== "all") params.set("status", val);
    else params.delete("status");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Select
      label="Statut:"
      value={currentStatus}
      onChange={handleStatusChange}
      options={[
        { label: "Tous", value: "all" },
        { label: "Brouillon", value: "DRAFT" },
        { label: "Actif", value: "ACTIVE" },
        { label: "Résilié", value: "TERMINATED" },
        { label: "Expiré", value: "EXPIRED" },
      ]}
      wrapperClassName="border-none py-sm"
    />
  );
}
