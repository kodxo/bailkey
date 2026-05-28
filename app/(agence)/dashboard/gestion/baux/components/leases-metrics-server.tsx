import React from "react";
import { getLeases } from "@/lib/dal/leases";
import { MetricCard } from "@/components/ui/metric-card";
import {
  DashboardMetrics,
} from "@/components/layout/dashboard-split-pane";
import { NewLeaseButton } from "./new-lease-button";

export async function LeasesMetricsServer(): Promise<React.JSX.Element> {
  const { totalCount, activeCount, draftCount } = await getLeases({ page: 1, pageSize: 1 });

  return (
    <DashboardMetrics>
      <MetricCard value={totalCount} label="Total Baux" />
      <MetricCard
        value={activeCount}
        label="Baux Actifs"
        valueClassName="text-primary font-bold"
      />
      <MetricCard
        value={draftCount}
        label="Brouillons"
        valueClassName="text-tertiary font-bold"
      />
      <div className="ml-auto flex items-center">
        <NewLeaseButton />
      </div>
    </DashboardMetrics>
  );
}
