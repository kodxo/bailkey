import React, { Suspense } from "react";
import { BreadcrumbNav } from "@/components/ui/breadcrumb";
import {
  DashboardPageContainer,
  DashboardPageHeader,
} from "@/components/layout/dashboard-page-layout";
import {
  DashboardLayout,
  DashboardSplitGrid,
  DashboardMain,
  DashboardSidebar,
  DashboardToolbar,
} from "@/components/layout/dashboard-split-pane";
import { Search } from "@/components/ui/search";

import { SchedulesMetricsServer } from "./components/schedules-metrics-server";
import { SchedulesTableServer } from "./components/schedules-table-server";
import { SchedulesSidebarServer } from "./components/schedules-sidebar-server";
import { SchedulesMetricsSkeleton } from "./components/schedules-metrics-skeleton";
import { SchedulesTableSkeleton } from "./components/schedules-table-skeleton";
import { SchedulesSidebarSkeleton } from "./components/schedules-sidebar-skeleton";
import { SchedulesFilters } from "./components/schedules-filters";
import { LeaseFilterBanner } from "./components/lease-filter-banner";
import { getLeaseById, getLeases } from "@/lib/dal/leases";
import type { LeaseDTO } from "@/lib/types/property";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Échéances et Encaissements | Bailkey",
  description: "Suivi des loyers attendus et encaissements",
};

export default async function RentSchedulesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    status?: string;
    month?: string;
    selectedId?: string;
    leaseId?: string;
    paymentMethod?: string;
    hasPartial?: string;
  }>;
}): Promise<React.JSX.Element> {
  const params = await searchParams;
  const page = parseInt(params?.page || "1", 10);
  const pageSize = parseInt(params?.pageSize || "10", 10);
  const search = params?.search || "";
  const status = params?.status || "all";
  const month = params?.month || "all";
  const selectedId = params?.selectedId;
  const leaseId = params?.leaseId || "all";
  const paymentMethod = params?.paymentMethod || "all";
  const hasPartial = params?.hasPartial || "all";

  // For breadcrumb only, we fetch the lease name if leaseId is provided.
  // This is a fast, isolated fetch and doesn't block the main table/metrics
  let leaseData: LeaseDTO | null = null;
  if (leaseId && leaseId !== "all") {
    const res = await getLeaseById(leaseId);
    leaseData = res.lease;
  }

  const breadcrumbItems: { label: string; href?: string }[] = [
    { label: "Tableau de bord", href: "/dashboard" },
    { label: "Gestion Immobilière", href: "/dashboard/gestion" },
  ];

  if (leaseData) {
    breadcrumbItems.push({ label: "Baux & Contrats", href: "/dashboard/gestion/baux" });
    breadcrumbItems.push({
      label: `Contrat de ${leaseData.tenantFullName}`,
      href: `/dashboard/gestion/baux?selectedLeaseId=${leaseId}`,
    });
    breadcrumbItems.push({ label: "Échéances" });
  } else {
    breadcrumbItems.push({ label: "Échéances & Encaissements" });
  }

  const { leases } = await getLeases({ pageSize: 50 });
  const formattedLeases = (leases || []).map(l => ({
    id: l.id, name: `${l.propertyReference} - ${l.tenantFullName}`
  }));

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

      <DashboardLayout>
        {/* Metrics - independent Suspense */}
        <Suspense fallback={<SchedulesMetricsSkeleton />}>
          <SchedulesMetricsServer leaseId={leaseId !== "all" ? leaseId : undefined} />
        </Suspense>

        <DashboardSplitGrid>
          <DashboardMain>
            <LeaseFilterBanner />
            
            <div className="mb-md">
              <SchedulesFilters leases={formattedLeases} />
            </div>

            {/* Table - Suspense triggered on param change */}
            <Suspense
              key={`table-${page}-${pageSize}-${search}-${status}-${leaseId || ""}-${month}-${paymentMethod}-${hasPartial}`}
              fallback={<SchedulesTableSkeleton />}
            >
              <SchedulesTableServer
                page={page}
                pageSize={pageSize}
                search={search}
                status={status}
                month={month}
                leaseId={leaseId !== "all" ? leaseId : undefined}
                paymentMethod={paymentMethod}
                hasPartial={hasPartial}
              />
            </Suspense>
          </DashboardMain>

          <DashboardSidebar>
            {/* Sidebar - Suspense triggered when selection changes */}
            <Suspense
              key={`sidebar-${selectedId || "none"}`}
              fallback={<SchedulesSidebarSkeleton />}
            >
              <SchedulesSidebarServer selectedId={selectedId} />
            </Suspense>
          </DashboardSidebar>
        </DashboardSplitGrid>
      </DashboardLayout>
    </DashboardPageContainer>
  );
}
