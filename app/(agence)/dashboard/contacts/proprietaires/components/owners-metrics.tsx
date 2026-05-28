import React from "react";
import { MetricCard } from "@/components/ui/metric-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DashboardMetrics } from "@/components/layout/dashboard-split-pane";

interface OwnersMetricsProps {
  totalCount: number;
  activeCount: number;
}

export function OwnersMetrics({
  totalCount,
  activeCount,
}: OwnersMetricsProps): React.JSX.Element {
  return (
    <DashboardMetrics>
      <MetricCard value={totalCount} label="Total Propriétaires" />
      <MetricCard
        value={activeCount}
        label="Avec Propriété(s)"
        valueClassName="text-primary font-bold"
      />
      <div className="ml-auto flex items-center">
        <Link href="?mode=create" scroll={false}>
          <Button size="lg">
            <span
              className="material-symbols-outlined mr-2 select-none"
              data-icon="person_add"
            >
              person_add
            </span>
            Nouveau Propriétaire
          </Button>
        </Link>
      </div>
    </DashboardMetrics>
  );
}
