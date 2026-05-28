"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function NewLeaseButton(): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", "create");
    params.delete("selectedLeaseId");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const mode = searchParams.get("mode");

  return (
    <Button onClick={handleClick} disabled={mode !== null} size="lg">
      <span className="material-symbols-outlined mr-2 select-none" data-icon="add">add</span>
      Nouveau Bail
    </Button>
  );
}
