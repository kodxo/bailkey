import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const schedules = await prisma.rentSchedule.findMany();
  return NextResponse.json({ count: schedules.length, schedules });
}
