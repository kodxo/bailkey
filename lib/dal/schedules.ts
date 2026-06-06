import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/clerk/auth-context";
import { ScheduleStatus, PaymentFrequency } from "../generated/prisma/enums";
import { Prisma } from "../generated/prisma/client";
import type { ScheduleDTO } from "@/lib/types/property";

function serializePrisma<T>(obj: unknown): T {
  if (obj === null || obj === undefined) return obj as T;
  if (typeof obj !== 'object') return obj as T;
  
  if (obj instanceof Date) return obj as T;
  if ('toNumber' in obj && typeof (obj as { toNumber: () => number }).toNumber === 'function') {
    return (obj as { toNumber: () => number }).toNumber() as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => serializePrisma<unknown>(item)) as T;
  }
  
  const res: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    res[key] = serializePrisma<unknown>((obj as Record<string, unknown>)[key]);
  }
  return res as T;
}

export async function generateRentSchedulesForLease(leaseId: string, providedOrgId?: string): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    let orgId = providedOrgId;
    if (!orgId) {
      const auth = await getAuthContext();
      orgId = auth.orgId;
    }

    const lease = await prisma.lease.findUnique({
      where: { id: leaseId },
      include: { charges: { include: { chargeType: true } } },
    });

    if (!lease || lease.organizationId !== orgId) {
      return { success: false, error: "Bail introuvable ou non autorisé" };
    }

    const schedulesToCreate = [];
    let currentPeriodStart = new Date(lease.startDate);
    
    // Générer jusqu'à la fin de l'année civile (plus loin si cycle annuel)
    const currentYear = currentPeriodStart.getUTCFullYear();
    const endOfYear = new Date(Date.UTC(currentYear, 11, 31, 23, 59, 59));
    const generationEnd = lease.endDate && lease.endDate < endOfYear ? lease.endDate : endOfYear;

    let monthStep = 1;
    if (lease.paymentFrequency === PaymentFrequency.QUARTERLY) monthStep = 3;
    if (lease.paymentFrequency === PaymentFrequency.SEMI_ANNUALLY) monthStep = 6;
    if (lease.paymentFrequency === PaymentFrequency.ANNUALLY) monthStep = 12;

    const rentAmount = typeof lease.rentAmount === 'number' ? lease.rentAmount : lease.rentAmount.toNumber();

    // Calculer les charges fixes (CREDIT) qui s'ajoutent à l'échéance du locataire
    let totalFixedCharges = 0;
    if (lease.charges && lease.charges.length > 0) {
      for (const charge of lease.charges) {
        if (charge.chargeType.accountingMode === "CREDIT") {
          totalFixedCharges += typeof charge.defaultAmount === 'number' ? charge.defaultAmount : Number(charge.defaultAmount);
        }
      }
    }

    while (currentPeriodStart <= generationEnd) {
      const year = currentPeriodStart.getUTCFullYear();
      const month = currentPeriodStart.getUTCMonth();

      // Date réelle de début du cycle normal (1er jour du mois de ce cycle)
      const cycleStart = new Date(Date.UTC(year, month, 1));
      // Fin de la période (dernier jour du mois de ce cycle)
      const cycleEnd = new Date(Date.UTC(year, month + monthStep, 0, 23, 59, 59));
      
      const periodEnd = cycleEnd > generationEnd && lease.endDate ? lease.endDate : cycleEnd;

      // Date limite de paiement (dueDate)
      let dueDay = lease.paymentDay || 5;
      const daysInFirstMonthOfCycle = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
      if (dueDay > daysInFirstMonthOfCycle) dueDay = daysInFirstMonthOfCycle;
      
      const dueDate = new Date(Date.UTC(year, month, dueDay));

      // Calcul du montant (Prorata)
      let amount = rentAmount;
      let cAmount = totalFixedCharges;
      const periodStartDay = currentPeriodStart.getUTCDate();
      
      // Si la période ne commence pas le 1er jour du cycle OU se termine avant la fin normale du cycle
      if (currentPeriodStart.getTime() > cycleStart.getTime() || periodEnd.getTime() < cycleEnd.getTime()) {
        const totalDaysInCycle = Math.round((cycleEnd.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const daysOccupied = Math.round((periodEnd.getTime() - currentPeriodStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        amount = (rentAmount / totalDaysInCycle) * daysOccupied;
        cAmount = (totalFixedCharges / totalDaysInCycle) * daysOccupied;
      }

      // Arrondir à l'entier supérieur ou décimales
      amount = Math.round(amount * 100) / 100;
      cAmount = Math.round(cAmount * 100) / 100;

      schedulesToCreate.push({
        organizationId: orgId,
        leaseId: lease.id,
        periodStart: currentPeriodStart,
        periodEnd: periodEnd,
        dueDate: dueDate,
        rentAmount: amount,
        chargesAmount: cAmount,
        totalAmount: amount + cAmount,
        amountPaid: 0,
        status: ScheduleStatus.PENDING,
        isLocked: false,
      });

      // Avancer à la période suivante
      currentPeriodStart = new Date(Date.UTC(year, month + monthStep, 1));
    }

    if (schedulesToCreate.length > 0) {
      await prisma.rentSchedule.createMany({
        data: schedulesToCreate,
      });
    }

    return { success: true, count: schedulesToCreate.length };
  } catch (error: unknown) {
    console.error("Erreur generateRentSchedulesForLease:", error);
    return { success: false, error: "Erreur lors de la génération de l'échéancier" };
  }
}

export async function getRentSchedulesByLeaseId(leaseId: string): Promise<{ success: boolean; schedules?: ScheduleDTO[]; error?: string }> {
  try {
    const { orgId } = await getAuthContext();
    const schedules = await prisma.rentSchedule.findMany({
      where: { leaseId, organizationId: orgId },
      orderBy: { periodStart: 'asc' },
      include: {
        payments: true,
        lease: {
          include: {
            tenant: true,
            property: true
          }
        }
      }
    });

    return { success: true, schedules: serializePrisma<ScheduleDTO[]>(schedules) };
  } catch (error) {
    console.error("Erreur getRentSchedulesByLeaseId:", error);
    return { success: false, error: "Erreur de récupération" };
  }
}

export async function getRentScheduleById(id: string): Promise<{ success: boolean; schedule?: ScheduleDTO; error?: string }> {
  try {
    const { orgId } = await getAuthContext();
    const schedule = await prisma.rentSchedule.findUnique({
      where: { id, organizationId: orgId },
      include: {
        payments: true,
        lease: {
          include: {
            tenant: true,
            property: true
          }
        }
      }
    });

    if (!schedule) {
      return { success: false, error: "Échéance introuvable" };
    }

    return { success: true, schedule: serializePrisma<ScheduleDTO>(schedule) };
  } catch (error) {
    console.error("Erreur getRentScheduleById:", error);
    return { success: false, error: "Erreur de récupération" };
  }
}

export async function getRentSchedules(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  month?: string;
  leaseId?: string;
}): Promise<{ 
  success: boolean; 
  schedules?: ScheduleDTO[]; 
  totalCount?: number;
  overdueCount?: number;
  pendingCount?: number;
  totalAmount?: number;
  totalPaid?: number;
  error?: string 
}> {
  try {
    const { orgId } = await getAuthContext();

    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const search = params?.search?.trim() || "";
    const statusFilter = params?.status && params.status !== "all" ? params.status : undefined;
    const month = params?.month;

    const whereClause: Prisma.RentScheduleWhereInput = { organizationId: orgId };

    if (statusFilter) {
      whereClause.status = statusFilter as ScheduleStatus;
    }
    
    if (month && month !== "all") {
      const now = new Date();
      let targetMonth = now.getMonth();
      let targetYear = now.getFullYear();
      
      if (month === "last") {
        targetMonth -= 1;
      } else if (month === "next") {
        targetMonth += 1;
      }
      
      const startOfMonth = new Date(Date.UTC(targetYear, targetMonth, 1));
      const endOfMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0, 23, 59, 59));
      whereClause.dueDate = { gte: startOfMonth, lte: endOfMonth };
    }

    if (params?.leaseId) {
      whereClause.leaseId = params.leaseId;
    }

    if (search) {
      whereClause.OR = [
        { lease: { property: { designation: { contains: search, mode: 'insensitive' } } } },
        { lease: { property: { reference: { contains: search, mode: 'insensitive' } } } },
        { lease: { tenant: { firstName: { contains: search, mode: 'insensitive' } } } },
        { lease: { tenant: { lastName: { contains: search, mode: 'insensitive' } } } },
        { lease: { tenant: { companyName: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    const skip = (page - 1) * pageSize;

    const [schedules, totalCount, overdueCount, pendingCount, aggregates] = await prisma.$transaction([
      prisma.rentSchedule.findMany({
        where: whereClause,
        orderBy: [
          // Order by status to put OVERDUE first (usually we can't custom sort by enum in Prisma easily, but we can sort by dueDate)
          { dueDate: 'asc' }
        ],
        include: {
          payments: true,
          lease: {
            include: {
              tenant: true,
              property: true
            }
          }
        },
        skip,
        take: pageSize,
      }),
      prisma.rentSchedule.count({ where: whereClause }),
      prisma.rentSchedule.count({ where: { ...whereClause, status: ScheduleStatus.OVERDUE } }),
      prisma.rentSchedule.count({ where: { ...whereClause, status: ScheduleStatus.PENDING } }),
      prisma.rentSchedule.aggregate({
        where: whereClause,
        _sum: { totalAmount: true, amountPaid: true }
      })
    ], {
      maxWait: 10000,
      timeout: 20000
    });

    return { 
      success: true, 
      schedules: serializePrisma<ScheduleDTO[]>(schedules), 
      totalCount,
      overdueCount,
      pendingCount,
      totalAmount: typeof aggregates._sum.totalAmount === 'number' ? aggregates._sum.totalAmount : aggregates._sum.totalAmount?.toNumber() || 0,
      totalPaid: typeof aggregates._sum.amountPaid === 'number' ? aggregates._sum.amountPaid : aggregates._sum.amountPaid?.toNumber() || 0
    };
  } catch (error) {
    console.error("Erreur getRentSchedules:", error);
    return { 
      success: false, 
      error: "Erreur de récupération" 
    };
  }
}

export async function deleteFuturePendingSchedules(leaseId: string): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const auth = await getAuthContext();
    const orgId = auth.orgId;

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const result = await prisma.rentSchedule.deleteMany({
      where: {
        leaseId,
        organizationId: orgId,
        status: ScheduleStatus.PENDING,
        dueDate: { gt: today },
      },
    });

    return { success: true, count: result.count };
  } catch (error: unknown) {
    console.error("Erreur deleteFuturePendingSchedules:", error);
    return { success: false, error: "Erreur lors de la suppression des échéances futures" };
  }
}

export async function updateRentScheduleAmounts(
  id: string,
  rentAmount: number,
  chargesAmount: number
): Promise<{ success: boolean; schedule?: any; error?: string }> {
  try {
    const auth = await getAuthContext();
    const existing = await prisma.rentSchedule.findUnique({ where: { id } });
    if (!existing || existing.organizationId !== auth.orgId) {
      return { success: false, error: "Échéance introuvable ou non autorisée" };
    }
    if (existing.isLocked || existing.amountPaid.toNumber() > 0) {
      return { success: false, error: "Impossible de modifier une échéance verrouillée ou avec un paiement" };
    }

    const updated = await prisma.rentSchedule.update({
      where: { id },
      data: {
        rentAmount,
        chargesAmount,
        totalAmount: rentAmount + chargesAmount,
      },
    });

    return { success: true, schedule: serializePrisma<ScheduleDTO>(updated) };
  } catch (error) {
    console.error("Erreur updateRentScheduleAmounts:", error);
    return { success: false, error: "Erreur lors de la modification de l'échéance" };
  }
}
