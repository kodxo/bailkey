"use client";

import { Button } from "@/components/ui/button";
import { ScheduleStatus } from "@/lib/generated/prisma/enums";
import type { ScheduleDTO } from "@/lib/types/property";

import { useState, useActionState, useEffect } from "react";
import { generateReceipt } from "@/lib/pdf/generate-receipt";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updateScheduleAmountsAction } from "@/lib/actions/schedules.actions";
import { toast } from "sonner";

export function ScheduleRowActions({
  schedule,
  remaining,
  expectedAmount,
  paidAmount,
}: {
  schedule: ScheduleDTO;
  remaining: number;
  expectedAmount: number;
  paidAmount: number;
}) {
  const handleDownload = () => {
    const amount = typeof schedule.totalAmount === 'number' ? schedule.totalAmount : Number(schedule.totalAmount);
    const mockSch = {
      id: schedule.id,
      tenantName: schedule.lease?.tenant ? `${schedule.lease.tenant.lastName} ${schedule.lease.tenant.firstName}` : "Locataire Inconnu",
      propertyInfo: schedule.lease?.property ? schedule.lease.property.designation : "Bien Inconnu",
      date: new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(schedule.dueDate)),
      amount: amount,
      remaining: remaining,
      status: schedule.status,
      isLocked: schedule.isLocked,
      payments: schedule.payments ? schedule.payments.map((p) => ({
        id: p.id,
        amount: typeof p.amount === 'number' ? p.amount : Number(p.amount),
        date: new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(p.paymentDate)),
        method: p.paymentMethod,
        reference: p.reference
      })) : []
    };
    generateReceipt(mockSch as any);
  };

  const canEdit = !schedule.isLocked && paidAmount === 0;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editState, editAction, isEditing] = useActionState(updateScheduleAmountsAction, null);

  useEffect(() => {
    if (editState?.success) {
      toast.success("Échéance modifiée avec succès.");
      setIsEditOpen(false);
    } else if (editState?.error) {
      toast.error(editState.error);
    }
  }, [editState]);

  return (
    <div className="flex gap-2 items-center">
      {canEdit && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-on-surface-variant hover:text-primary">
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier l'échéance</DialogTitle>
            </DialogHeader>
            <form action={editAction} className="flex flex-col gap-4 py-4">
              <input type="hidden" name="id" value={schedule.id} />
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Loyer de base</label>
                <Input name="rentAmount" type="number" defaultValue={Number(schedule.rentAmount)} required />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Charges additionnelles</label>
                <Input name="chargesAmount" type="number" defaultValue={Number(schedule.chargesAmount)} required />
                <p className="text-xs text-on-surface-variant">
                  Modifiez ce montant si des charges variables (ex: facture d'eau) s'appliquent pour ce mois.
                </p>
              </div>

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>Annuler</Button>
                <Button type="submit" disabled={isEditing}>{isEditing ? "Enregistrement..." : "Enregistrer"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
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
