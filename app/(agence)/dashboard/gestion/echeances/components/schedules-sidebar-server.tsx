import React from "react";
import { getRentScheduleById } from "@/lib/dal/schedules";
import { ScheduleDetailsPane } from "./schedule-details-pane";
import { serializeSchedule, type ScheduleDisplayDTO } from "./schedule-serializer";

interface SchedulesSidebarServerProps {
  selectedId?: string;
}

export async function SchedulesSidebarServer({
  selectedId,
}: SchedulesSidebarServerProps): Promise<React.JSX.Element> {
  let selectedSchedule: ScheduleDisplayDTO | null = null;

  if (selectedId) {
    const { schedule } = await getRentScheduleById(selectedId);
    if (schedule) {
      selectedSchedule = serializeSchedule(schedule);
    }
  }

  return <ScheduleDetailsPane selectedSchedule={selectedSchedule} />;
}
