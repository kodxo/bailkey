"use client";

import React from "react";
import { Select } from "@/components/ui/select";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function SchedulesStatusFilter(): React.JSX.Element {
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
      label="Filtrer par :"
      value={currentStatus}
      onChange={handleStatusChange}
      options={[
        { label: "Tous (Priorité Retards)", value: "all" },
        { label: "En retard", value: "OVERDUE" },
        { label: "À venir", value: "PENDING" },
        { label: "Partiel", value: "PARTIAL" },
        { label: "Payé", value: "PAID" },
      ]}
      wrapperClassName="border-none py-sm min-w-[200px]"
    />
  );
}
