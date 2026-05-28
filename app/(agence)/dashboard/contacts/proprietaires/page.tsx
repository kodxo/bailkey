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

import { OwnersMetricsServer } from "./components/owners-metrics-server";
import { OwnersMetricsSkeleton } from "./components/owners-metrics-skeleton";
import { OwnersFilters } from "./components/owners-filters";
import { OwnersTableServer } from "./components/owners-table-server";
import { OwnersTableSkeleton } from "./components/owners-table-skeleton";
import { OwnersSidebarServer } from "./components/owners-sidebar-server";
import { OwnersSidebarSkeleton } from "./components/owners-sidebar-skeleton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Propriétaires | Bailkey",
  description: "Gérez vos propriétaires (bailleurs), leurs coordonnées et leur patrimoine.",
};

export default async function DashboardOwnersPage({
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
            { label: "Propriétaires" },
          ]}
        />
        <div>
          <h1 className="text-h1 text-on-background mb-xs font-bold font-display">
            Propriétaires
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Gérez vos propriétaires (bailleurs), leurs coordonnées et les biens qu'ils possèdent.
          </p>
        </div>
      </DashboardPageHeader>

      <DashboardLayout>
        {/* Metrics - independent Suspense */}
        <Suspense fallback={<OwnersMetricsSkeleton />}>
          <OwnersMetricsServer />
        </Suspense>

        <DashboardSplitGrid>
          <DashboardMain>
            {/* Search and Filters */}
            <div className="mb-md">
              <OwnersFilters />
            </div>

            {/* Table - Suspense triggered on param change */}
            <Suspense
              key={`table-${page}-${pageSize}-${search}-${type}`}
              fallback={<OwnersTableSkeleton />}
            >
              <OwnersTableServer
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
              fallback={<OwnersSidebarSkeleton />}
            >
              <OwnersSidebarServer selectedId={selectedId} mode={mode} />
            </Suspense>
          </DashboardSidebar>
        </DashboardSplitGrid>
      </DashboardLayout>
    </DashboardPageContainer>
  );
}
