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
  paymentMethod?: string;
  hasPartial?: string;
}

export async function SchedulesTableServer({
  page,
  pageSize,
  search,
  status,
  month,
  leaseId,
  paymentMethod,
  hasPartial,
}: SchedulesTableServerProps): Promise<React.JSX.Element> {
  const { schedules, totalCount } = await getRentSchedules({ page, pageSize, search, status, month, leaseId });

  let displaySchedules = (schedules || []).map(serializeSchedule);

  if (hasPartial && hasPartial !== "all") {
    displaySchedules = displaySchedules.filter(s => 
      hasPartial === "yes" ? (s.remaining > 0 && s.remaining < s.amount) : s.remaining === 0
    );
  }

  // Not implemented in DAL, could do locally or just pass empty for now.
  // if (paymentMethod && paymentMethod !== "all") { ... }

  return (
    <SchedulesTableClient
      schedules={displaySchedules}
      totalCount={totalCount || 0}
      currentPage={page}
      pageSize={pageSize}
    />
  );
}
