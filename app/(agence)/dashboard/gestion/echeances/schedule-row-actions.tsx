"use client";

import { Button } from "@/components/ui/button";
import { ScheduleStatus } from "@/lib/generated/prisma/enums";

import { generateReceipt } from "@/lib/pdf/generate-receipt";

export function ScheduleRowActions({
  schedule,
  remaining,
  expectedAmount,
  paidAmount,
}: {
  schedule: any;
  remaining: number;
  expectedAmount: number;
  paidAmount: number;
}) {
  const handleDownload = () => {
    const amount = typeof schedule.amount === 'number' ? schedule.amount : Number(schedule.amount);
    const mockSch = {
      id: schedule.id,
      tenantName: schedule.lease?.tenant ? `${schedule.lease.tenant.lastName} ${schedule.lease.tenant.firstName}` : "Locataire Inconnu",
      propertyInfo: schedule.lease?.property ? schedule.lease.property.name : "Bien Inconnu",
      date: new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(schedule.dueDate)),
      amount: amount,
      remaining: remaining,
      status: schedule.status,
      isLocked: schedule.isLocked,
      payments: schedule.payments ? schedule.payments.map((p: any) => ({
        id: p.id,
        amount: typeof p.amount === 'number' ? p.amount : Number(p.amount),
        date: new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(p.paymentDate)),
        method: p.paymentMethod,
        reference: p.reference
      })) : []
    };
    generateReceipt(mockSch as any);
  };

  return (
    <div className="flex gap-2">
      {remaining > 0 && (
        <Button variant="outline" size="sm" onClick={() => alert("Pour encaisser, rendez-vous dans le Tableau de Bord des Échéances.")}>
          Encaisser
        </Button>
      )}
      {paidAmount > 0 && (
        <Button variant="ghost" size="sm" onClick={handleDownload}>
          Quittance
        </Button>
      )}
    </div>
  );
}
