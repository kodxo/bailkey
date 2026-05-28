"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function TenantEditButton({ tenantId }: { tenantId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    const params = new URLSearchParams(searchParams.toString());
    params.set("selectedId", tenantId);
    params.set("edit", "true");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Button variant="outline" size="sm" onClick={handleStartEdit}>
      <span
        className="material-symbols-outlined text-sm mr-1 select-none"
        data-icon="edit"
      >
        edit
      </span>
      Éditer
    </Button>
  );
}
