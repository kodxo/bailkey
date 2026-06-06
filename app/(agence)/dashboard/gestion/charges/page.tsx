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
} from "@/components/layout/dashboard-split-pane";
import { LeaseChargesTableServer } from "./components/lease-charges-table-server";

export const metadata = {
  title: "Lignes de Charges | Bailkey",
};

interface PageProps {
  searchParams: {
    page?: string;
    pageSize?: string;
    search?: string;
    propertyId?: string;
    tenantId?: string;
    chargeTypeId?: string;
  };
}

export default function LeaseChargesPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.pageSize) || 10;
  const { search, propertyId, tenantId, chargeTypeId } = searchParams;

  return (
    <DashboardPageContainer>
      <DashboardPageHeader>
        <BreadcrumbNav
          items={[
            { label: "Tableau de bord", href: "/dashboard" },
            { label: "Gestion Immobilière", href: "/dashboard/gestion" },
            { label: "Lignes de Charges" },
          ]}
        />
        <div>
          <h1 className="text-h1 text-on-background mb-xs font-bold font-display">
            Lignes de Charges
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Visualisez et gérez les charges associées à vos différents baux.
          </p>
        </div>
      </DashboardPageHeader>

      <DashboardLayout>
        <DashboardSplitGrid>
          <DashboardMain>
            <Suspense
              key={`table-${page}-${pageSize}-${search || "none"}-${propertyId || "all"}-${tenantId || "all"}-${chargeTypeId || "all"}`}
              fallback={<div className="h-64 flex items-center justify-center"><span className="material-symbols-outlined animate-spin text-primary">progress_activity</span></div>}
            >
              <LeaseChargesTableServer
                page={page}
                pageSize={pageSize}
                search={search}
                propertyId={propertyId}
                tenantId={tenantId}
                chargeTypeId={chargeTypeId}
              />
            </Suspense>
          </DashboardMain>
        </DashboardSplitGrid>
      </DashboardLayout>
    </DashboardPageContainer>
  );
}
