import React from "react";
import { getTenants } from "@/lib/dal/tenants";
import { TenantsTableClient } from "./tenants-table-client";
import { LegalEntityType } from "@/lib/generated/prisma/enums";

interface TenantsTableServerProps {
  page: number;
  pageSize: number;
  search: string;
  type: string;
}

export async function TenantsTableServer({
  page,
  pageSize,
  search,
  type,
}: TenantsTableServerProps): Promise<React.JSX.Element> {
  const { tenants } = await getTenants();

  let displayTenants = tenants || [];

  if (type !== "all") {
    displayTenants = displayTenants.filter((t) => t.type === type);
  }

  if (search) {
    const s = search.toLowerCase();
    displayTenants = displayTenants.filter((t) => {
      const isCompany = t.type === LegalEntityType.COMPANY;
      const displayName = isCompany
        ? t.companyName?.toLowerCase() || ""
        : `${t.firstName || ""} ${t.lastName || ""}`.toLowerCase();
      
      return (
        displayName.includes(s) ||
        (t.email && t.email.toLowerCase().includes(s)) ||
        (t.phone && t.phone.toLowerCase().includes(s))
      );
    });
  }

  const finalTotalCount = displayTenants.length;

  const startIndex = (page - 1) * pageSize;
  displayTenants = displayTenants.slice(startIndex, startIndex + pageSize);

  return (
    <TenantsTableClient
      tenants={displayTenants}
      totalCount={finalTotalCount}
      currentPage={page}
      pageSize={pageSize}
    />
  );
}
