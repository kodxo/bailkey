import React from "react";
import { getRentSchedules } from "@/lib/dal/schedules";
import { SchedulesTableClient } from "./schedules-table-client";
import { serializeSchedule, type SchedulePaymentDTO } from "./schedule-serializer";

interface SchedulesTableServerProps {
  page: number;
  pageSize: number;
  search: string;
  status: string;
  month?: string;
  leaseId?: string;
}

export async function SchedulesTableServer({
  page,
  pageSize,
  search,
  status,
  month,
  leaseId,
}: SchedulesTableServerProps): Promise<React.JSX.Element> {
  const { schedules, totalCount } = await getRentSchedules({ page, pageSize, search, status, month, leaseId });

  const displaySchedules = (schedules || []).map(serializeSchedule);

  return (
    <SchedulesTableClient
      schedules={displaySchedules}
      totalCount={totalCount || 0}
      currentPage={page}
      pageSize={pageSize}
    />
  );
}
