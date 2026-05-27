"use server"

import { getRentSchedulesByLeaseId, getRentSchedules } from "@/lib/dal/schedules";

export async function fetchLeaseSchedulesAction(leaseId: string) {
  const result = await getRentSchedulesByLeaseId(leaseId);
  return JSON.parse(JSON.stringify(result));
}

export async function fetchGlobalSchedulesAction() {
  const result = await getRentSchedules();
  return JSON.parse(JSON.stringify(result));
}
