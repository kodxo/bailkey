"use client";

import { useEffect, useState } from "react";
import { fetchLeaseSchedulesAction } from "@/lib/actions/schedules.actions";
import { ScheduleStatusBadge } from "./schedule-status-badge";
import { ScheduleRowActions } from "@/app/(agence)/dashboard/gestion/echeances/schedule-row-actions";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
    maximumFractionDigits: 0,
  }).format(amount);
};

export function LeaseSchedulesList({ leaseId }: { leaseId: string }) {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetchLeaseSchedulesAction(leaseId).then((res) => {
      if (active && res.success) {
        setSchedules(res.schedules || []);
      }
      if (active) setLoading(false);
    });

    return () => { active = false };
  }, [leaseId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-surface-container-lowest border border-outline-variant rounded-none">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">
          progress_activity
        </span>
        <p className="text-body-md text-on-surface-variant font-medium">
          Chargement de l'échéancier...
        </p>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="py-8 text-center bg-surface-container-lowest border border-outline-variant rounded-none">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant/50 mb-2">calendar_month</span>
        <p className="text-title-md text-on-surface-variant font-medium">Aucune échéance</p>
        <p className="text-body-sm text-on-surface-variant/70">Cet historique est vide pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {schedules.map(sch => {
        const amt = Number(sch.amount);
        const paid = Number(sch.amountPaid);
        const remaining = amt - paid;

        // Déterminer la couleur de la bordure gauche en fonction du statut
        let borderLeftColor = "border-outline-variant";
        if (sch.status === "OVERDUE") borderLeftColor = "border-error";
        if (sch.status === "PAID") borderLeftColor = "border-primary";
        if (sch.status === "PARTIAL") borderLeftColor = "border-orange-500";
        if (sch.status === "PENDING") borderLeftColor = "border-surface-variant";

        return (
          <div 
            key={sch.id} 
            className={`flex flex-col gap-4 p-4 bg-surface-container-lowest border border-outline-variant border-l-4 ${borderLeftColor} rounded-none shadow-xs hover:bg-surface-container-low transition-colors group`}
          >
            {/* Header: Date et Statut */}
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-title-md font-bold text-on-surface capitalize">
                  {new Date(sch.periodStart).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </h4>
                <p className="text-body-sm text-on-surface-variant flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                  Échéance au {new Date(sch.dueDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <ScheduleStatusBadge status={sch.status} />
            </div>
            
            {/* Corps: Montants avec barres de progression */}
            <div className="grid grid-cols-2 gap-4 bg-surface-container/30 p-3 border border-outline-variant/50">
              <div className="flex flex-col">
                <span className="text-body-sm text-on-surface-variant uppercase tracking-wider text-[11px] font-bold">À payer</span>
                <span className="text-title-md font-bold text-on-surface">{formatCurrency(amt)}</span>
              </div>
              <div className="flex flex-col items-end text-right">
                <span className="text-body-sm text-on-surface-variant uppercase tracking-wider text-[11px] font-bold">Reste à charge</span>
                <span className={`text-title-md font-bold ${remaining > 0 ? (sch.status === "OVERDUE" ? "text-error" : "text-orange-600") : "text-primary"}`}>
                  {formatCurrency(remaining)}
                </span>
              </div>
            </div>
            
            {/* Footer: Actions */}
            <div className="flex justify-end pt-2 border-t border-outline-variant/50">
              <ScheduleRowActions 
                schedule={sch} 
                remaining={remaining} 
                expectedAmount={amt} 
                paidAmount={paid} 
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
