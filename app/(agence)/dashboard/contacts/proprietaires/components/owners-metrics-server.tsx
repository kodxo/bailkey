import React from "react";
import { getOwners } from "@/lib/dal/owners";
import { OwnersMetrics } from "./owners-metrics";

export async function OwnersMetricsServer(): Promise<React.JSX.Element> {
  const { owners, totalCount } = await getOwners();

  const activeCount = (owners || []).filter(o => o.propertiesCount > 0).length;

  return (
    <OwnersMetrics
      totalCount={totalCount || 0}
      activeCount={activeCount}
    />
  );
}
