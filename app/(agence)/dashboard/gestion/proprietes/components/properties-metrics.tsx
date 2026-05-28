import React from "react";
import { MetricCard } from "@/components/ui/metric-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DashboardMetrics } from "@/components/layout/dashboard-split-pane";

interface PropertiesMetricsProps {
  totalCount: number;
  availableCount: number;
  rentedCount: number;
}

export function PropertiesMetrics({
  totalCount,
  availableCount,
  rentedCount,
}: PropertiesMetricsProps): React.JSX.Element {
  return (
    <DashboardMetrics>
      <MetricCard value={totalCount} label="Total Propriétés" />
      <MetricCard
        value={availableCount}
        label="Disponibles"
        valueClassName="text-primary font-bold"
      />
      <MetricCard
        value={rentedCount}
        label="En Location"
        valueClassName="text-tertiary font-bold"
      />
      <div className="ml-auto flex items-center">
        <Link href="?mode=create" scroll={false}>
          <Button size="lg">
            <span
              className="material-symbols-outlined mr-2 select-none"
              data-icon="add"
            >
              add
            </span>
            Nouvelle Propriété
          </Button>
        </Link>
      </div>
    </DashboardMetrics>
  );
}
