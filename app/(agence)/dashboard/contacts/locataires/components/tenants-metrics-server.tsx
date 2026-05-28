import React from "react";
import { getTenants } from "@/lib/dal/tenants";
import { TenantsMetrics } from "./tenants-metrics";

export async function TenantsMetricsServer(): Promise<React.JSX.Element> {
  const { tenants, totalCount } = await getTenants();

  const activeCount = (tenants || []).filter(t => t.activeLeasesCount > 0).length;

  return (
    <TenantsMetrics
      totalCount={totalCount || 0}
      activeCount={activeCount}
    />
  );
}
