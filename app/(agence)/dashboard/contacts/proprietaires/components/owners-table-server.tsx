import React from "react";
import { getOwners } from "@/lib/dal/owners";
import { OwnersTableClient } from "./owners-table-client";
import { LegalEntityType } from "@/lib/generated/prisma/enums";

interface OwnersTableServerProps {
  page: number;
  pageSize: number;
  search: string;
  type: string;
}

export async function OwnersTableServer({
  page,
  pageSize,
  search,
  type,
}: OwnersTableServerProps): Promise<React.JSX.Element> {
  const { owners } = await getOwners();

  let displayOwners = owners || [];

  if (type !== "all") {
    displayOwners = displayOwners.filter((o) => o.type === type);
  }

  if (search) {
    const s = search.toLowerCase();
    displayOwners = displayOwners.filter((o) => {
      const isCompany = o.type === LegalEntityType.COMPANY;
      const displayName = isCompany
        ? o.companyName?.toLowerCase() || ""
        : `${o.firstName || ""} ${o.lastName || ""}`.toLowerCase();
      
      return (
        displayName.includes(s) ||
        (o.email && o.email.toLowerCase().includes(s)) ||
        (o.phone && o.phone.toLowerCase().includes(s))
      );
    });
  }

  const finalTotalCount = displayOwners.length;

  const startIndex = (page - 1) * pageSize;
  displayOwners = displayOwners.slice(startIndex, startIndex + pageSize);

  return (
    <OwnersTableClient
      owners={displayOwners}
      totalCount={finalTotalCount}
      currentPage={page}
      pageSize={pageSize}
    />
  );
}
