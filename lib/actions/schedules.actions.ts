"use server"

import { getRentSchedulesByLeaseId, getRentSchedules, updateRentScheduleAmounts } from "@/lib/dal/schedules";

export async function fetchLeaseSchedulesAction(leaseId: string) {
  const result = await getRentSchedulesByLeaseId(leaseId);
  return result;
}

export async function fetchGlobalSchedulesAction() {
  const result = await getRentSchedules();
  return result;
}

import { z } from "zod";
import { revalidatePath } from "next/cache";

const UpdateScheduleSchema = z.object({
  id: z.string().min(1),
  rentAmount: z.coerce.number().min(0),
  chargesAmount: z.coerce.number().min(0),
});

export async function updateScheduleAmountsAction(prevState: any, formData: FormData) {
  const validated = UpdateScheduleSchema.safeParse({
    id: formData.get("id"),
    rentAmount: formData.get("rentAmount"),
    chargesAmount: formData.get("chargesAmount"),
  });

  if (!validated.success) {
    return { success: false, error: "Validation échouée", errors: validated.error.flatten().fieldErrors };
  }

  const { id, rentAmount, chargesAmount } = validated.data;
  const result = await updateRentScheduleAmounts(id, rentAmount, chargesAmount);

  if (result.success) {
    revalidatePath("/dashboard/gestion/echeances");
    if (result.schedule?.leaseId) {
      revalidatePath(`/dashboard/gestion/baux/${result.schedule.leaseId}`);
    }
  }

  return result;
}
