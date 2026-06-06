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
import { LeasesFilters } from "./components/leases-filters";
import { getProperties } from "@/lib/dal/properties";
import { getTenants } from "@/lib/dal/tenants";

export const dynamic = "force-dynamic";

export default async function DashboardLeasesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;  
    status?: string;
    frequency?: string;
    selectedLeaseId?: string;
    mode?: string;
    propertyId?: string;
    tenantId?: string;
    minRent?: string;
    maxRent?: string;
    hasDeposit?: string;
  }>;
}): Promise<React.JSX.Element> {
  const params = await searchParams;
  const page = parseInt(params?.page || "1", 10);
  const pageSize = parseInt(params?.pageSize || "10", 10);
  const search = params?.search || "";
  const status = params?.status || "all";
  const frequency = params?.frequency || "all";
  const selectedLeaseId = params?.selectedLeaseId;
  const mode = params?.mode;
  
  const propertyId = params?.propertyId || "all";
  const tenantId = params?.tenantId || "all";
  const minRent = params?.minRent;
  const maxRent = params?.maxRent;
  const hasDeposit = params?.hasDeposit;

  const [{ properties }, { tenants }] = await Promise.all([
    getProperties(),
    getTenants(),
  ]);

  const formattedProperties = (properties || []).map(p => ({
    id: p.id, name: p.designation
  }));

  const formattedTenants = (tenants || []).map(t => ({
    id: t.id, name: `${t.firstName || ""} ${t.lastName || ""} ${t.companyName || ""}`.trim() || t.id
  }));

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
            Gérez vos locations, signez de nouveaux baux et suivez les échéances.
          </p>
        </div>
      </DashboardPageHeader>

      <DashboardLayout>
        {/* Metrics - independent Suspense */}
        <Suspense fallback={<MetricsSkeleton />}>
          <LeasesMetricsServer />
        </Suspense>

        <DashboardSplitGrid>
          <DashboardMain>
            <div className="mb-md">
              <LeasesFilters properties={formattedProperties} tenants={formattedTenants} />
            </div>

            {/* Table - Suspense triggered on param change */}
            <Suspense
              key={`table-${page}-${pageSize}-${search}-${status}-${frequency}-${propertyId}-${tenantId}-${minRent}-${maxRent}-${hasDeposit}`}
              fallback={<TableSkeleton />}
            >
              <LeasesTableServer
                page={page}
                pageSize={pageSize}
                search={search}
                status={status}
                frequency={frequency}
                propertyId={propertyId}
                tenantId={tenantId}
                minRent={minRent}
                maxRent={maxRent}
                hasDeposit={hasDeposit}
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
