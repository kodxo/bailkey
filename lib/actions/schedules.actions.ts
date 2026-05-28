"use server"

import { getRentSchedulesByLeaseId, getRentSchedules } from "@/lib/dal/schedules";

export async function fetchLeaseSchedulesAction(leaseId: string) {
  const result = await getRentSchedulesByLeaseId(leaseId);
  return result;
}

export async function fetchGlobalSchedulesAction() {
  const result = await getRentSchedules();
  return result;
}
