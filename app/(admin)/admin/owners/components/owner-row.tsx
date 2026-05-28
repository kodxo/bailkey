"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { TableRow } from "@/components/ui/table";

export function OwnerRow({
  children,
  ownerId,
  isSelected,
}: {
  children: React.ReactNode;
  ownerId: string;
  isSelected: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("selectedId", ownerId);
    params.delete("edit");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <TableRow
      onClick={handleClick}
      className={`cursor-pointer transition-colors ${
        isSelected ? "bg-primary-container/10 font-medium" : ""
      }`}
    >
      {children}
    </TableRow>
  );
}
