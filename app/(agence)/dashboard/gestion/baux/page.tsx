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

import { LeasesMetricsServer } from "./components/leases-metrics-server";
import { LeasesTableServer } from "./components/leases-table-server";
import { LeasesSidebarServer } from "./components/leases-sidebar-server";
import { MetricsSkeleton } from "./components/metrics-skeleton";
import { TableSkeleton } from "./components/table-skeleton";
import { SidebarSkeleton } from "./components/sidebar-skeleton";
import { StatusFilter } from "./components/status-filter";

export const dynamic = "force-dynamic";

export default async function DashboardLeasesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;  
    status?: string;
    selectedLeaseId?: string;
    mode?: string;
  }>;
}): Promise<React.JSX.Element> {
  const params = await searchParams;
  const page = parseInt(params?.page || "1", 10);
  const pageSize = parseInt(params?.pageSize || "10", 10);
  const search = params?.search || "";
  const status = params?.status || "all";
  const selectedLeaseId = params?.selectedLeaseId;
  const mode = params?.mode;

  return (
    <DashboardPageContainer>
      <DashboardPageHeader>
        <BreadcrumbNav
          items={[
            { label: "Tableau de bord", href: "/dashboard" },
            { label: "Gestion Immobilière", href: "/dashboard/gestion" },
            { label: "Baux & Contrats" },
          ]}
        />
        <div>
          <h1 className="text-h1 text-on-background mb-xs font-bold font-display">
            Contrats de Location (Baux)
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Gérez vos contrats de location, le montant des cautions et les dates
            d&apos;échéance.
          </p>
        </div>
      </DashboardPageHeader>

      <DashboardLayout>
        {/* Metrics - re-renders independently */}
        <Suspense fallback={<MetricsSkeleton />}>
          <LeasesMetricsServer />
        </Suspense>

        <DashboardSplitGrid>
          <DashboardMain>
            {/* Toolbar stays interactive, never suspends */}
            <DashboardToolbar>
              <div className="flex-1 min-w-[200px] flex items-center border-b sm:border-b-0 sm:border-r border-outline-variant">
                <Search placeholder="Rechercher par propriété, référence ou locataire..." />
              </div>
              <div className="flex items-center px-sm py-xs">
                <StatusFilter />
              </div>
            </DashboardToolbar>

            {/* Table - key triggers Suspense on search/filter/page changes */}
            <Suspense
              key={`table-${page}-${pageSize}-${search}-${status}`}
              fallback={<TableSkeleton />}
            >
              <LeasesTableServer
                page={page}
                pageSize={pageSize}
                search={search}
                status={status}
              />
            </Suspense>
          </DashboardMain>

          <DashboardSidebar>
            {/* Sidebar - key triggers Suspense on selection/mode changes */}
            <Suspense
              key={`sidebar-${selectedLeaseId || "none"}-${mode || "view"}`}
              fallback={<SidebarSkeleton />}
            >
              <LeasesSidebarServer
                selectedLeaseId={selectedLeaseId}
                mode={mode}
              />
            </Suspense>
          </DashboardSidebar>
        </DashboardSplitGrid>
      </DashboardLayout>
    </DashboardPageContainer>
  );
}
