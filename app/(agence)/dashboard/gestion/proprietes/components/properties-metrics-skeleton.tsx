import React from "react";
import { DashboardMetrics } from "@/components/layout/dashboard-split-pane";

export function PropertiesMetricsSkeleton(): React.JSX.Element {
  return (
    <DashboardMetrics>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-surface-container-low border border-outline-variant/30 px-md py-sm flex flex-col items-center min-w-[120px] shrink-0 shadow-sm animate-pulse"
        >
          <div className="h-8 w-20 bg-outline-variant/20 rounded mb-1" />
          <div className="h-3 w-24 bg-outline-variant/20 rounded" />
        </div>
      ))}
      <div className="ml-auto flex items-center">
        <div className="h-10 w-40 bg-outline-variant/20 rounded animate-pulse" />
      </div>
    </DashboardMetrics>
  );
}
