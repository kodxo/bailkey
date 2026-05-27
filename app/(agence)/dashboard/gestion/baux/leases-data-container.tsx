import React from "react";
import { getLeases } from "@/lib/dal/leases";
import { getProperties } from "@/lib/dal/properties";
import { getTenants } from "@/lib/dal/tenants";
import { LeasesDashboard } from "./leases-dashboard";

export async function LeasesDataContainer(): Promise<React.JSX.Element> {
  const [leasesRes, propsRes, tenantsRes] = await Promise.all([
    getLeases(),
    getProperties(),
    getTenants(),
  ]);
  const initialLeases = leasesRes.success && leasesRes.leases ? leasesRes.leases : [];
  const initialProperties = propsRes.success && propsRes.properties ? propsRes.properties : [];
  const initialTenants = tenantsRes.success && tenantsRes.tenants ? tenantsRes.tenants : [];

  return (
    <LeasesDashboard
      initialLeases={initialLeases}
      initialProperties={initialProperties}
      initialTenants={initialTenants}
    />
  );
}
