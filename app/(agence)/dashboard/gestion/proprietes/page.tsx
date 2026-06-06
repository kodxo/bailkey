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

import { PropertiesMetricsServer } from "./components/properties-metrics-server";
import { PropertiesMetricsSkeleton } from "./components/properties-metrics-skeleton";
import { PropertiesFilters } from "./components/properties-filters";
import { PropertiesTableServer } from "./components/properties-table-server";
import { PropertiesTableSkeleton } from "./components/properties-table-skeleton";
import { PropertiesSidebarServer } from "./components/properties-sidebar-server";
import { PropertiesSidebarSkeleton } from "./components/properties-sidebar-skeleton";

import { getOwners } from "@/lib/dal/owners";
import { LegalEntityType } from "@/lib/generated/prisma/enums";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gestion des Propriétés | Bailkey",
  description: "Gérez votre catalogue immobilier, ajoutez de nouveaux biens et suivez leur statut locatif.",
};

export default async function DashboardPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    status?: string;
    type?: string;
    selectedId?: string;
    mode?: string;
    ownerId?: string;
    minRent?: string;
    maxRent?: string;
    roomsCount?: string;
  }>;
}): Promise<React.JSX.Element> {
  const params = await searchParams;
  const page = parseInt(params?.page || "1", 10);
  const pageSize = parseInt(params?.pageSize || "10", 10);
  const search = params?.search || "";
  const status = params?.status || "all";
  const type = params?.type || "all";
  const ownerId = params?.ownerId || "all";
  const minRent = params?.minRent;
  const maxRent = params?.maxRent;
  const roomsCount = params?.roomsCount;
  const selectedId = params?.selectedId;
  const mode = params?.mode;

  const { owners } = await getOwners();

  const formattedOwners = (owners || []).map(o => ({
    id: o.id,
    name: o.type === LegalEntityType.INDIVIDUAL ? `${o.firstName} ${o.lastName}` : (o.companyName || o.id)
  }));

  return (
    <DashboardPageContainer>
      <DashboardPageHeader>
        <BreadcrumbNav
          items={[
            { label: "Tableau de bord", href: "/dashboard" },
            { label: "Gestion Immobilière", href: "/dashboard/gestion" },
            { label: "Propriétés" },
          ]}
        />
        <div>
          <h1 className="text-h1 text-on-background mb-xs font-bold font-display">
            Mes Propriétés
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Consultez et gérez vos biens immobiliers.
          </p>
        </div>
      </DashboardPageHeader>

      <DashboardLayout>
        {/* Metrics - independent Suspense */}
        <Suspense fallback={<PropertiesMetricsSkeleton />}>
          <PropertiesMetricsServer />
        </Suspense>

        <DashboardSplitGrid>
          <DashboardMain>
            {/* Search and Filters */}
            <div className="mb-md">
              <PropertiesFilters owners={formattedOwners} />
            </div>

            {/* Table - Suspense triggered on param change */}
            <Suspense
              key={`table-${page}-${pageSize}-${search}-${status}-${type}-${ownerId}-${minRent}-${maxRent}-${roomsCount}`}
              fallback={<PropertiesTableSkeleton />}
            >
              <PropertiesTableServer
                page={page}
                pageSize={pageSize}
                search={search}
                status={status}
                type={type}
                ownerId={ownerId}
                minRent={minRent}
                maxRent={maxRent}
                roomsCount={roomsCount}
              />
            </Suspense>
          </DashboardMain>

          <DashboardSidebar>
            {/* Sidebar - Suspense triggered when selection or mode changes */}
            <Suspense
              key={`sidebar-${selectedId || "none"}-${mode || "none"}`}
              fallback={<PropertiesSidebarSkeleton />}
            >
              <PropertiesSidebarServer selectedId={selectedId} mode={mode} />
            </Suspense>
          </DashboardSidebar>
        </DashboardSplitGrid>
      </DashboardLayout>
    </DashboardPageContainer>
  );
}
