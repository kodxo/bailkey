import { Suspense } from "react";
import { BreadcrumbNav } from "@/components/ui/breadcrumb";
import { SchedulesDashboard } from "./schedules-dashboard";
import { SchedulesSkeleton } from "./schedules-skeleton";
import {
  DashboardPageContainer,
  DashboardPageHeader,
} from "@/components/layout/dashboard-page-layout";
import { getRentSchedules, getRentScheduleById } from "@/lib/dal/schedules";
import { getLeaseById } from "@/lib/dal/leases";

export const metadata = {
  title: "Échéances et Encaissements | Bailkey",
  description: "Suivi des loyers attendus et encaissements",
};

export default async function RentSchedulesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string; search?: string; status?: string; selectedId?: string; leaseId?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params?.page || "1", 10);
  const pageSize = parseInt(params?.pageSize || "10", 10);
  const search = params?.search || "";
  const status = params?.status || "all";
  const selectedId = params?.selectedId;
  const leaseId = params?.leaseId;

  const [schedulesData, selectedScheduleData, leaseData] = await Promise.all([
    getRentSchedules({ page, pageSize, search, status, leaseId }),
    selectedId ? getRentScheduleById(selectedId) : Promise.resolve({ schedule: null }),
    leaseId ? getLeaseById(leaseId) : Promise.resolve({ lease: null })
  ]);

  const { schedules, totalCount, overdueCount, pendingCount, totalAmount, totalPaid } = schedulesData;
  const initialSelectedSchedule = selectedScheduleData.schedule;

  const breadcrumbItems: { label: string; href?: string }[] = [
    { label: "Tableau de bord", href: "/dashboard" },
    { label: "Gestion Immobilière", href: "/dashboard/gestion" },
  ];

  if (leaseData.lease) {
    breadcrumbItems.push({ label: "Baux & Contrats", href: "/dashboard/gestion/baux" });
    breadcrumbItems.push({ 
      label: `Contrat de ${leaseData.lease.tenantFullName}`, 
      href: `/dashboard/gestion/baux?selectedLeaseId=${leaseId}` 
    });
    breadcrumbItems.push({ label: "Échéances" });
  } else {
    breadcrumbItems.push({ label: "Échéances & Encaissements" });
  }

  return (
    <DashboardPageContainer>
      <DashboardPageHeader>
        <BreadcrumbNav items={breadcrumbItems} />
        <div>
          <h1 className="text-h1 text-on-background mb-xs font-bold font-display">
            Échéances et Encaissements
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Suivi des loyers attendus, enregistrement des paiements et gestion
            des relances.
          </p>
        </div>
      </DashboardPageHeader>

      <Suspense fallback={<SchedulesSkeleton />} key={JSON.stringify(params)}>
        <SchedulesDashboard 
          initialSchedules={schedules as any} 
          initialSelectedSchedule={initialSelectedSchedule as any}
          totalCount={totalCount || 0}
          overdueCount={overdueCount || 0}
          pendingCount={pendingCount || 0}
          totalAmount={totalAmount || 0}
          totalPaid={totalPaid || 0}
          currentPage={page}
          pageSize={pageSize}
          initialSearch={search}
          initialStatus={status}
          initialLeaseId={leaseId}
        />
      </Suspense>
    </DashboardPageContainer>
  );
}
