import React from "react";
import { getLeases } from "@/lib/dal/leases";
import { LeasesTableClient } from "./leases-table-client";

interface LeasesTableServerProps {
  page: number;
  pageSize: number;
  search: string;
  status: string;
  frequency?: string;
}

export async function LeasesTableServer({
  page,
  pageSize,
  search,
  status,
  frequency,
}: LeasesTableServerProps): Promise<React.JSX.Element> {
  const { leases, totalCount } = await getLeases({ 
    page, 
    pageSize, 
    search, 
    status,
    paymentFrequency: frequency && frequency !== "all" ? frequency as any : undefined
  });

  return (
    <LeasesTableClient
      leases={leases}
      totalCount={totalCount}
      currentPage={page}
      pageSize={pageSize}
    />
  );
}
