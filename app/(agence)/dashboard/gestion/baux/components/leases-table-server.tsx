import React from "react";
import { getLeases } from "@/lib/dal/leases";
import { LeasesTableClient } from "./leases-table-client";

interface LeasesTableServerProps {
  page: number;
  pageSize: number;
  search: string;
  status: string;
  frequency: string;
  propertyId?: string;
  tenantId?: string;
  minRent?: string;
  maxRent?: string;
  hasDeposit?: string;
}

export async function LeasesTableServer({
  page,
  pageSize,
  search,
  status,
  frequency,
  propertyId,
  tenantId,
  minRent,
  maxRent,
  hasDeposit
}: LeasesTableServerProps) {
  const { leases, totalCount } = await getLeases({
    page,
    pageSize,
    search,
    status,
    paymentFrequency: frequency && frequency !== "all" ? frequency as any : undefined,
    propertyId: propertyId && propertyId !== "all" ? propertyId : undefined,
    tenantId: tenantId && tenantId !== "all" ? tenantId : undefined,
  });

  let displayLeases = leases || [];

  if (minRent) {
    displayLeases = displayLeases.filter(l => (l.rentAmount || 0) >= parseFloat(minRent));
  }
  if (maxRent) {
    displayLeases = displayLeases.filter(l => (l.rentAmount || 0) <= parseFloat(maxRent));
  }
  if (hasDeposit && hasDeposit !== "all") {
    displayLeases = displayLeases.filter(l => 
      hasDeposit === "yes" ? (l.depositAmount || 0) > 0 : (!l.depositAmount || l.depositAmount === 0)
    );
  }

  return (
    <LeasesTableClient
      leases={displayLeases}
      totalCount={totalCount}
      currentPage={page}
      pageSize={pageSize}
    />
  );
}
