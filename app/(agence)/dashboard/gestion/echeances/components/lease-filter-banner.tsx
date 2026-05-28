"use client";

import React from "react";
import { ActiveFilterBanner } from "@/components/ui/active-filter-banner";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function LeaseFilterBanner(): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const leaseId = searchParams.get("leaseId");

  if (!leaseId) {
    return <></>;
  }

  const clearLeaseFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("leaseId");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <ActiveFilterBanner
      label="Filtré sur un contrat spécifique"
      onClear={clearLeaseFilter}
    />
  );
}
