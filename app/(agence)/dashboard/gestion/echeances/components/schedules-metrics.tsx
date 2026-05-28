import React from "react";
import { MetricCard } from "@/components/ui/metric-card";
import { Button } from "@/components/ui/button";
import { DashboardMetrics } from "@/components/layout/dashboard-split-pane";

interface SchedulesMetricsProps {
  totalAmount: number;
  totalPaid: number;
  overdueCount: number;
}

export function SchedulesMetrics({ totalAmount, totalPaid, overdueCount }: SchedulesMetricsProps): React.JSX.Element {
  const totalRestant = totalAmount - totalPaid;
  const tauxRecouvrement = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;

  return (
    <DashboardMetrics>
      <MetricCard
        value={new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(totalRestant)}
        label="RESTANT À ENCAISSER"
        valueClassName="text-on-surface"
      />
      <MetricCard
        value={`${tauxRecouvrement}%`}
        label="TAUX DE RECOUVREMENT"
        valueClassName="text-primary"
      />
      <MetricCard
        value={overdueCount.toString()}
        label="URGENCES (RETARDS)"
        valueClassName="text-error font-bold"
      />
      
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm">
          <span className="material-symbols-outlined mr-2 select-none text-sm" data-icon="download">download</span>
          Exporter
        </Button>
        <Button size="sm" variant="destructive" className="font-semibold shadow-sm" disabled={overdueCount === 0}>
          <span className="material-symbols-outlined mr-2 select-none text-sm" data-icon="campaign">campaign</span>
          Relancer ({overdueCount})
        </Button>
      </div>
    </DashboardMetrics>
  );
}
