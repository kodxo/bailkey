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
} from "@/components/layout/dashboard-split-pane";

import { TenantsMetricsServer } from "./components/tenants-metrics-server";
import { TenantsMetricsSkeleton } from "./components/tenants-metrics-skeleton";
import { TenantsFilters } from "./components/tenants-filters";
import { TenantsTableServer } from "./components/tenants-table-server";
import { TenantsTableSkeleton } from "./components/tenants-table-skeleton";
import { TenantsSidebarServer } from "./components/tenants-sidebar-server";
import { TenantsSidebarSkeleton } from "./components/tenants-sidebar-skeleton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Locataires | Bailkey",
  description: "Gérez vos locataires, leurs informations personnelles et leurs baux.",
};

export default async function DashboardTenantsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    type?: string;
    selectedId?: string;
    mode?: string;
  }>;
}): Promise<React.JSX.Element> {
  const params = await searchParams;
  const page = parseInt(params?.page || "1", 10);
  const pageSize = parseInt(params?.pageSize || "10", 10);
  const search = params?.search || "";
  const type = params?.type || "all";
  const selectedId = params?.selectedId;
  const mode = params?.mode;

  return (
    <DashboardPageContainer>
      <DashboardPageHeader>
        <BreadcrumbNav
          items={[
            { label: "Tableau de bord", href: "/dashboard" },
            { label: "Contacts", href: "/dashboard/contacts" },
            { label: "Locataires" },
          ]}
        />
        <div>
          <h1 className="text-h1 text-on-background mb-xs font-bold font-display">
            Locataires
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Gérez vos locataires, leurs informations personnelles et le suivi de leurs baux.
          </p>
        </div>
      </DashboardPageHeader>

      <DashboardLayout>
        {/* Metrics - independent Suspense */}
        <Suspense fallback={<TenantsMetricsSkeleton />}>
          <TenantsMetricsServer />
        </Suspense>

        <DashboardSplitGrid>
          <DashboardMain>
            {/* Search and Filters */}
            <div className="mb-md">
              <TenantsFilters />
            </div>

            {/* Table - Suspense triggered on param change */}
            <Suspense
              key={`table-${page}-${pageSize}-${search}-${type}`}
              fallback={<TenantsTableSkeleton />}
            >
              <TenantsTableServer
                page={page}
                pageSize={pageSize}
                search={search}
                type={type}
              />
            </Suspense>
          </DashboardMain>

          <DashboardSidebar>
            {/* Sidebar - Suspense triggered when selection or mode changes */}
            <Suspense
              key={`sidebar-${selectedId || "none"}-${mode || "none"}`}
              fallback={<TenantsSidebarSkeleton />}
            >
              <TenantsSidebarServer selectedId={selectedId} mode={mode} />
            </Suspense>
          </DashboardSidebar>
        </DashboardSplitGrid>
      </DashboardLayout>
    </DashboardPageContainer>
  );
}
