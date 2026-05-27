import React from "react";
import { getTenants } from "@/lib/dal/tenants";
import { TenantsDashboard } from "./tenants-dashboard";

export async function TenantsDataContainer(): Promise<React.JSX.Element> {
  const res = await getTenants();
  const initialTenants = res.success && res.tenants ? res.tenants : [];

  return <TenantsDashboard initialTenants={initialTenants} />;
}
