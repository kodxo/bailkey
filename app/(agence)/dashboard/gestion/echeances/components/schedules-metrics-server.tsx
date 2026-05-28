import React from "react";
import { getRentSchedules } from "@/lib/dal/schedules";
import { SchedulesMetrics } from "./schedules-metrics";

interface SchedulesMetricsServerProps {
  leaseId?: string;
}

export async function SchedulesMetricsServer({
  leaseId,
}: SchedulesMetricsServerProps): Promise<React.JSX.Element> {
  const { totalAmount, totalPaid, overdueCount } = await getRentSchedules({
    page: 1,
    pageSize: 1,
    leaseId,
  });

  return (
    <SchedulesMetrics
      totalAmount={totalAmount || 0}
      totalPaid={totalPaid || 0}
      overdueCount={overdueCount || 0}
    />
  );
}
