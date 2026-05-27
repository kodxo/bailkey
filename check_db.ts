import { prisma } from "./lib/db";
async function main() {
  const schedules = await prisma.rentSchedule.findMany();
  console.log("Total schedules:", schedules.length);
  if (schedules.length > 0) console.log(schedules[0]);
}
main();
